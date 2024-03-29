'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUser } from '@/app/actions';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { happyMonkey } from '@/app/fonts';
import moreVert from '@/public/moreVert.svg'
import loadingSvg from '@/public/loader.svg'
import { sendFriendRequest } from '@/app/actions';
import ProfileSkeleton from '@/app/ui/profile/skeletonOfProfilePage';
import Card from '@/app/ui/card';
import UserDrops from '@/app/ui/userDrops';

export default function UserProfile() {

    const router = useRouter();
    const params = useParams();

    const [userSeen, setUserSeen] = useState('');
    const [drops, setDrops] = useState(true);
    const [replies, setReplies] = useState(false)
    const [bfLoading, setBfLoading] = useState(false);
    const [loading, setLoading] = useState(true)
    const [myProfile, setMyProfile] = useState(false)
    const [user, setUser] = useState('');
    const [cardOpen, setCardOpen] = useState(false)
    const [isFriend, setIsFriend] = useState(false)

    useEffect(()=>{
        const userDetails = localStorage.getItem('user');

        if (!userDetails) {
            router.push('/')
            return;
        }

        setUser(JSON.parse(userDetails))

        const getUserDetails = async () => {
            const userSeenDetails = await getUser(params.id)

            if (!userSeenDetails) {
                alert('some error, unable to load profile!');
                router.push('/home');
                return;
            }
            setUserSeen(userSeenDetails);
        }

        getUserDetails();
        setLoading(false)
    }, [])

    useEffect(() => {
        if (JSON.stringify(user._id) === JSON.stringify(params.id)) {
            setMyProfile(true);
            return;
        }
    }, [user])

    useEffect(() => {
        if (user.friends && Array.isArray(user.friends) && user.friends.length > 0) {
            if (user.friends.includes(userSeen._id)) {
                setIsFriend(true);
                return
            }
            return;
        }

        return;
    }, [user, userSeen])

    const sendRequest = async () => {
        setBfLoading(true)
        const response = await sendFriendRequest(params.id);
        if (!response) {
            setBfLoading(false);
            alert('please try again later')
            return;
        }
        setBfLoading(false);
        alert('request sent');
        return;
    }

    return (
        <div className='overflow-scroll pb-20'>
        {
            loading && <ProfileSkeleton/>
        }

        {!loading && <div>
            <div className='bg-surface'>
                <div className='flex gap-3 items-start px-5 pt-2'>
                    <div className='max-w-[52px] min-w-[52px] max-h-[52px] min-h-[52px] bg-primary2 bg-primaryrounded-xl overflow-hidden flex justify-center items-center rounded-xl'>
                        {userSeen && <img
                            src={userSeen.profilePic}
                            alt='.'
                            className='h-full w-full rounded-xl'
                        />}
                    </div>

                    <div className={`text-[20px] min-[375px]:text-[24px] ${happyMonkey.className} flex flex-col w-full`}>
                        <div className='flex justify-between w-full items-center'>
                            <div>
                                {userSeen.userName}
                            </div>

                            {myProfile && <div>
                                <div className='flex items-start relative' onClick={() => {setCardOpen(prev => !prev)}}> {/* 3 dots */}
                                    <Image
                                        src={moreVert}
                                        height={24} 
                                        width={24}
                                        alt='menu'
                                        className='invert'
                                    />
                                </div>
                                {cardOpen && <Card/>}
                                {cardOpen && <div className='fixed left-0 top-0 h-screen w-screen z-10' onClick={() => {setCardOpen(false)}}>
                                </div>}
                            </div> }
                        </div>
                        <div className={`text-[16px] min-[375px]:text-[20px] -mt-2 text-gray-500`}>
                            {userSeen.status}
                        </div>
                    </div>
                </div>

                <div className={`flex justify-evenly mt-8 ${happyMonkey.className} border-b-[0.1px] pb-6 border-primary `}>
                    <div className='bg-primary2 w-[84px] h-[60px] rounded-[20px] flex flex-col justify-center items-center text-2xl text-primary'>
                        <div>
                            {userSeen.slayScore}
                        </div>
                        
                        <div className='text-sm'>
                            Slay Score
                        </div>
                    </div>
                    <div className='bg-primary2 w-[84px] h-[60px] rounded-[20px] flex flex-col justify-center items-center text-2xl'>
                        <div>
                            {Array.isArray(userSeen.friends) ? userSeen.friends.length : ' '}
                        </div>
                        <div className='text-sm'>
                            friends
                        </div>
                    </div>
                    <div className='bg-primary2 w-[84px] h-[60px] rounded-[20px] flex flex-col justify-center items-center text-2xl'>
                        <div>
                            {Array.isArray(userSeen.drops) ? userSeen.drops.length : ' '}
                        </div>
                        <div className='text-sm'>
                            drops
                        </div>  
                    </div>
                </div>

                <div className='flex justify-center items-center py-4 text-center px-5 border-b-[0.1px] border-primary'>
                    {userSeen.bio ? userSeen.bio : "nothing to see here.."}
                </div>

                {   !myProfile && 
                    <div className={`flex justify-between px-8 text-black text-xl py-4 ${happyMonkey.className}`}>
                        <div>
                            { !isFriend ? <button className='bg-white p-1 rounded-xl min-h-[38px] min-w-[115px] hover:bg-primary border border-white '
                                onClick={sendRequest}
                            >
                                {
                                    bfLoading 
                                        ? 
                                    <Image
                                        src={loadingSvg}
                                        height={10}
                                        width={60}
                                        alt="loading"
                                        className="invert ml-3 mt-1"
                                    />
                                        :
                                    <div>Befriend</div>
                                }
                            </button> : 
                            <button  className='bg-white p-1 rounded-xl min-h-[38px] min-w-[115px] hover:bg-primary border border-white '>
                                Friend
                            </button>
                            }
                        </div>

                        <div>
                            <button className='bg-primary p-1 rounded-xl min-h-[38px] min-w-[115px] hover:bg-white border border-primary '>
                                Message
                            </button>
                        </div>
                    </div>
                }
            </div>

            <div className='flex flex-col py-4'>
                <div className='text-xl flex justify-between px-8'>
                    <div className={` ${drops ? 'clicked' : '' } afterEffect relative`} 
                        onClick={()=>{
                            setReplies(false);
                            setDrops(true);
                        }}
                    >
                        Drops
                    </div>
                    <div className={` ${replies ? 'clicked' : '' } afterEffect relative`} 
                        onClick={()=>{
                            setReplies(true);
                            setDrops(false)
                        }}
                    >
                        Replies
                    </div>
                </div>

                <div className='flex flex-col py-4'>
                    {
                        drops && userSeen
                            ? 
                        <div>
                            <UserDrops userId={userSeen._id} />
                        </div>
                            :
                        ""
                    }

                    {
                        replies
                            ?
                        <div>
                        </div>
                            :
                        "" 
                    }
                </div>
            </div>
        </div>}
        </div>
    )
}

