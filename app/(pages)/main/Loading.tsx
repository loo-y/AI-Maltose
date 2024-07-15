// components/Loading.tsx
import React from 'react'
import { useMainStore } from './providers'

const Loading: React.FC = () => {
    const mainState = useMainStore(state => state)

    const { isloading } = mainState || {}

    if (!isloading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative">
                <div className="w-20 h-20 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm">
                    Loading
                </div>
            </div>
        </div>
    )
}

export default Loading
