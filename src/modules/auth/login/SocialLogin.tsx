'use client'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, {useEffect} from 'react'
import { showConnect } from '@stacks/connect'
import { useUserSession } from '@/hooks/useUserSession'
import { useRouter } from 'next/navigation'
import { axiosKonsumeInstance } from '@/http/konsume'
import axios from 'axios'

const SocialLogin = () => {
  const loginWithStacks = () => {
    showConnect({
      appDetails: {
        name: 'Konsume',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: async () => {
        let userData = userSession.loadUserData();
        console.log(userData);
        // const {data} = await axiosKonsumeInstance.post('/api/auth/login', userData, {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        // })
        route.push('/dashboard')
      },
      userSession,
    });
  }
  const { data: session } = useSession();
  const userSession = useUserSession();
  const route = useRouter()

  const handleSignIn = async () => {
    try {
      // Trigger Google Sign-In and redirect back to this page
      await signIn('google', { callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  // Handle the backend call once redirected back
  useEffect(() => {
    const sendIdTokenToBackend = async () => {
      if (session?.idToken) {
        try {
          const response = await axiosKonsumeInstance.post('/api/auth/google-login', {
            tokenId: session.idToken,
          }, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('Backend Response:', response.data);

          // Redirect to the dashboard
          // router.push('/dashboard');
        } catch (error) {
          console.error('Error in backend call:', error);
        }
      }
      console.log(session);
      
    };

    sendIdTokenToBackend();
  }, [session]);

  return (
    <div className="flex flex-col justify-between gap-4 mt-4">
      <p className='text-desktop-highlight font-bold mx-auto'>Or</p>
      <div className='flex flex-col gap-3 items-center h-full'>
      <Button className="mx-auto p-[10px] h-full flex-[.7] border-2 md:w-[350px] w-full hover:bg-primary-bg-800 hover:text-white border-primary-bg-800 text-primarygtext rounded-[30px] flex items-center gap-[10px] text-desktop-highlight font-bold" onClick={handleSignIn}>
        <Image src="/assets/google.png" width={32} height={32} alt='google' />
        Sign in with Google
      </Button>
      <Button className="mx-auto p-[10px] h-full flex-[.7] border-2 md:w-[350px] w-full hover:bg-orange-400 hover:text-white border-orange-400 text-primarygtext rounded-[30px] flex items-center gap-[10px] text-desktop-highlight font-bold" onClick={() => loginWithStacks()}>
        <Image src="/stacks.svg" width={32} height={32} alt='stacks' />
        Sign in with Stacks Connect
      </Button>
      </div>
      {/* <button onClick={() => {
        signOut({ redirect: false })
      }
      }>Sign Out</button> */}
    </div>
  )
}

export default SocialLogin