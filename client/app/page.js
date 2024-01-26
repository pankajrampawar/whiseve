'use client'

import Image from "next/image";
import Link from "next/link";
import { keaniaOne, happyMonkey } from "./fonts";

export default function Home() {

  const handleLogin = () => {
    console.log("Login clicked")
  };

  const handleSignup = () => {
    console.log("signup clicked")
  };

  return (
    <main className="h-full w-full bg-black text-white flex items-center flex-col gap-9 pt-20 px-7">
      <header className={`text-[36px] ${keaniaOne.className} tracking-wider`}>
        Nexus
      </header>

      <section className={`${happyMonkey.className} tracking-wider text-center text-[20px]`}>
        <article className="flex flex-col gap-7">
         <p>
          This website was directly crafted by GODS*, it is a doorway to 
          <span> </span> 
          <span className="underline underline-offset-8 decoration-red-600">unfiltered Community</span>
         </p>
          <p>
            Enter at your own risk...
          </p>
        </article>   
      </section>

      <section className={`${keaniaOne.className} text-xl mt-4`}>
        <div className="flex gap-4">
          <Link href='/login'>
            <button 
              className="bg-white text-black p-3 w-[130px] rounded-3xl"
              onClick={handleLogin}
            >
              Login
            </button>
          </Link>
          
          <button 
            className="bg-white text-black p-3 w-[130px] rounded-3xl"
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>
      </section>
    </main>
  );
}
