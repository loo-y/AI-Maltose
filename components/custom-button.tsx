"use client"

import React, {useRef} from "react"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  color?: "default" | "neutral" | "primary" | "secondary" | "tertiary"
  selected?: boolean
  hasLed?: boolean
  hasIcon?: boolean
}

export function CustomButton({
  children,
  color = "default",
  selected = false,
  hasLed = false,
  hasIcon = false,
  className,
  ...props
}: CustomButtonProps) {

  const audioRef = useRef<HTMLAudioElement>(null); // 创建一个 ref 来引用 Audio 对象


  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 1. 先执行内部的 playSound 函数
    if (audioRef.current) {
      audioRef.current.play(); // 播放声音
    }
    // 2. 如果外部传入了 onClick 事件，则执行它
    if (props.onClick) {
      props.onClick(event); // 将事件对象传递给外部的 onClick 事件处理程序
    }
  }


  return (
    <div
      className={cn("Button_Button__u2RFO", className)}
      data-color={color}
      data-block=""
      {...(selected ? { "data-selected": "" } : {})}
      role="button"
      tabIndex={0}
      {...props}
      onClick={handleClick}
    >
      {children}
      {hasLed && (
        <div className="absolute left-[0.93rem] bottom-[0.93rem]">
          <span className="Button_LED__yt_Oj"></span>
        </div>
      )}
      <audio ref={audioRef} src="/sounds/pressed.wav" preload="auto"></audio>
    </div>
  )
}
