'use client'

import { useState, useEffect } from "react";
import useImageHook from "../imagehook";
import { useRouter } from "next/navigation";
import EditorCard from "../ui/editorCard";
import { happyMonkey } from "../fonts";
import Image from "next/image";
import back from '@/public/back.svg'
import { changeProfilePic, updateProfile } from "../actions";
import { adjustWord } from "../lib/removeExtraSpace";


export default function HandleProfileChange() {

    const router = useRouter();

    const { handleImageChange, imgUrl, error, clearImage } = useImageHook();
    const [editorOpen, setEditorOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        profilePic: '',
        bio: '',
        status: '',
        userName: '',
    })
    const [active, setActive] = useState(false)

    const handleBioChange = (e) => {
        const text = e.target.value;
        setActive(true);
        const adjustedText = adjustWord(text);
        
        setUser(prev => ({
            ...prev,
            bio: adjustedText,
        }));

        return;
    }

    const handleStatusChange = (e) => {
        const status = e.target.value
        setActive(true)
        setUser((prev) => ({
            ...prev,
            status: status
        }))

        return;
    }

    const handleUserNameChange = (e) => {
        const userName = e.target.value;
        setActive(true)
        setUser((prev) => ({
            ...prev,
            userName: userName,
        }))
    }

    useEffect(() => {
        const userDetailsString = localStorage.getItem('user');
        if (!userDetailsString) {
            router.push('/')
        }

        const userDetailsObject = JSON.parse(userDetailsString)
        setUser(prev =>({
            ...prev,
            profilePic: userDetailsObject.profilePic,
            bio: userDetailsObject.bio,
            status: userDetailsObject.status,
            userName: userDetailsObject.userName
        }))
    }, [])

    const setBack = () => {
        router.push('/home')
    }

    const submitUpdateProfile = async () => {
        setLoading(true);

        const response = await updateProfile({ bio: user.bio, status: user.status, userName: user.userName });

        if (!response) {
            alert('plz try again later.')
            setLoading(false); // Reset loading state
            return;
        }

        setUser(response);
        setLoading(false);
        alert('changes saved successfully')
        return;
    }
    const submitImageChange = async () => {
        setLoading(true);
    
        // Log initial state
        console.log("Starting submitImageChange...");
        console.log("Initial imgUrl:", imgUrl);
    
        // Wait for imgUrl to be generated
        let timeoutCounter = 0;
        while (!imgUrl && timeoutCounter < 50) { // Limit to 50 iterations to prevent infinite loop
            console.log("Waiting for imgUrl...");
            console.log("Current timeout counter:", timeoutCounter);
            timeoutCounter++;
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
        }
    
        console.log("Final imgUrl:", imgUrl);
    
        if (!imgUrl) {
            console.log("Timeout reached. Unable to get imgUrl.");
            setLoading(false); // Reset loading state
            return;
        }
    
        const response = await changeProfilePic(imgUrl);
        
        if (!response) {
            alert("try uploading a smaller size Image");
            setLoading(false); // Reset loading state
            return;
        }
    
        localStorage.setItem('user', JSON.stringify(response));
        alert("updated");
    
        setUser(prev => ({
            ...prev,
            profilePic: response.profilePic,
            bio: response.bio,
            relationshipStatus: response.relationshipStatus
        }));
        setEditorOpen(prev => !prev)
        setLoading(false); // Reset loading state
    
        return;
    }

    return(
        <div>
            <div onClick={setBack} className="cursor-pointer pt-3 pl-5">
                <Image
                    src={back}
                    alt="go back icon"
                    width={24}
                    height={24}
                    className="invert"
                />
            </div>
            <div className="flex flex-col items-center gap-10">
                <div className="w-52 h-52 bg-primary2 rounded-[70px] "
                    onClick={() => {setEditorOpen(prev => !prev)}}
                >
                    {/*profile Image*/}
                    <img
                        src={user.profilePic}
                        alt='.'
                        className="w-full h-full object-cover rounded-[70px]"
                    />
                </div>

                <div className={`w-full text-2xl ${happyMonkey.className} flex flex-col gap-8 px-4 max-w-[400px]`}>
                    <div>
                        <input
                            placeholder="Your name"
                            value={user.userName}
                            onChange={handleUserNameChange}
                            className={`bg-black focus:outline-none ${happyMonkey.className} text-xl p-1 pb-2 border-b`}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            Bio
                        </div>
                        <div className="px-4">
                            <textarea className="bg-black border border-gray-600 text-xl focus:outline-none w-full h-20"
                                value={user.bio}
                                onChange={handleBioChange}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-red-300">
                            <select
                                className={`bg-black w-full focus:outline-none ${happyMonkey.className} tracking-widest text-xl`}
                                value={user.status}
                                onChange={handleStatusChange}
                            >
                                <option value="" style={{color: '#718096'}} disabled>Relationship status</option>
                                <option value="single">single</option>
                                <option value="in relationship">in relationship</option>
                                <option value="dating">dating</option>
                                <option value="searching">searching</option>
                                <option vlaue="secret">secret</option>
                                <option value="grind mode">grind mode</option>
                                <option value="FWB">FWB</option>

                            </select>
                    </div>
                </div> 
            </div>

            {
                editorOpen && 
                <div className="fixed top-0 left-0 w-screen h-screen flex justify-center z-20">
                    <EditorCard
                        closeEditor={() => {setEditorOpen(false)}}
                        handleImageChange={handleImageChange}
                        handleSubmit={submitImageChange}
                        profilePic={user.profilePic}
                    />
                    <div className="w-full h-full absolute backdrop:blur-3xl bg-black">
                    </div>
                </div>
            }

            <div className="flex p-2 text-black text-2xl justify-center items-center mt-16">
                <button
                    className={`p-2 rounded-xl ${active ? 'bg-white' : 'bg-slate-300'} ${happyMonkey.className}`}
                    onClick={submitUpdateProfile}
                >Save</button>
            </div>

            {
                loading ?
                <div className="fixed h-screen w-screen top-0 left-0 bg-black z-40 flex justify-center items-center pl-10">
                    <img
                        src='/loader.svg'
                        alt="loading"
                    />
                </div> : ''
            }
        </div>
    )
}
