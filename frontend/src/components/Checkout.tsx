import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
    const { items, total } = useCart();
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const order = {
            ...formData,
            Total: total,
            OrderItems: items.map(item => ({
                ProductId: item.id,
                Price: item.price,
                Quantity: item.quantity,
                Customizations: item.customizations || '',
            })),
        };

        try {
            const res = await fetch(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (res.ok) {
                alert('Pedido realizado con éxito!');
                // Clear cart somehow, but for now, redirect to home.
                navigate('/');
            } else {
                alert('Error al procesar el pedido.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label className="block">Nombre:</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block">Teléfono:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <h2 className="text-xl font-bold">Total: Q{total.toFixed(2)}</h2>
                <button type="submit" className="bg-green-500 text-white px-6 py-3 mt-4 rounded hover:bg-green-600">
                    Confirmar Pedido
                </button>
            </form>
        </div>
    );
};

export default Checkout;
