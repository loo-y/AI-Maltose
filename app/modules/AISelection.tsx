'use client'
import React, { useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import _ from 'lodash'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const AISelection = ({ aiBots }: { aiBots: Record<string, any>[] }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" w-40 justify-between border-none h-9"
                >
                    {value ? _.find(aiBots, aibot => aibot.id === value)?.name : 'Select AI...'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="relative left-0 w-60 p-0 -mr-20">
                <Command>
                    {/* <CommandInput placeholder="Search AI..." className="h-9" /> */}
                    <CommandInput placeholder="TODO...Only for testing" className="h-9" />
                    <CommandList>
                        <CommandEmpty>No AI found.</CommandEmpty>
                        <CommandGroup>
                            {_.map(aiBots, (aibot, index) => {
                                const { id, name } = aibot
                                return (
                                    <React.Fragment key={`aibot_select_${index}`}>
                                        <CommandItem
                                            key={id}
                                            value={id}
                                            onSelect={currentValue => {
                                                setValue(currentValue === value ? '' : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {name}
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    value === id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
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
