export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceType: string;
  deviceType: string | null;
  brand: string | null;
  model: string | null;
  problemDescription: string | null;
  observations: string | null;
  status: string;
  priority: string;
  estimatedPrice: number | null;
  finalPrice: number | null;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
  user?: User;
  repair?: Repair;
  payment?: Payment;
}

export interface Repair {
  id: string;
  orderId: string;
  technicianId: string;
  diagnostic: string | null;
  solution: string | null;
  partsUsed: string | null;
  repairTime: number | null;
  repairStatus: string;
  notes: string | null;
  createdAt: string;
  technician?: User;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  referenceId: string | null;
  createdById: string;
  createdAt: string;
  createdBy?: User;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  specs: string | null;
  stock: number;
  price: number;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}
