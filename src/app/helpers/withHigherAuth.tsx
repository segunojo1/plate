// utils/withAuth.tsx
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import isAuthenticated from './isAuthenticated';
import { axiosKonsumeInstance } from '@/http/konsume';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const withHigherAuth = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = Cookies.get('ktn');
        const isLoggedIn = isAuthenticated(token as string);

        if (!isLoggedIn) {
          Cookies.remove('ktn');
          router.push('/auth/login');
          return;
        }

        try {
          // Make an API request to verify the token
          const response = await axiosKonsumeInstance.get('/api/profile/profileByUserId', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              id: Cookies.get('userid'),
            },
          });
          console.log(response);
          
          if (response.data?.value == true) {
            router.push('/dashboard');
          }
        } catch {
          Cookies.remove('ktn');
          router.push('/auth/login');
        }
      };

      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withHigherAuth;
