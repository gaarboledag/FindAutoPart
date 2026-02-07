import { Sidebar } from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function TallerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute allowedRoles={["TALLER"]}>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar role="TALLER" />
                <main className="flex-1 overflow-y-auto bg-background/50 p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}
