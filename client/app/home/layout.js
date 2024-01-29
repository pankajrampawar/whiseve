'use client'

import Navbar from "../ui/navBar"
import BottomBar from "../ui/bottomBar";
import { useState, useEffect } from 'react'
import AddButton from "../ui/addButton";

export default function RootLayout({children}) {

    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [visible , setVisible] = useState(true);

    useEffect(()=>{
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            
            setVisible(prevScrollPosition > currentScrollPos || currentScrollPos < 14);
            setPrevScrollPosition(currentScrollPos)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [prevScrollPosition, visible])

    return (
        <div className="">
            <nav className={`fixed bg-black w-full transition-all duration-500 top-0 left-0 ${visible ? 'opacity-100' : 'opacity-0 -translate-y-12'}`}>
                <Navbar/>
            </nav>

            <div className="pt-12">
                {children}
            </div>

            <div className={`fixed bg-black w-full transition-all duration-500 bottom-0 left-0 ${ visible ? 'opacity-100' : 'opacity-0 translate-y-8' }`}>
                <BottomBar/>
            </div>

            <div className={`fixed bottom-20 right-2 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 translate-x-14'}`}>
                <AddButton/>
            </div>
        </div>
    )
}