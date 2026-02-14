import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[48px]",
    {
        variants: {
            variant: {
                default: "bg-[#1E293B] text-[#F8FAFC] border border-slate-600/50 hover:bg-[#334155] hover:border-slate-500/50 shadow-sm",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
                outline:
                    "border border-slate-600/50 bg-transparent text-[#F8FAFC] hover:bg-[#1E293B] hover:border-orange-500/30",
                secondary:
                    "bg-[#F97316] text-white hover:bg-[#FB923C] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(249,115,22,0.3)]",
                ghost: "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]",
                link: "text-[#F97316] underline-offset-4 hover:underline min-h-0",
                cta: "bg-[#F97316] text-white font-bold hover:bg-[#FB923C] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(249,115,22,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(249,115,22,0.5)] active:bg-[#EA580C]",
                glow: "bg-[#F97316] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(249,115,22,0.6)] transition-shadow duration-300",
            },
            size: {
                default: "h-12 px-5 py-3",
                sm: "h-10 rounded-lg px-4 text-sm",
                lg: "h-14 rounded-lg px-8 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
