'use client'
import React, { useEffect, useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import _ from 'lodash'
import type { MainStore } from '@/app/(pages)/main/stores'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const AISelection = ({ aiBots, mainState }: { aiBots: Record<string, any>[]; mainState: MainStore }) => {
    const { currentConversation, updateCurrentConversation } = mainState || {}
    const { id, aiBotIDs } = currentConversation || {}
    const selected = id && aiBotIDs?.[0]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    useEffect(() => {
        if (!value) {
            const defaultValue = aiBots?.[0]?.id
            if (defaultValue) {
                setValue(defaultValue)
                updateCurrentConversation({ ...currentConversation, aiBotIDs: [defaultValue] })
            }
        }
    }, [])

    useEffect(() => {
        if (currentConversation?.aiBotIDs?.[0]) {
            setValue(currentConversation.aiBotIDs[0])
        } else if (value) {
            updateCurrentConversation({ ...currentConversation, aiBotIDs: [value] })
        }
    }, [currentConversation])

    const handleSelectAI = (currentValue: string) => {
        if (!id && !_.includes(aiBotIDs, currentValue)) {
            // setValue(currentValue === value ? '' : currentValue)
            // 不可反选
            setValue(currentValue)
            updateCurrentConversation({ ...currentConversation, aiBotIDs: [currentValue] })
        }
        setOpen(false)
    }

    if (selected) {
        return (
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className=" w-52 justify-start border-none h-9 hover:bg-transparent p-0 pt-1"
            >
                <div className="flex flex-row items-center justify-start hover:bg-gray-100 px-4 py-2 rounded-md">
                    {_.find(aiBots, aibot => aibot.id === aiBotIDs?.[0])?.name || ''}
                </div>
            </Button>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" w-52 justify-start border-none h-9 hover:bg-transparent p-0 pt-1"
                >
                    <div className="flex flex-row items-center justify-start hover:bg-gray-100 px-4 py-2 rounded-md">
                        {value ? _.find(aiBots, aibot => aibot.id === value)?.name : 'Select AI...'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="relative left-0 w-60 p-0 -mr-8">
                <Command>
                    <CommandInput placeholder="Search AI..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No AI found.</CommandEmpty>
                        <CommandGroup>
                            {_.map(aiBots, (aibot, index) => {
                                const { id, name } = aibot
                                return (
                                    <React.Fragment key={`aibot_select_${index}`}>
                                        <CommandItem key={id} value={id} onSelect={handleSelectAI}>
                                            <div className="flex flex-row w-full items-center justify-between my-1">
                                                <div className="line-clamp-1">
                                                    <span title={name}>{name}</span>
                                                </div>
                                                <CheckIcon
                                                    className={cn(
                                                        'ml-auto h-4 w-4',
                                                        value === id ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                            </div>
                                        </CommandItem>
                                    </React.Fragment>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default AISelection
