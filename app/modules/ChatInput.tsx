'use client'
import React, { useState, ChangeEvent, KeyboardEvent, useRef } from 'react'
import _ from 'lodash'

interface IChatInputProps {
    maxRows?: number,
    onSendQuestion: (question: string) => void
    isRequesting?: boolean
}
const Chatinput = ({maxRows = 5, isRequesting = false, onSendQuestion}: IChatInputProps) => {
    const [isComposing, setIsComposing] = useState(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [inputRows, setInputRows] = useState<number>(1)
    const inputRef = useRef<HTMLTextAreaElement>(null)


    const handleCompositionStart = () => {
        setIsComposing(true)
    }

    const handleCompositionEnd = () => {
        setIsComposing(false)
    }

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const currentValue = event.target.value
        setInputValue(currentValue)
        const rows = currentValue.split('\n').length + (currentValue.match(/\n$/)?.[1] ? 1 : 0)
        setInputRows(Math.min(rows, maxRows))
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault()

            const currentInputRef = inputRef.current as HTMLTextAreaElement
            const { selectionStart, selectionEnd } = currentInputRef
            const newInputValue = inputValue.substring(0, selectionStart) + '\n' + inputValue.substring(selectionEnd)
            setInputValue(newInputValue)
            setInputRows(value => {
                return Math.min(value + 1, maxRows)
            })
            // 移动光标位置到插入换行符后
            const newSelectionStart = selectionStart + 1
            // 需要延时执行，否则无法定位，会被 setInputValue 后执行修改定位
            setTimeout(() => {
                currentInputRef.setSelectionRange(newSelectionStart, newSelectionStart)

            }, 0)
        } else if (event.key === 'Enter') {
            if (!isComposing) {
                event.preventDefault()
                handleSendQuestion()
            }
        }
    }
    const handleSendQuestion = () => {
        const question = _.trim(inputValue)
        if(question){
            onSendQuestion(_.trim(inputValue))
            setInputValue('')
            setInputRows(1)
        }
    }

    const handleFocus = () => {
        // document.body.addEventListener('touchmove', ()=>{inputRef.current?.blur()}, { passive: false });
    }
    const handleBlur = () => {
        setTimeout(() => {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
            window.innerHeight = window.outerHeight
            window.scrollTo(0, 0)
        }, 50)
    }

    return (
        <div className='__chatinput__ relative h-full '>
            <div className='max-w-[50rem] w-full flex flex-col mx-auto'>
            <div className="overflow-y-scroll overflow-x-hidden rounded-3xl bg-gray-100 flex flex-row gap-1 flex-grow  mx-4 text-gray-600 max-h-52">
            <div className="flex flex-grow flex-row  border-0 pl-5 gap-1 ">
                <div className="flex my-1 flex-row flex-grow ml-2 mb-3 items-center">
                    <textarea
                        disabled={isRequesting ? true : undefined}
                        id={`chat-input`}
                        value={inputValue}
                        ref={inputRef}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        rows={inputRows}
                        style={{ resize: 'none' }}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        className="block flex-grow  bg-transparent outline-none pt-2 w-full leading-6"
                        placeholder="Type your messeage here..."
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    ></textarea>
                </div>
                <div
                    className="flex flex-row justify-end items-end my-2 mr-[0.4rem] gap-1"
                >
                    <div className=" items-center flex">
                        <div
                            className="svg-image flex h-10 w-10 overflow-hidden items-center justify-center cursor-pointer bg-lightGreen rounded-full"
                            onClick={handleSendQuestion}
                        >   
                            <img src={isRequesting ? '/images/icons/stop.svg' : '/images/icons/arrow-up.svg'} className="h-9 w-9" />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <div className='h-9'></div>
        </div>
    )
}

export default Chatinput