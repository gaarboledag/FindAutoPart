-- AlterTable
ALTER TABLE "cotizacion_items" ADD COLUMN     "imagenUrl" TEXT;

-- CreateTable
CREATE TABLE "cotizacion_views" (
    "id" UUID NOT NULL,
    "cotizacionId" UUID NOT NULL,
    "tiendaId" UUID NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizacion_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cotizacion_views_cotizacionId_tiendaId_key" ON "cotizacion_views"("cotizacionId", "tiendaId");

-- AddForeignKey
ALTER TABLE "cotizacion_views" ADD CONSTRAINT "cotizacion_views_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_views" ADD CONSTRAINT "cotizacion_views_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "tiendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
