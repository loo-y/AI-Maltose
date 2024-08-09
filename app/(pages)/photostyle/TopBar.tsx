'use client'
import React, { useEffect, useState } from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { handleGetAIResponse, handleGetUserInfo, handleGetConversationHistory } from '@/app/shared/handlers'
import { usePhotoStyleStore } from './providers'
import _ from 'lodash'
import Link from 'next/link'

const navigation = [
    { title: 'Home', path: '/' },
    { title: 'Chat', path: '/chat' },
]

export default function Topbar() {
    const photoStyleState = usePhotoStyleStore(state => state)
    const { balanceRefreshTime } = photoStyleState || {}

    const [credits, setCredits] = useState<number | undefined>(undefined)
    useEffect(() => {
        handleGetUserInfo().then(userInfo => {
            console.log(`userInfo`, userInfo)
            const { BasicInfo } = userInfo || {}
            const balance = BasicInfo?.balance || 0
            setCredits(balance)
        })
    }, [balanceRefreshTime])

    return (
        <div className="topbar flex flex-row justify-between bg-paw-white px-4 h-14 shadow-sm">
            <div className="left flex flex-row"></div>
            <div className="right flex flex-row items-center  gap-3">
                <ul className="text-gray-700 justify-end items-center hidden md:flex flex-row gap-2 space-y-0 space-x-6 text-sm font-medium ">
                    {_.map(navigation, (item, idx) => {
                        return (
                            <li key={`navigation_${idx}`} className="duration-150 hover:text-gray-900">
                                <Link href={item.path} className="block" target="_blank">
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}

                    {credits != undefined ? (
                        <li>
                            <div className="creditsinfo flex felx-row text-sm items-center justify-center">
                                <img
                                    src="/images/icons/coins.png"
                                    className="w-6 h-6 -mt-1"
                                    alt={`${credits ? credits : ''} credits`}
                                />
                                <span
                                    className="text-paw-black text-sm font-semibold"
                                    title={`${credits ? credits : ''} credits`}
                                >
                                    {credits}
                                </span>
                            </div>
                        </li>
                    ) : null}
                    <li>
                        <SignedIn>
                            <div className="shadow-lg w-fit h-fit items-center flex justify-center rounded-full">
                                <UserButton />
                            </div>
                        </SignedIn>
                    </li>
                </ul>
            </div>
        </div>
    )
}
