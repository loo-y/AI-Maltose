'use client'
import React, { useEffect, useState } from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { handleGetAIResponse, handleGetUserInfo, handleGetConversationHistory } from '@/app/shared/handlers'
import { useHairStyleStore } from './providers'

export default function Topbar() {
    const hairStyleState = useHairStyleStore(state => state)
    const { balanceRefreshTime } = hairStyleState || {}

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
                {credits != undefined ? (
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
                ) : null}
                <SignedIn>
                    <div className="shadow-lg w-fit h-fit items-center flex justify-center rounded-full">
                        <UserButton />
                    </div>
                </SignedIn>
            </div>
        </div>
    )
}
