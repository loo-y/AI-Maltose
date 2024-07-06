'use client'
import { SignedIn, UserButton } from '@clerk/nextjs'

export default function Topbar() {
    return (
        <div className="topbar flex flex-row justify-between bg-paw-white px-4 h-14 shadow-sm">
            <div className="left flex flex-row"></div>
            <div className="right flex flex-row items-center ">
                <SignedIn>
                    <div className="shadow-lg w-fit h-fit items-center flex justify-center rounded-full">
                        <UserButton />
                    </div>
                </SignedIn>
            </div>
        </div>
    )
}
