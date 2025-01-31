'use client';
import HomeBody from '@/modules/home/HomeBody';
import HomeNav from '@/modules/home/HomeNav';
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <div className="font-satoshi bg-secondary-200  flex flex-col gap-10">
        {/* <HomeNav />
        <HomeBody /> */}
        <Analytics />
        
      </div>
  );
}
