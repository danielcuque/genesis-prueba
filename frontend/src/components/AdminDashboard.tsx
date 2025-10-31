import React, { useState, useEffect } from 'react';

interface Order {
    id: number;
    customerName: string;
    email: string;
    phone: string;
    total: number;
    status: string;
    createdAt: string;
    orderItems: OrderItem[];
}

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    customizations: string;
}

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [salesMonthly, setSalesMonthly] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [people, setPeople] = useState(10);
    const [suggestion, setSuggestion] = useState('');
    const [salesAnalysis, setSalesAnalysis] = useState('');
    const [kpis, setKpis] = useState({
        dailySales: 0,
        monthlySales: 0,
        bestTamale: '',
        spicyRatio: '',
        totalItems: 0,
        spicyItems: 0
    });
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

    useEffect(() => {
        fetch(`${API_BASE}/api/orders`)
            .then(res => res.json())
            .then((data: Order[]) => {
                setOrders(data);
                setSalesMonthly(data.reduce((sum, o) => sum + o.total, 0));
                setTotalOrders(data.length);

                // Calculate KPIs
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const dailySales = data
                    .filter(o => new Date(o.createdAt) >= today)
                    .reduce((sum, o) => sum + o.total, 0);

                const monthlySales = data
                    .filter(o => new Date(o.createdAt) >= thisMonth)
                    .reduce((sum, o) => sum + o.total, 0);

                // Best selling tamales
                const tamaleSales = data.flatMap(o => o.orderItems)
                    .filter(item => item.customizations?.includes('tamale'))
                    .reduce((acc, item) => {
                        acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
                        return acc;
                    }, {} as Record<number, number>);

                const bestTamale = Object.entries(tamaleSales)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

                // Spicy ratio
                const totalItems = data.flatMap(o => o.orderItems).length;
                const spicyItems = data.flatMap(o => o.orderItems)
                    .filter(item => item.customizations?.includes('chapín') || item.customizations?.includes('suave')).length;
                const spicyRatio = totalItems > 0 ? ((spicyItems / totalItems) * 100).toFixed(1) + '%' : '0%';

                setKpis({
                    dailySales,
                    monthlySales,
                    bestTamale,
                    spicyRatio,
                    totalItems,
                    spicyItems
                });
            });
    }, [API_BASE]);

    const handleGenerate = async () => {
        const res = await fetch(`${API_BASE}/api/llm/suggest`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({People: people}) });
        const data = await res.text();
        setSuggestion(data);
    };

    const handleAnalyzeSales = async () => {
        const res = await fetch(`${API_BASE}/api/llm/analyze-sales`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(orders) });
        const data = await res.text();
        setSalesAnalysis(data);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Panel Administrativo</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded">
                    <h2 className="font-bold">Ventas Diarias</h2>
                    <p className="text-2xl">Q{kpis.dailySales.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded">
                    <h2 className="font-bold">Ventas Mensuales</h2>
                    <p className="text-2xl">Q{kpis.monthlySales.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded">
                    <h2 className="font-bold">Tamales Más Vendidos</h2>
                    <p className="text-lg">Producto ID: {kpis.bestTamale}</p>
                </div>
                <div className="bg-red-100 p-4 rounded">
                    <h2 className="font-bold">Proporción Picante</h2>
                    <p className="text-2xl">{kpis.spicyRatio}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-100 p-4 rounded">
                    <h2 className="font-bold">Utilidades por Línea</h2>
                    <p className="text-lg">Tamales: Q{kpis.totalItems * 10}, Bebidas: Q{kpis.spicyItems * 5}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded">
                    <h2 className="font-bold">Desperdicio de Materias Primas</h2>
                    <p className="text-2xl">Q0.00</p>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Pedidos Recientes</h2>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.customerName}</td>
                            <td className="p-2">Q{order.total.toFixed(2)}</td>
                            <td className="p-2">{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 className="text-xl font-bold mb-4 mt-6">Análisis de Ventas con IA</h2>
            <div className="p-4 border rounded bg-blue-50 mb-6">
                <button onClick={handleAnalyzeSales} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Analizar Ventas</button>
                <p className="mt-4 whitespace-pre-line">{salesAnalysis || 'Genera un análisis de ventas basado en métricas.'}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
