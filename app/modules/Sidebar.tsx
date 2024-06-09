import _ from 'lodash'
import React from 'react'

const Sidebar = ({
    conversationList,
    onSelectConversation,
}: {
    conversationList?: {
        conversation_id: number
        topic: string
    }[]
    onSelectConversation?: (conversationID: number) => void
}) => {
    const handleSelectConversation = (conversationID: number) => {
        typeof onSelectConversation == `function` && onSelectConversation(conversationID)
    }
    return (
        <div className="flex flex-col bg-gray-100 w-full h-full">
            <div className="m-3">
                <div className="h-10 my-2"></div>
                <div className="conversation_list flex flex-col gap-1 text-gray-600 text-base text-[15px]">
                    {_.map(conversationList, (conversationItem, index) => {
                        console.log(`conversationItem`, conversationItem)
                        return (
                            <div
                                key={`conversationItem-${index}`}
                                className="flex py-2 px-3 hover:rounded-xl hover:bg-gray-200 cursor-pointer "
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
