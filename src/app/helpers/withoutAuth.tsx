"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "./isAuthenticated";
import Cookies from "js-cookie";

const withoutAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("ktn");
      const isLoggedIn = isAuthenticated(token || "");
      if (isLoggedIn) {
        router.push("/dashboard");
      }
    }, [router]);

    // Pass all props to the wrapped component
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
