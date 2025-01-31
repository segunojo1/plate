"use client";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { SetupProvider } from "@/context/SetupContext";
import { MainLayoutContextProvider } from "@/context/LayoutContext";
import { ChatBotContextProvider } from "@/context/ChatBotContext";
import { MealsContextProvider } from "@/context/MealsContext";
import { DashboardContextProvider } from "@/context/DashboardContext";
import { ScannerContextProvider } from "@/context/ScannerContext";
import { BlogContextProvider } from "@/context/BlogContext";
import { UserProvider } from "@/context/UserContext";
import { SessionProvider } from "next-auth/react";
import { store } from "@/redux/store";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import nProgress from "nprogress";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Provider store={store}>
      <UserProvider>
        <BlogContextProvider>
          <SetupProvider>
            <DashboardContextProvider>
              <MealsContextProvider>
                <ScannerContextProvider>
                  <ChatBotContextProvider>
                    <MainLayoutContextProvider>
                      <SessionProvider>
                        {children}
                        <ToastContainer />
                      </SessionProvider>
                    </MainLayoutContextProvider>
                  </ChatBotContextProvider>
                </ScannerContextProvider>
              </MealsContextProvider>
            </DashboardContextProvider>
          </SetupProvider>
        </BlogContextProvider>
      </UserProvider>
    </Provider>
  );
}
