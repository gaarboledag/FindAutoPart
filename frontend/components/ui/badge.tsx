import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[#F97316] text-white",
                secondary:
                    "border-transparent bg-[#1E293B] text-[#F8FAFC] border-slate-600/50",
                destructive:
                    "border-transparent bg-red-500/20 text-red-400 border-red-500/30",
                outline: "text-[#F8FAFC] border-slate-600/50",
                success:
                    "border-transparent bg-green-500/15 text-green-400 border-green-500/30",
                warning:
                    "border-transparent bg-amber-500/15 text-amber-400 border-amber-500/30",
                info:
                    "border-transparent bg-blue-500/15 text-blue-400 border-blue-500/30",
                tech:
                    "border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.15)]",
                urgent:
                    "border-transparent bg-red-500/20 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
