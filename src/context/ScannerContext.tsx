'use client'
import { ChangeEvent, createContext, useEffect, useState } from 'react';
import { MainLayoutContextProps } from '../@types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { toast } from 'react-toastify';
import { useUserContext } from './UserContext';
import { usePathname } from 'next/navigation';

const ScannerContext = createContext<MainLayoutContextProps>({} as any);
export default ScannerContext;

export function ScannerContextProvider({ children }: { children: React.ReactNode }) {
    const API_KEY: string | undefined = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!API_KEY) {
      throw new Error("NEXT_PUBLIC_GEMINI_KEY is not defined");
    }
    const pathname = usePathname()
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<string | StaticImport>("");
    const [bitImage, setBitImage] = useState("");
    const [result, setResult] = useState("");
    const [showScanner, setShowScanner] = useState(true);
    const { userGoals, allergies} = useUserContext();

    const [queryText, setQueryText] = useState(
      `Whats in this image? Is it a food? What is in this food? with my information like my goal of ${userGoals}, health conditions  ${allergies} if this is not a food say this is not an image of a food`
    );
  
  useEffect(() => {
    console.log(userGoals);
    setQueryText(`Whats in this image? Is it a food? What is in this food? with my information like my goal of ${userGoals}, health conditions  ${allergies} if this is not a food say this is not an image of a food`)
  }, [pathname])
  
    const handleImageChange = (
      event: ChangeEvent<HTMLInputElement> | any
    ): void => {
      const file: any = event.target.files[0];
  
      if (file) {
        getBase64(file)
          .then((file: any) => {
            setImage(file);
          })
          .catch((e) => console.log(e));
  
        generativeFile(file).then((img: any) => {
          setBitImage(img);
        });
      }
    };
  
    const generativeFile = async (file: any) => {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader: any = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
      });
  
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      };
    };
    const getBase64 = (file: File) =>
      new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(`Error: ${error}`);
      });
  
    const handleRecognize = async (): Promise<void> => {
      if (image) {
        setShowScanner((prev:any) => !prev)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
          setLoading(prev => !prev);
        const result: any = await model.generateContent([queryText, bitImage]);
  
          const response = await result.response;
          const text = await response.text();
          setResult(text);
        } catch (error) {
          console.error("Error fetching result:", error);
          setResult("");
        } finally {
          setLoading(prev => !prev);
        }
        console.log(queryText);
      } else {
        toast.error("Input an image!");
      }
    };

  const contextValue: any = {
    showScanner, setShowScanner, image, setImage, bitImage, setBitImage, result, setResult, handleImageChange, handleRecognize, loading
  };

  return <ScannerContext.Provider value={contextValue}>{children}</ScannerContext.Provider>;
}
