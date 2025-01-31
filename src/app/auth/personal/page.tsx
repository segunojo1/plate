"use client"
import withoutAuth from '@/app/helpers/withoutAuth';
import { SignupForm } from '@/modules/auth/signup/SignupForm';

const Signup = () => {
  return (
    <div className='py-10 px-4 mx-auto max-w-[358px] font-satoshi'>
      <div>
        <h3 className='text-desktop-content font-bold mb-8'>
          Sign up for yourself and get personalized meal recommendations, progress tracking, and more.
        </h3>
      </div>
      <SignupForm />
    </div>
  );
}

export default withoutAuth(Signup);