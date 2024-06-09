import _ from 'lodash'
const Sidebar = ({
    conversationList,
}: {
    conversationList?: {
        id: number
        topic: string
    }[]
}) => {
    return (
        <div className="flex flex-col bg-gray-100 w-full h-full">
            <div className="m-3">
                <div className="h-10 my-2"></div>
                <div className="conversation_list flex flex-col gap-1 text-gray-600 text-base text-[15px]">
                    {_.map(conversationList, (conversationItem, index) => {
                        return (
                            <div
                                key={`conversationItem-${index}`}
                                className="flex py-2 px-3 hover:rounded-xl hover:bg-gray-200 cursor-pointer"
                            >
                                {conversationItem?.topic || `untitled`}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
