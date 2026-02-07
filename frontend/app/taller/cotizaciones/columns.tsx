"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cotizacionesAPI } from "@/lib/api"

// Define the shape of our data
export type Cotizacion = {
    id: string
    titulo: string
    descripcion: string
    status: "ABIERTA" | "CERRADA" | "CANCELADA"
    urgencia: "BAJA" | "NORMAL" | "ALTA"
    createdAt: string
    _count: {
        items: number
        ofertas: number
    }
}

export const columns: ColumnDef<Cotizacion>[] = [
    {
        accessorKey: "titulo",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Título
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium px-4">{row.getValue("titulo")}</div>,
    },
    {
        accessorKey: "_count.items",
        header: "Items",
        cell: ({ row }) => <div className="text-center">{row.original._count?.items || 0}</div>,
    },
    {
        accessorKey: "_count.ofertas",
        header: "Ofertas",
        cell: ({ row }) => {
            const count = row.original._count?.ofertas || 0
            return (
                <div className="flex justify-center">
                    <Badge variant={count > 0 ? "success" : "secondary"}>
                        {count}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "urgencia",
        header: "Urgencia",
        cell: ({ row }) => {
            const urgencia = row.getValue("urgencia") as string
            const variant =
                urgencia === "ALTA" ? "destructive" :
                    urgencia === "NORMAL" ? "default" : "info"

            return (
                <Badge variant={variant as any} className="text-xs">
                    {urgencia}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const variant =
                status === "ABIERTA" ? "outline" :
                    status === "CERRADA" ? "secondary" : "destructive"

            return (
                <Badge variant={variant as any} className="uppercase">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => {
            return <div className="text-sm text-muted-foreground">
                {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy", { locale: es })}
            </div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const cotizacion = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(cotizacion.id)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                            <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                        </Link>
                        {cotizacion.status === 'ABIERTA' && cotizacion._count?.ofertas === 0 && (
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                Eliminar
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
