'use client'
import { useHairStyleStore } from './providers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import _ from 'lodash'
import { imageUrlPrefix } from '@/app/shared/constants'

export default function ImageDisplay() {
    const hairStyleState = useHairStyleStore(state => state)
    const { createdImageList } = hairStyleState || {}
    return (
        <div className="w-full mt-6 px-1">
            <Tabs defaultValue="createdImages" className="w-full">
                <TabsList>
                    <TabsTrigger value="createdImages">My Images</TabsTrigger>
                    <TabsTrigger value="newImage">New Image</TabsTrigger>
                </TabsList>
                <div className="flex px-1 mt-2 w-full h-[50rem] overflow-hidden overflow-y-scroll">
                    <TabsContent value="createdImages" className="w-full">
                        <MyImageList imageList={createdImageList} />
                    </TabsContent>
                    <TabsContent value="newImage">Create a new image first</TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

const MyImageList = ({ imageList }: { imageList: string[] }) => {
    console.log(`imageList`, imageList)
    return (
        <div className="flex flex-row flex-wrap w-full items-start pb-6">
            {_.map(imageList, (imageItem: string, imageIndex) => {
                return (
                    <div
                        className={`flex w-1/3 p-3 h-[20rem] ${imageIndex % 3 == 0 ? 'pl-0' : imageIndex % 3 == 2 ? 'pr-0' : ''}`}
                        key={`myimagelist_${imageIndex}`}
                    >
                        <div
                            className="w-full h-full relative rounded-2xl bg-cover bg-no-repeat bg-center border border-solid border-gray-300 shadow-xl bg-transparent cursor-zoom-in"
                            style={{ backgroundImage: `url(${imageUrlPrefix}/${imageItem})` }}
                        ></div>
                    </div>
                )
            })}
        </div>
    )
}
