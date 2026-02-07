import { Sidebar } from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function TiendaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute allowedRoles={["TIENDA"]}>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar role="TIENDA" />
                <main className="flex-1 overflow-y-auto bg-background/50 p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}
