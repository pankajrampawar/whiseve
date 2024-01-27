'use client'

import React, { useState, useEffect } from 'react';
import ReplyCard from '@/app/ui/replyCard';
import MessageCard from '@/app/ui/messageCard';
import { useParams } from 'next/navigation';
import { getReplyForCraft } from '@/app/actions';
import { getCraft } from '@/app/actions';

export default function ReplySection() {

    const [replies, setReplies] = useState([]);
    const [craft, setCraft] = useState({})
    const params = useParams();


    useEffect(()=>{
        const getAllReplies = async () => {
            const repliesGot = await getReplyForCraft(params.id)
            console.log(repliesGot)
            setReplies(repliesGot);    
        }

        const getCraftById = async () => {
            const message = await getCraft(params.id)
            setCraft(message)
        }

        getCraftById();

        getAllReplies();
    }, [])

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <MessageCard
                    content = {craft.content}
                />
            </div>
            <div className='flex flex-col gap-3 pl-4'>
                {
                    replies && 
                    replies.map((reply) => (
                        <ReplyCard 
                            id = {reply._id}
                            content = {reply.content}
                        />
                    ))
                }
            </div>
        </div>
    )
}