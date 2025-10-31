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
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

    useEffect(() => {
        fetch(`${API_BASE}/api/orders`)
            .then(res => res.json())
            .then((data: Order[]) => {
                setOrders(data);
                setSalesMonthly(data.reduce((sum, o) => sum + o.total, 0));
                setTotalOrders(data.length);
            });
    }, [API_BASE]);

    const handleGenerate = async () => {
        const res = await fetch(`${API_BASE}/api/llm/suggest`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({People: people}) });
        const data = await res.text();
        setSuggestion(data);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Panel Administrativo</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded">
                    <h2 className="font-bold">Ventas Diarias</h2>
                    <p className="text-2xl">Q{salesMonthly.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded">
                    <h2 className="font-bold">Pedidos Mensuales</h2>
                    <p className="text-2xl">{totalOrders}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded">
                    <h2 className="font-bold">Productos Más Vendidos</h2>
                    <p>Próximamente</p>
                </div>
                <div className="bg-red-100 p-4 rounded">
                    <h2 className="font-bold">Desperdicio</h2>
                    <p>Q0.00</p>
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
            <h2 className="text-xl font-bold mb-4 mt-6">Sugerencias IA</h2>
            <div className="p-4 border rounded bg-gray-50">
                <input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} placeholder="Número de personas" className="p-2 border rounded mr-2" min="1" />
                <button onClick={handleGenerate} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Generar Sugerencia</button>
                <p className="mt-4 whitespace-pre-line">{suggestion || 'Genera una sugerencia basada en OpenRouter LLM.'}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
