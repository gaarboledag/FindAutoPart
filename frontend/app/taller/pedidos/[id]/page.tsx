'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { pedidosAPI } from '@/lib/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'


export default function PedidoDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [pedido, setPedido] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        loadPedido()
    }, [params.id])

    const loadPedido = async () => {
        try {
            const data = await pedidosAPI.getOne(params.id)
            setPedido(data)
        } catch (error) {
            console.error('Error loading pedido:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return

        setUpdating(true)
        try {
            await pedidosAPI.cancel(params.id)
            await loadPedido()
            alert('Pedido cancelado exitosamente')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al cancelar pedido')
        } finally {
            setUpdating(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`¿Confirmar recepción del pedido?`)) return

        setUpdating(true)
        try {
            await pedidosAPI.updateStatus(params.id, newStatus)
            await loadPedido()
            alert('Pedido marcado como recibido')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar estado')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        )
    }

    if (!pedido) {
        return <div>Pedido no encontrado</div>
    }

    return (
        <ProtectedRoute allowedRoles={['TALLER']}>
            <div className="dashboard-layout">
                <Navbar role="TALLER" />

                <main className="dashboard-main">
                    <div className="container">
                        {/* Header */}
                        <div className="detail-header">
                            <div>
                                <Link href="/taller/pedidos" className="text-sm text-secondary">
                                    ← Volver a Pedidos
                                </Link>
                                <h1 style={{ marginTop: 'var(--space-2)' }}>Pedido #{pedido.id.slice(0, 8).toUpperCase()}</h1>
                                <p className="text-secondary">
                                    Cotización: {pedido.oferta?.cotizacion?.titulo || 'Cotización eliminada'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <span className={`status-badge status-${pedido.status.toLowerCase()}`}>
                                    {pedido.status}
                                </span>
                                {pedido.status === 'PENDIENTE' && (
                                    <button
                                        onClick={handleCancel}
                                        className="btn btn-danger btn-sm"
                                        disabled={updating}
                                    >
                                        Cancelar Pedido
                                    </button>
                                )}
                                {pedido.status === 'CONFIRMADO' && (
                                    <button
                                        onClick={() => handleStatusChange('ENTREGADO')}
                                        className="btn btn-success btn-sm"
                                        disabled={updating}
                                    >
                                        Confirmar Recepción
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="detail-page">
                            {/* Info Section */}
                            <div className="detail-section">
                                <h3>Información del Pedido</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Fecha de Creación</span>
                                        <span className="detail-value">
                                            {format(new Date(pedido.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Tienda</span>
                                        <span className="detail-value">{pedido.oferta?.tienda?.nombre || 'Tienda no disponible'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total</span>
                                        <span className="detail-value text-primary font-bold">
                                            ${pedido.oferta?.items?.reduce((sum: number, item: any) => sum + (item.precioUnitario * item.cantidad), 0).toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="detail-section">
                                <h3>Datos de Entrega</h3>
                                <div className="detail-grid">
                                    <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                        <span className="detail-label">Dirección de Entrega</span>
                                        <span className="detail-value">{pedido.direccionEntrega}</span>
                                    </div>
                                    {pedido.notas && (
                                        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                            <span className="detail-label">Notas Adicionales</span>
                                            <span className="detail-value">{pedido.notas}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="detail-section">
                                <h3>Items del Pedido</h3>
                                <div className="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Marca</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unit.</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.oferta?.items?.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td>{item.nombre}</td>
                                                    <td>{item.marca || '-'}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>${item.precioUnitario.toLocaleString('es-CL')}</td>
                                                    <td><strong>${(item.precioUnitario * item.cantidad).toLocaleString('es-CL')}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
