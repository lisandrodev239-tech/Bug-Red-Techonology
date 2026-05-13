import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: any) {
  if (amount === null || amount === undefined) return "$0";
  const num = typeof amount === "object" ? Number(amount) : Number(amount);
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: any) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function serialize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "object" && "toNumber" in obj) return Number(obj);
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serialize(v)])
    );
  }
  return obj;
}

export const serviceTypes: Record<string, string> = {
  reparacion: "Reparación",
  mantenimiento: "Mantenimiento",
  limpieza: "Limpieza",
  diagnostico: "Diagnóstico",
  instalacion_so: "Instalación SO",
  armado_pc: "Armado PC",
};

export const orderStatuses: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En Progreso",
  completado: "Completado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const repairStatuses: Record<string, string> = {
  en_diagnostico: "En Diagnóstico",
  en_reparacion: "En Reparación",
  esperando_partes: "Esperando Partes",
  completado: "Completado",
};
