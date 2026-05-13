// ============================================================
// BugRed — Database Types
// Match the schema in supabase/migrations/002_full_schema.sql
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ----- Enums -----
export type Rol = 'ADMIN' | 'CLIENTE' | 'TECNICO';
export type TipoCliente = 'particular' | 'empresa';
export type Especialidad = 'hardware' | 'software';
export type TipoComputadora = 'laptop' | 'desktop';
export type FamiliaSO = 'Windows' | 'Linux' | 'Arch';
export type Arquitectura = 'x64' | 'arm' | 'x86';
export type EntornoSO = 'GUI' | 'CLI' | 'mixto';
export type EstadoOrden = 'recibido' | 'diagnostico' | 'reparacion' | 'listo' | 'entregado';
export type TipoFalla = 'hardware' | 'software' | 'sistema_operativo';
export type TipoComponente = 'RAM' | 'CPU' | 'GPU' | 'SSD' | 'HDD' | 'motherboard' | 'PSU' | 'case' | 'cooler' | 'software';
export type EstadoVenta = 'pendiente' | 'completado' | 'cancelado';
export type EstadoPago = 'pendiente' | 'completado' | 'rechazado';

// ----- Row Interfaces -----
export interface RequestEntry {
  id: string;
  name: string;
  email: string | null;
  problem: string;
  service_type: string;
  created_at: string;
  status: string;
}


export interface SistemaOperativo {
  id_sistema_operativo: string;
  familia: FamiliaSO;
  nombre: string;
  version: string;
  arquitectura: Arquitectura;
  entorno: EntornoSO;
}

export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  rol: Rol;
  fecha_registro: string;
  estado: string | null;
}

export interface Cliente {
  id_usuario: string;
  tipo_cliente: TipoCliente;
}

export interface Tecnico {
  id_usuario: string;
  especialidad: Especialidad;
  nivel_experiencia: string | null;
}

export interface Computadora {
  id_computadora: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  numero_serie: string | null;
  tipo: TipoComputadora;
  id_sistema_operativo: string | null;
  fecha_registro: string;
}

export interface Componente {
  id_componente: string;
  nombre: string;
  tipo: TipoComponente;
  marca: string | null;
  modelo: string | null;
  precio: number;
  garantia_meses: number;
}

export interface Stock {
  id_stock: string;
  componente_id: string;
  cantidad_disponible: number;
  stock_minimo: number;
  ubicacion: string | null;
}

export interface Proveedor {
  id_proveedor: string;
  nombre: string;
  contacto: string | null;
  email: string | null;
  direccion: string | null;
}

export interface CompraProveedor {
  id_compra: string;
  proveedor_id: string;
  fecha: string;
  total: number;
}

export interface DetalleCompra {
  id_detalle: string;
  compra_id: string;
  componente_id: string;
  cantidad: number;
  costo_unitario: number;
}

export interface OrdenServicio {
  id_orden: string;
  cliente_id: string;
  computadora_id: string | null;
  tecnico_id: string | null;
  fecha_ingreso: string;
  fecha_salida_estimada: string | null;
  estado: EstadoOrden;
  problema_reportado: string;
  diagnostico: string | null;
  costo_mano_obra: number;
}

export interface Diagnostico {
  id_diagnostico: string;
  orden_id: string;
  fallas: TipoFalla;
  descripcion: string | null;
  solucion_aplicada: string | null;
  fecha: string;
}

export interface OrdenComponente {
  id_detalle: string;
  orden_id: string;
  componente_id: string;
  cantidad: number;
  precio_aplicado: number;
}

export interface Venta {
  id_venta: string;
  cliente_id: string;
  fecha: string;
  total: number;
  metodo_pago: string | null;
  estado: EstadoVenta;
}

export interface DetalleVenta {
  id_detalle: string;
  venta_id: string;
  componente_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Pago {
  id_pago: string;
  venta_id: string | null;
  orden_id: string | null;
  monto: number;
  fecha: string;
  metodo: string | null;
  estado: EstadoPago;
}

// ----- Supabase Database Type -----
export interface Database {
  public: {
    Tables: {
      requests: {
        Row: RequestEntry;
        Insert: Omit<RequestEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<RequestEntry, 'id' | 'created_at'>>;
        Relationships: [];
      };
      sistemas_operativos: {
        Row: SistemaOperativo;
        Insert: Omit<SistemaOperativo, 'id_sistema_operativo'>;
        Update: Partial<Omit<SistemaOperativo, 'id_sistema_operativo'>>;
        Relationships: [];
      };
      usuarios: {
        Row: Usuario;
        Insert: Omit<Usuario, 'fecha_registro'>;
        Update: Partial<Omit<Usuario, 'id_usuario' | 'fecha_registro'>>;
        Relationships: [];
      };
      clientes: {
        Row: Cliente;
        Insert: Cliente;
        Update: Partial<Omit<Cliente, 'id_usuario'>>;
        Relationships: [];
      };
      tecnicos: {
        Row: Tecnico;
        Insert: Tecnico;
        Update: Partial<Omit<Tecnico, 'id_usuario'>>;
        Relationships: [];
      };
      computadoras: {
        Row: Computadora;
        Insert: Omit<Computadora, 'id_computadora' | 'fecha_registro'>;
        Update: Partial<Omit<Computadora, 'id_computadora' | 'fecha_registro'>>;
        Relationships: [];
      };
      componentes: {
        Row: Componente;
        Insert: Omit<Componente, 'id_componente'>;
        Update: Partial<Omit<Componente, 'id_componente'>>;
        Relationships: [];
      };
      stock: {
        Row: Stock;
        Insert: Omit<Stock, 'id_stock'>;
        Update: Partial<Omit<Stock, 'id_stock'>>;
        Relationships: [];
      };
      proveedores: {
        Row: Proveedor;
        Insert: Omit<Proveedor, 'id_proveedor'>;
        Update: Partial<Omit<Proveedor, 'id_proveedor'>>;
        Relationships: [];
      };
      compras_proveedor: {
        Row: CompraProveedor;
        Insert: Omit<CompraProveedor, 'id_compra' | 'fecha'>;
        Update: Partial<Omit<CompraProveedor, 'id_compra' | 'fecha'>>;
        Relationships: [];
      };
      detalle_compras: {
        Row: DetalleCompra;
        Insert: Omit<DetalleCompra, 'id_detalle'>;
        Update: Partial<Omit<DetalleCompra, 'id_detalle'>>;
        Relationships: [];
      };
      ordenes_servicio: {
        Row: OrdenServicio;
        Insert: Omit<OrdenServicio, 'id_orden' | 'fecha_ingreso'>;
        Update: Partial<Omit<OrdenServicio, 'id_orden' | 'fecha_ingreso'>>;
        Relationships: [];
      };
      diagnosticos: {
        Row: Diagnostico;
        Insert: Omit<Diagnostico, 'id_diagnostico' | 'fecha'>;
        Update: Partial<Omit<Diagnostico, 'id_diagnostico' | 'fecha'>>;
        Relationships: [];
      };
      orden_componentes: {
        Row: OrdenComponente;
        Insert: Omit<OrdenComponente, 'id_detalle'>;
        Update: Partial<Omit<OrdenComponente, 'id_detalle'>>;
        Relationships: [];
      };
      ventas: {
        Row: Venta;
        Insert: Omit<Venta, 'id_venta' | 'fecha'>;
        Update: Partial<Omit<Venta, 'id_venta' | 'fecha'>>;
        Relationships: [];
      };
      detalle_ventas: {
        Row: DetalleVenta;
        Insert: Omit<DetalleVenta, 'id_detalle'>;
        Update: Partial<Omit<DetalleVenta, 'id_detalle'>>;
        Relationships: [];
      };
      pagos: {
        Row: Pago;
        Insert: Omit<Pago, 'id_pago' | 'fecha'>;
        Update: Partial<Omit<Pago, 'id_pago' | 'fecha'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}
