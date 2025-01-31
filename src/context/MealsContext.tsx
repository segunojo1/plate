'use client'
import React, { createContext, useEffect, useRef, useState } from "react";
import { axiosKonsumeInstance } from "@/http/konsume";
import { retry } from "@/app/helpers/retryapi";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "./UserContext";

const MealsContext = createContext({} as any);
export default MealsContext;

export function MealsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [user, setUser] = useState<string | undefined>();
  const [tempMeals, setTempMeals] = useState(recommendedMeals);
  const [generatingMeal, setGeneratingMeal] = useState<boolean>(false);
  const [loadingMeal, setLoadingMeal] = useState(false);

  const dataFetchedRef = useRef(false);
  const router = useRouter(); // Get the current route
  const pathname = usePathname()
  const { getProfileID } = useUserContext();

  useEffect(() => {
    console.log("hi");

    const fetchMeals = async () => {
      try {
        setLoadingMeal(true);
        const { data } = await axiosKonsumeInstance.get(
          "/api/MealRecommendation/GenerateMeals",
          {
            params: { profileId: await getProfileID() },
          }
        );
        console.log("fetching meals");

        setRecommendedMeals(data.$values);
        setTempMeals(data.$values);
        const today = new Date().toISOString().split("T")[0];
        if (data.$values.length < 2) {
          console.log("Retrying due to insufficient meal data...");
          await retry(fetchMeals, 3, 10000);
        } else {
          console.log("Meals fetched successfully:", data.$values);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "recommendedMeals",
              JSON.stringify(data.$values)
            );
          }
        }
        setLoadingMeal(false);
        console.log("fetched meals");
        localStorage.setItem("lastFetchDate", today);
      } catch (error) {
        console.error("Fetch Meals Error:", error);
        localStorage.removeItem("lastFetchDate");
      }
    };

    const checkAndFetchMeals = async () => {
      console.log("meal fetch text");

      if (typeof window !== "undefined") {
        setLoadingMeal(true);
        const lastFetchDate = localStorage.getItem("lastFetchDate");
        const today = new Date().toISOString().split("T")[0];

        if (lastFetchDate !== today) {
          await fetchMeals();
        } else {
          const cachedMeals = JSON.parse(
            localStorage.getItem("recommendedMeals") || "[]"
          );
          setRecommendedMeals(cachedMeals);
          setTempMeals(cachedMeals);
          setLoadingMeal(false);
          console.log(recommendedMeals);
        }
      }

      setMidnightTimer(fetchMeals);
    };

    if (pathname === "/dashboard" || pathname === "/meals") {
      checkAndFetchMeals();
    }
  }, [pathname]);

  // Set a timer to fetch new data at the next 12:00 AM
  const setMidnightTimer = (fetchMeals: any) => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to midnight of the next day

    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      fetchMeals();
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "lastFetchDate",
          new Date().toISOString().split("T")[0]
        );
      }
      setMidnightTimer(fetchMeals); // Set the timer again for the next day
    }, timeUntilMidnight);
  };

  const contextValue: any = {
    recommendedMeals,
    setRecommendedMeals,
    dataFetchedRef,
    setMidnightTimer,
    user,
    setUser,
    tempMeals,
    setTempMeals,
    generatingMeal,
    setGeneratingMeal,
    loadingMeal,
  };

  return (
    <MealsContext.Provider value={contextValue}>
      {children}
    </MealsContext.Provider>
  );
}
