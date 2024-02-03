'use client'

import React, { useState, useEffect } from 'react';
import ReplyCard from '@/app/ui/replyCard';
import MessageClickedCard from '@/app/ui/messageClickedCard';
import { useParams } from 'next/navigation';
import { getReplyForCraft } from '@/app/actions';
import { getCraft } from '@/app/actions';
import ReplyComponent from '@/app/ui/postReplyCard';

export default function ReplySection() {

    const [replies, setReplies] = useState([' ']);
    const [craft, setCraft] = useState(' ')
    const params = useParams();


    useEffect(()=>{
        const getAllReplies = async () => {
            const repliesGot = await getReplyForCraft(params.id)
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
        <div className='flex flex-col gap-2'>
            {   craft.content && craft.content &&
                <div>
                <MessageClickedCard
                    content = {craft.content}
                />
                </div>
            }

            <div>
                <ReplyComponent craftId={params.id}/> 
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