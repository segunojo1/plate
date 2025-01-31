"use client"

import React, { useEffect } from "react";
import isAuthenticated from "./isAuthenticated";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// this would change later on once backend has the authentication
// working.

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const Wrapper: React.FC<P> = (props:any) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("ktn");
      const isLoggedIn = isAuthenticated(token as string);
      if (!isLoggedIn) {
        if (typeof window !== 'undefined') {
          localStorage.clear();
      }
        router.push("/auth/login");
        Cookies.remove("ktn");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wrappedComponent = React.createElement(WrappedComponent, props);
    return wrappedComponent;
  };

  return Wrapper;
};

export default withAuth;
