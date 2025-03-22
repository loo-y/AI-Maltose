"use client"

import React from "react"
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
  return (
    <div
      className={cn("Button_Button__u2RFO", className)}
      data-color={color}
      data-block=""
      {...(selected ? { "data-selected": "" } : {})}
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
      {hasLed && (
        <div className="absolute left-[0.93rem] bottom-[0.93rem]">
          <span className="Button_LED__yt_Oj"></span>
        </div>
      )}
    </div>
  )
}
