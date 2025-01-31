import { SignupForm } from '@/modules/auth/signup/restaurant/SignupForm'

const Restaurant = () => {
  return (
    <div className='py-10 px-4 mx-auto max-w-[358px] font-satoshi'>
      <div>
        <h3 className='text-desktop-content font-bold mb-8'>
          Sign up for your restaurant to be added to our waitlist
        </h3>
      </div>
      <SignupForm />
    </div>
  )
}

export default Restaurant