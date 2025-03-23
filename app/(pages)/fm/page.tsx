'use client'

import { useState, useEffect } from 'react'
import { CustomButton } from '@/components/custom-button'
import { Switcher } from '@/components/ui/switcher'

const voices = ['Alloy', 'Ash', 'Ballad', 'Coral', 'Echo', 'Fable', 'Onyx', 'Nova', 'Sage', 'Shimmer', 'Verse']
const vibes = ['Friendly', 'Professional', 'Calm', 'Mad Scientist', 'Sympathetic']

export default function Home() {
    const [selectedVoice, setSelectedVoice] = useState<string>('Fable')
    const [selectedVibe, setSelectedVibe] = useState<string>('Friendly')
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false)

    // Handle dark mode toggle
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    // Handle hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <div className="fm overflow-y-hidden h-screen ">
                <div className="max-w-[--page-max-width-fm] pb-32 pt-6 px-5 md:pb-24 selection:bg-primary/2 mx-auto overflow-y-scroll h-full scrollbar-hide">
                    <header className="flex w-full max-w-(--page-max-width) mx-auto mb-12 md:mb-8">
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-2 order-1 mb-8 md:mb-0">
                                <div className="relative top-[0.0875rem]">
                                    <h1 className="font-bold text-xl">fm</h1>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-7 xl:col-span-6 order-3 md:order-2">
                                <div className="text-balance">
                                    <div className="text-current/70 mb-3">
                                        An interactive demo for developers to try the new text-to-speech model in the
                                        OpenAI API.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 flex flex-col gap-x-3 w-full max-w-(--page-max-width) mx-auto">
                        <div className="flex flex-row">
                            <div className="flex flex-1 flex-col shrink-0 mb-10">
                                <div className="flex flex-row justify-between -mb-[1px] relative items-center gap-2">
                                    <div className="flex uppercase py-1 text-current/70">VOICE</div>
                                    <div className="flex flex-1 h-[1px] bg-foreground/8"></div>
                                </div>
                                <div className="flex flex-1 flex-col pt-3 rounded-md">
                                    <div className="grid grid-cols-12 gap-3">
                                        {voices.map(voice => (
                                            <div
                                                key={voice}
                                                className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1 relative"
                                            >
                                                <CustomButton
                                                    color="default"
                                                    selected={selectedVoice === voice}
                                                    hasLed={true}
                                                    hasIcon={['Ash', 'Ballad', 'Coral', 'Sage', 'Verse'].includes(
                                                        voice
                                                    )}
                                                    onClick={() => setSelectedVoice(voice)}
                                                    className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square min-h-[80px] max-h-[100px] flex-col items-start justify-between relative"
                                                >
                                                    <span>{voice}</span>
                                                </CustomButton>
                                            </div>
                                        ))}
                                        <div className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1 relative">
                                            <CustomButton
                                                color="neutral"
                                                className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square min-h-[80px] max-h-[100px] flex-col items-start justify-between relative"
                                                aria-label="Select random voice"
                                            >
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M18.2929 14.2929C17.9024 14.6834 17.9024 15.3166 18.2929 15.7071C18.6834 16.0976 19.3166 16.0976 19.7071 15.7071L22.7071 12.7071C23.0976 12.3166 23.0976 11.6834 22.7071 11.2929L19.7071 8.29289C19.3166 7.90237 18.6834 7.90237 18.2929 8.29289C17.9024 8.68342 17.9024 9.31658 18.2929 9.70711L19.5858 11L16 11C13.7909 11 12 9.20914 12 7C12 6.44772 11.5523 6 11 6C10.4477 6 10 6.44772 10 7C10 10.3137 12.6863 13 16 13L19.5858 13L18.2929 14.2929Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M5.70711 9.70711C6.09763 9.31658 6.09763 8.68342 5.70711 8.29289C5.31658 7.90237 4.68342 7.90237 4.29289 8.29289L1.29289 11.2929C0.902369 11.6834 0.902369 12.3166 1.29289 12.7071L4.29289 15.7071C4.68342 16.0976 5.31658 16.0976 5.70711 15.7071C6.09763 15.3166 6.09763 14.6834 5.70711 14.2929L4.41421 13L8 13C10.2091 13 12 14.7909 12 17C12 17.5523 12.4477 18 13 18C13.5523 18 14 17.5523 14 17C14 13.6863 11.3137 11 8 11L4.41421 11L5.70711 9.70711Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </CustomButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex flex-1 flex-col shrink-0 mb-10">
                                <div className="flex flex-row justify-between -mb-[1px] relative items-center gap-2">
                                    <div className="flex uppercase py-1 text-current/70">VIBE</div>
                                    <div className="flex flex-1 h-[1px] bg-foreground/8"></div>
                                </div>
                                <div className="flex flex-1 flex-col pt-3 rounded-md">
                                    <div className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {vibes.map(vibe => (
                                                <CustomButton
                                                    key={vibe}
                                                    color="default"
                                                    selected={selectedVibe === vibe}
                                                    hasLed={true}
                                                    onClick={() => setSelectedVibe(vibe)}
                                                    className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[100px] max-h-[100px] flex-col items-start justify-between"
                                                >
                                                    <span className="break-words pr-1">{vibe}</span>
                                                </CustomButton>
                                            ))}
                                            <CustomButton
                                                color="neutral"
                                                className=" aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[100px] max-h-[100px]"
                                                aria-label="Generate new list of vibes"
                                            >
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M18.2929 14.2929C17.9024 14.6834 17.9024 15.3166 18.2929 15.7071C18.6834 16.0976 19.3166 16.0976 19.7071 15.7071L22.7071 12.7071C23.0976 12.3166 23.0976 11.6834 22.7071 11.2929L19.7071 8.29289C19.3166 7.90237 18.6834 7.90237 18.2929 8.29289C17.9024 8.68342 17.9024 9.31658 18.2929 9.70711L19.5858 11L16 11C13.7909 11 12 9.20914 12 7C12 6.44772 11.5523 6 11 6C10.4477 6 10 6.44772 10 7C10 10.3137 12.6863 13 16 13L19.5858 13L18.2929 14.2929Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M5.70711 9.70711C6.09763 9.31658 6.09763 8.68342 5.70711 8.29289C5.31658 7.90237 4.68342 7.90237 4.29289 8.29289L1.29289 11.2929C0.902369 11.6834 0.902369 12.3166 1.29289 12.7071L4.29289 15.7071C4.68342 16.0976 5.31658 16.0976 5.70711 15.7071C6.09763 15.3166 6.09763 14.6834 5.70711 14.2929L4.41421 13L8 13C10.2091 13 12 14.7909 12 17C12 17.5523 12.4477 18 13 18C13.5523 18 14 17.5523 14 17C14 13.6863 11.3137 11 8 11L4.41421 11L5.70711 9.70711Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </CustomButton>
                                        </div>
                                        <textarea
                                            id="input"
                                            rows={8}
                                            maxLength={999}
                                            className="w-full resize-none outline-none focus:outline-none bg-screen p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px]"
                                            defaultValue={`Affect/personality: A cheerful guide

Tone: Friendly, clear, and reassuring, creating a calm atmosphere and making the listener feel confident and comfortable.

Pronunciation: Clear, articulate, and steady, ensuring each instruction is easily understood while maintaining a natural, conversational flow.

Pause: Brief, purposeful pauses after key instructions (e.g., "cross the street" and "turn right") to allow time for the listener to process the information and follow along.

Emotion: Warm and supportive, conveying empathy and care, ensuring the listener feels guided and safe throughout the journey.`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col shrink-0 mb-10">
                                <div className="flex flex-row justify-between -mb-[1px] relative items-center gap-2">
                                    <div className="flex uppercase py-1 text-current/70">SCRIPT</div>
                                    <div className="flex flex-1 h-[1px] bg-foreground/8"></div>
                                </div>
                                <div className="flex flex-1 flex-col pt-3 rounded-md">
                                    <div className="relative flex flex-col h-full w-full">
                                        <textarea
                                            id="prompt"
                                            rows={8}
                                            maxLength={999}
                                            className="w-full h-full min-h-[220px] resize-none outline-none focus:outline-none bg-screen p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px]"
                                            defaultValue={`Hello! I'll help you get to your favorite coffee shop. Let's begin!

Start by walking straight ahead for about 20 steps. When you reach the crosswalk, wait for the signal, then cross to your left.

Continue walking straight for about 30 steps. You'll pass a bakery on your right.

When you reach the next corner, turn right. Your coffee shop will be just ahead on the left.

Enjoy your coffee! Let me know if you need help on your way back.`}
                                        />
                                        <span className="absolute bottom-3 right-4 z-10 opacity-30 hidden sm:block">
                                            440
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <footer className="Footer_Footer__ElFDz py-3 left-0 right-0 px-5">
                    <div className="relative max-w-[--page-max-width-fm] m-auto">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            <CustomButton color="tertiary" className="">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 4L12 16M12 16L18 10M12 16L6 10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M18 18H6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="uppercase hidden md:inline pr-3">Download</span>
                            </CustomButton>
                            <CustomButton color="secondary" className="">
                                <span className="flex gap-2 items-center justify-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14 3V7C14 7.55228 14.4477 8 15 8H19"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9 7H10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9 13H15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13 17H15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="uppercase hidden md:inline pr-3">Share</span>
                                </span>
                            </CustomButton>
                            <div className="flex col-span-1 sm:col-span-2">
                                <CustomButton color="primary" className="relative w-full">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5 5L19 12L5 19V5Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="uppercase hidden md:inline pr-3">Play</span>
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
