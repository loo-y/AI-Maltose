import _ from 'lodash'
import React from 'react'
import type { ConversationType } from '@/app/shared/interface'

const Sidebar = ({
    currentConversation,
    conversationList,
    onSelectConversation,
    onToggleSidebar,
    onCreateNewConversation,
}: {
    currentConversation: ConversationType
    conversationList?: {
        conversation_id: number
        topic: string
    }[]
    onSelectConversation?: (conversationID: number) => void
    onToggleSidebar?: () => void
    onCreateNewConversation?: () => void
}) => {
    const handleSelectConversation = (conversationID: number) => {
        typeof onSelectConversation == `function` && onSelectConversation(conversationID)
    }

    const handleToggleSidebar = () => {
        typeof onToggleSidebar == `function` && onToggleSidebar()
    }

    const handleCreateNewConversation = () => {
        typeof onCreateNewConversation == `function` && onCreateNewConversation()
    }
    const selectedClass = `bg-gray-200`
    return (
        <div className="flex flex-col bg-gray-100 w-full h-full">
            <div className="m-3 mt-0">
                <div className="h-14 flex items-center ml-1 mb-2">
                    <div className="flex flex-row justify-between w-full">
                        <div
                            className=" cursor-pointer hover:bg-gray-200 w-9 h-9 rounded-lg flex items-center justify-center"
                            onClick={handleToggleSidebar}
                        >
                            <img src="/images/icons/sidebar.svg" className="w-6 h-6" />
                        </div>
                        <div
                            className=" cursor-pointer hover:bg-gray-200 w-9 h-9 pt-[2px] rounded-lg flex items-center justify-center"
                            onClick={handleCreateNewConversation}
                        >
                            <img src="/images/icons/create-new.svg" className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="conversation_list flex flex-col gap-1 text-gray-600 text-base text-[15px]">
                    {_.map(conversationList, (conversationItem, index) => {
                        console.log(`conversationItem`, conversationItem)
                        const isSelected = currentConversation?.id == conversationItem?.conversation_id
                        return (
                            <div
                                key={`conversationItem-${index}`}
                                className={`flex py-2 px-3 rounded-xl hover:bg-gray-200 cursor-pointer ${isSelected ? selectedClass : ``}`}
                                onClick={handleSelectConversation.bind(this, conversationItem?.conversation_id)}
                            >
                                <div className="line-clamp-1">{conversationItem?.topic || `untitled`}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const SidebarMemo = React.memo(Sidebar)

export default SidebarMemo
