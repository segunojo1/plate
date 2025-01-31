"use client"

import React, { useContext, useEffect, useState } from "react";
import ScannerBody from "@/modules/scanner/ScannerBody";
import MainLayout from "@/components/Layout/MainLayout";
import Image from "next/image";
import SetupContext from "@/context/SetupContext";
import { useUserContext } from "@/context/UserContext";

const Scanner = () => {
  const { setShowScanner }: any = useContext(SetupContext);
  const {username} = useUserContext();
const [firstName, setFirstName] = useState(username?.split(" ")[0] ?? "");
useEffect(() => {
  
  setFirstName(username?.split(" ")[0] ?? "");
}, [username]);

  return (
    <div className="font-satoshi">
      <MainLayout fixedTopbar={true} includeMarginTop={true}>
        <div
          className="min-h-screen"
        >
          <div className="flex justify-between mb-4">
            <div className="flex flex-col gap-7">

              <div className="relative w-fit">
                <Image src='/multipleline.svg' alt='multi line' height={141} width={153} className='md:w-[153px] w-[60px]  absolute bottom-0 top-0 my-auto right-0 -z-50' />
                <h1 className="md:text-desktop-heading1 text-[28px]/[40px] font-bold z-50">Hello, {firstName ? firstName : '..'}  </h1>
              </div>
              <p className=" text-mobile-feature md:text-desktop-highlight italic max-w-[450px]">Chat with our AI bot for personalized nutrition tips, recipes, and meal plans. Get instant, tailored advice to reach your health goals!</p>
            </div>
            <div onClick={() => setShowScanner(true)}>
              <Image src='/tryscanner.svg' alt='multi line' height={141} width={153} className=' ' />
            </div>
          </div>
          <ScannerBody />
        </div>
      </MainLayout>
    </div>
  );
};

export default (Scanner);
