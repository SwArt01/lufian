import { AdminOrder, Customer } from '@/lib/types';

export const mockOrders: AdminOrder[] = [
    { id: "#ORD-7352", customer: "Ahmet Yılmaz", date: "24 Eki 2024", total: "7650", status: "Delivered", items: 3 },
    { id: "#ORD-7351", customer: "Ayşe Kaya", date: "24 Eki 2024", total: "2990", status: "Processing", items: 1 },
    { id: "#ORD-7350", customer: "Mehmet Demir", date: "23 Eki 2024", total: "13670", status: "Shipped", items: 5 },
    { id: "#ORD-7349", customer: "Elif Çelik", date: "23 Eki 2024", total: "3990", status: "Cancelled", items: 1 },
    { id: "#ORD-7348", customer: "Can Öztürk", date: "22 Eki 2024", total: "10150", status: "Delivered", items: 4 },
];

export const mockCustomers: Customer[] = [
    { id: "CUST-001", name: "Ahmet Yılmaz", email: "ahmet.y@example.com", orders: 12, totalSpent: "47150", lastActive: "2 saat önce" },
    { id: "CUST-002", name: "Ayşe Kaya", email: "ayse.k@example.com", orders: 4, totalSpent: "11050", lastActive: "1 gün önce" },
    { id: "CUST-003", name: "Mehmet Demir", email: "m.demir@example.com", orders: 8, totalSpent: "31870", lastActive: "5 saat önce" },
    { id: "CUST-004", name: "Elif Çelik", email: "elif.c@example.com", orders: 2, totalSpent: "3990", lastActive: "1 hafta önce" },
    { id: "CUST-005", name: "Can Öztürk", email: "can.o@example.com", orders: 15, totalSpent: "68250", lastActive: "3 gün önce" },
];
