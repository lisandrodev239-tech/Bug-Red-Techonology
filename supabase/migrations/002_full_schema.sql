-- ============================================================
-- BugRed — Full System Schema
-- 16 tables + RLS policies + triggers + seed data
-- Run this AFTER migration 001 (requests table)
-- ============================================================

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- HELPER: get current user role
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT rol FROM public.usuarios WHERE id_usuario = auth.uid()
$$;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 1. SISTEMAS OPERATIVOS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.sistemas_operativos (
  id_sistema_operativo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  familia TEXT NOT NULL CHECK (familia IN ('Windows', 'Linux', 'Arch')),
  nombre TEXT NOT NULL,
  version TEXT NOT NULL,
  arquitectura TEXT NOT NULL CHECK (arquitectura IN ('x64', 'arm', 'x86')),
  entorno TEXT NOT NULL CHECK (entorno IN ('GUI', 'CLI', 'mixto'))
);

ALTER TABLE public.sistemas_operativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "so_select_all" ON public.sistemas_operativos
  FOR SELECT TO authenticated USING (true);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 2. USUARIOS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.usuarios (
  id_usuario UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT,
  direccion TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('ADMIN', 'CLIENTE', 'TECNICO')) DEFAULT 'CLIENTE',
  fecha_registro TIMESTAMPTZ DEFAULT now(),
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo'))
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_select_own" ON public.usuarios
  FOR SELECT USING (
    id_usuario = auth.uid() OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "usuarios_insert_own" ON public.usuarios
  FOR INSERT WITH CHECK (id_usuario = auth.uid());

CREATE POLICY "usuarios_update_own" ON public.usuarios
  FOR UPDATE USING (id_usuario = auth.uid() OR get_user_role() = 'ADMIN')
  WITH CHECK (id_usuario = auth.uid() OR get_user_role() = 'ADMIN');

CREATE POLICY "usuarios_delete_admin" ON public.usuarios
  FOR DELETE USING (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 3. CLIENTES (subtipo Usuario)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.clientes (
  id_usuario UUID PRIMARY KEY REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
  tipo_cliente TEXT NOT NULL CHECK (tipo_cliente IN ('particular', 'empresa'))
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clientes_select" ON public.clientes
  FOR SELECT USING (
    id_usuario = auth.uid() OR get_user_role() IN ('ADMIN', 'TECNICO')
  );

CREATE POLICY "clientes_insert_own" ON public.clientes
  FOR INSERT WITH CHECK (id_usuario = auth.uid());

CREATE POLICY "clientes_update_own" ON public.clientes
  FOR UPDATE USING (id_usuario = auth.uid() OR get_user_role() = 'ADMIN')
  WITH CHECK (id_usuario = auth.uid() OR get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 4. TECNICOS (subtipo Usuario)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.tecnicos (
  id_usuario UUID PRIMARY KEY REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
  especialidad TEXT NOT NULL CHECK (especialidad IN ('hardware', 'software')),
  nivel_experiencia TEXT
);

ALTER TABLE public.tecnicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tecnicos_select_all" ON public.tecnicos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "tecnicos_insert_admin" ON public.tecnicos
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

CREATE POLICY "tecnicos_update_admin" ON public.tecnicos
  FOR UPDATE USING (get_user_role() = 'ADMIN')
  WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 5. COMPUTADORAS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.computadoras (
  id_computadora UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id_usuario) ON DELETE CASCADE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  numero_serie TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('laptop', 'desktop')),
  id_sistema_operativo UUID REFERENCES public.sistemas_operativos(id_sistema_operativo),
  fecha_registro TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.computadoras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "computadoras_select" ON public.computadoras
  FOR SELECT USING (
    cliente_id = auth.uid() OR get_user_role() IN ('ADMIN', 'TECNICO')
  );

CREATE POLICY "computadoras_insert" ON public.computadoras
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid() OR get_user_role() IN ('ADMIN', 'TECNICO')
  );

CREATE POLICY "computadoras_update" ON public.computadoras
  FOR UPDATE USING (
    cliente_id = auth.uid() OR get_user_role() IN ('ADMIN', 'TECNICO')
  ) WITH CHECK (
    cliente_id = auth.uid() OR get_user_role() IN ('ADMIN', 'TECNICO')
  );

CREATE POLICY "computadoras_delete" ON public.computadoras
  FOR DELETE USING (
    cliente_id = auth.uid() OR get_user_role() = 'ADMIN'
  );

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 6. COMPONENTES (catálogo)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.componentes (
  id_componente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('RAM', 'CPU', 'GPU', 'SSD', 'HDD', 'motherboard', 'PSU', 'case', 'cooler', 'software')),
  marca TEXT,
  modelo TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  garantia_meses INTEGER DEFAULT 0
);

ALTER TABLE public.componentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "componentes_select_all" ON public.componentes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "componentes_insert_admin" ON public.componentes
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

CREATE POLICY "componentes_update_admin" ON public.componentes
  FOR UPDATE USING (get_user_role() = 'ADMIN')
  WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 7. STOCK
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.stock (
  id_stock UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  componente_id UUID NOT NULL REFERENCES public.componentes(id_componente) ON DELETE CASCADE,
  cantidad_disponible INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 5,
  ubicacion TEXT,
  UNIQUE(componente_id)
);

ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_select" ON public.stock
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "stock_insert_admin" ON public.stock
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

CREATE POLICY "stock_update_admin" ON public.stock
  FOR UPDATE USING (get_user_role() = 'ADMIN')
  WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 8. PROVEEDORES
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.proveedores (
  id_proveedor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  contacto TEXT,
  email TEXT,
  direccion TEXT
);

ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proveedores_select_admin" ON public.proveedores
  FOR SELECT USING (get_user_role() = 'ADMIN');

CREATE POLICY "proveedores_insert_admin" ON public.proveedores
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

CREATE POLICY "proveedores_update_admin" ON public.proveedores
  FOR UPDATE USING (get_user_role() = 'ADMIN')
  WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 9. COMPRAS_PROVEEDOR
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.compras_proveedor (
  id_compra UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id_proveedor),
  fecha TIMESTAMPTZ DEFAULT now(),
  total NUMERIC(10,2) DEFAULT 0
);

ALTER TABLE public.compras_proveedor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compras_select_admin" ON public.compras_proveedor
  FOR SELECT USING (get_user_role() = 'ADMIN');

CREATE POLICY "compras_insert_admin" ON public.compras_proveedor
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 10. DETALLE_COMPRAS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.detalle_compras (
  id_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compra_id UUID NOT NULL REFERENCES public.compras_proveedor(id_compra) ON DELETE CASCADE,
  componente_id UUID NOT NULL REFERENCES public.componentes(id_componente),
  cantidad INTEGER NOT NULL,
  costo_unitario NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.detalle_compras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "detalle_compras_select_admin" ON public.detalle_compras
  FOR SELECT USING (get_user_role() = 'ADMIN');

CREATE POLICY "detalle_compras_insert_admin" ON public.detalle_compras
  FOR INSERT WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 11. ORDENES_SERVICIO
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.ordenes_servicio (
  id_orden UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id_usuario),
  computadora_id UUID REFERENCES public.computadoras(id_computadora),
  tecnico_id UUID REFERENCES public.tecnicos(id_usuario),
  fecha_ingreso TIMESTAMPTZ DEFAULT now(),
  fecha_salida_estimada TIMESTAMPTZ,
  estado TEXT NOT NULL DEFAULT 'recibido'
    CHECK (estado IN ('recibido', 'diagnostico', 'reparacion', 'listo', 'entregado')),
  problema_reportado TEXT NOT NULL,
  diagnostico TEXT,
  costo_mano_obra NUMERIC(10,2) DEFAULT 0
);

ALTER TABLE public.ordenes_servicio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ordenes_select" ON public.ordenes_servicio
  FOR SELECT USING (
    cliente_id = auth.uid()
    OR tecnico_id = auth.uid()
    OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "ordenes_insert_cliente" ON public.ordenes_servicio
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid()
    OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "ordenes_update_tecnico" ON public.ordenes_servicio
  FOR UPDATE USING (
    tecnico_id = auth.uid()
    OR get_user_role() = 'ADMIN'
  ) WITH CHECK (
    tecnico_id = auth.uid()
    OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "ordenes_delete_admin" ON public.ordenes_servicio
  FOR DELETE USING (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 12. DIAGNOSTICOS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.diagnosticos (
  id_diagnostico UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES public.ordenes_servicio(id_orden) ON DELETE CASCADE,
  fallas TEXT NOT NULL CHECK (fallas IN ('hardware', 'software', 'sistema_operativo')),
  descripcion TEXT,
  solucion_aplicada TEXT,
  fecha TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diagnosticos_select" ON public.diagnosticos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.cliente_id = auth.uid() OR o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

CREATE POLICY "diagnosticos_insert_tecnico" ON public.diagnosticos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

CREATE POLICY "diagnosticos_update_tecnico" ON public.diagnosticos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 13. ORDEN_COMPONENTES (M:N)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.orden_componentes (
  id_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES public.ordenes_servicio(id_orden) ON DELETE CASCADE,
  componente_id UUID NOT NULL REFERENCES public.componentes(id_componente),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_aplicado NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.orden_componentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "oc_select" ON public.orden_componentes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.cliente_id = auth.uid() OR o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

CREATE POLICY "oc_insert_tecnico" ON public.orden_componentes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ordenes_servicio o
      WHERE o.id_orden = orden_id
      AND (o.tecnico_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 14. VENTAS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.ventas (
  id_venta UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id_usuario),
  fecha TIMESTAMPTZ DEFAULT now(),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  metodo_pago TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'cancelado'))
);

ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ventas_select" ON public.ventas
  FOR SELECT USING (
    cliente_id = auth.uid() OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "ventas_insert_cliente" ON public.ventas
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid() OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "ventas_update_admin" ON public.ventas
  FOR UPDATE USING (get_user_role() = 'ADMIN')
  WITH CHECK (get_user_role() = 'ADMIN');

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 15. DETALLE_VENTAS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.detalle_ventas (
  id_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID NOT NULL REFERENCES public.ventas(id_venta) ON DELETE CASCADE,
  componente_id UUID NOT NULL REFERENCES public.componentes(id_componente),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.detalle_ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dv_select" ON public.detalle_ventas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ventas v
      WHERE v.id_venta = venta_id
      AND (v.cliente_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

CREATE POLICY "dv_insert_cliente" ON public.detalle_ventas
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ventas v
      WHERE v.id_venta = venta_id
      AND (v.cliente_id = auth.uid() OR get_user_role() = 'ADMIN'))
  );

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 16. PAGOS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE public.pagos (
  id_pago UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES public.ventas(id_venta),
  orden_id UUID REFERENCES public.ordenes_servicio(id_orden),
  monto NUMERIC(10,2) NOT NULL,
  fecha TIMESTAMPTZ DEFAULT now(),
  metodo TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'rechazado')),
  CONSTRAINT at_least_one_ref CHECK (
    (venta_id IS NOT NULL) OR (orden_id IS NOT NULL)
  )
);

ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pagos_select" ON public.pagos
  FOR SELECT USING (
    (venta_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.ventas v WHERE v.id_venta = venta_id AND (v.cliente_id = auth.uid() OR get_user_role() = 'ADMIN')))
    OR (orden_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.ordenes_servicio o WHERE o.id_orden = orden_id AND (o.cliente_id = auth.uid() OR get_user_role() = 'ADMIN')))
    OR get_user_role() = 'ADMIN'
  );

CREATE POLICY "pagos_insert" ON public.pagos
  FOR INSERT WITH CHECK (
    (venta_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.ventas v WHERE v.id_venta = venta_id AND (v.cliente_id = auth.uid() OR get_user_role() = 'ADMIN')))
    OR (orden_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.ordenes_servicio o WHERE o.id_orden = orden_id AND (o.cliente_id = auth.uid() OR get_user_role() = 'ADMIN')))
    OR get_user_role() = 'ADMIN'
  );

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- TRIGGER: Deduct stock on sale
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE OR REPLACE FUNCTION public.deduct_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.stock
  SET cantidad_disponible = cantidad_disponible - NEW.cantidad
  WHERE componente_id = NEW.componente_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_deduct_stock
  AFTER INSERT ON public.detalle_ventas
  FOR EACH ROW
  EXECUTE FUNCTION public.deduct_stock();

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- SEED DATA
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- Sistemas operativos
INSERT INTO public.sistemas_operativos (familia, nombre, version, arquitectura, entorno) VALUES
  ('Windows', 'Windows 11', '24H2', 'x64', 'GUI'),
  ('Windows', 'Windows 10', '22H2', 'x64', 'GUI'),
  ('Linux', 'Ubuntu', '24.04 LTS', 'x64', 'GUI'),
  ('Linux', 'Debian', '12', 'x64', 'GUI'),
  ('Linux', 'Fedora', '41', 'x64', 'GUI'),
  ('Arch', 'Arch Linux', 'rolling', 'x64', 'mixto')
ON CONFLICT DO NOTHING;

-- Componentes
INSERT INTO public.componentes (nombre, tipo, marca, modelo, precio, garantia_meses) VALUES
  ('DDR5 32GB Kit', 'RAM', 'Corsair', 'Vengeance DDR5', 109990, 12),
  ('DDR4 16GB Kit', 'RAM', 'Kingston', 'Fury Beast', 49990, 12),
  ('Ryzen 7 7800X3D', 'CPU', 'AMD', '7800X3D', 489990, 24),
  ('Core i5-14600K', 'CPU', 'Intel', '14600K', 379990, 24),
  ('RTX 4060', 'GPU', 'NVIDIA', 'RTX 4060', 359990, 24),
  ('RX 7600', 'GPU', 'AMD', 'RX 7600', 299990, 24),
  ('SSD NVMe 1TB', 'SSD', 'Samsung', '990 Pro', 129990, 60),
  ('SSD SATA 480GB', 'SSD', 'Kingston', 'A400', 39990, 36),
  ('HDD 2TB', 'HDD', 'Seagate', 'Barracuda', 69990, 24),
  ('Arch Linux Setup', 'software', 'BugRed', 'Custom Hyprland', 75000, 0),
  ('Windows 11 License', 'software', 'Microsoft', 'OEM', 150000, 0),
  ('Ubuntu Pro Setup', 'software', 'BugRed', 'Server Config', 45000, 0)
ON CONFLICT DO NOTHING;

-- Stock inicial
INSERT INTO public.stock (componente_id, cantidad_disponible, stock_minimo, ubicacion)
SELECT id_componente,
  CASE
    WHEN tipo = 'RAM' THEN 15
    WHEN tipo = 'CPU' THEN 5
    WHEN tipo = 'GPU' THEN 8
    WHEN tipo = 'SSD' THEN 20
    WHEN tipo = 'HDD' THEN 10
    WHEN tipo = 'software' THEN 999
    ELSE 10
  END,
  5,
  CASE
    WHEN tipo = 'RAM' THEN 'Estante A1'
    WHEN tipo = 'CPU' THEN 'Estante B2'
    WHEN tipo = 'GPU' THEN 'Estante C3'
    WHEN tipo = 'SSD' THEN 'Estante D4'
    WHEN tipo = 'HDD' THEN 'Estante E5'
    WHEN tipo = 'software' THEN 'Digital'
    ELSE 'General'
  END
FROM public.componentes
ON CONFLICT DO NOTHING;

-- Proveedores
INSERT INTO public.proveedores (nombre, contacto, email) VALUES
  ('Distribuidora TechArg', 'Carlos López', 'carlos@techarg.com'),
  ('CompuImport SRL', 'María García', 'ventas@compuimport.com'),
  ('BugRed Logistics', 'Admin', 'logistica@bugred.com')
ON CONFLICT DO NOTHING;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- INFO: Creating admin/technician users
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- To create admin and technician users, you must:
-- 1. First create them via Supabase Auth (supabase.auth.signUp() or dashboard)
-- 2. Get their auth.users.id (UUID)
-- 3. Run the following with the actual UUIDs:
--
-- INSERT INTO public.usuarios (id_usuario, nombre, apellido, email, rol) VALUES
--   ('REPLACE_WITH_ADMIN_UUID', 'Admin', 'BugRed', 'admin@bugred.com', 'ADMIN'),
--   ('REPLACE_WITH_TECH_UUID', 'Tecnico', 'BugRed', 'tecnico@bugred.com', 'TECNICO');
--
-- INSERT INTO public.clientes (id_usuario, tipo_cliente) VALUES
--   ('REPLACE_WITH_ADMIN_UUID', 'empresa');
--
-- INSERT INTO public.tecnicos (id_usuario, especialidad, nivel_experiencia) VALUES
--   ('REPLACE_WITH_TECH_UUID', 'hardware', 'senior');
