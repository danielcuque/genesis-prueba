import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { items, removeItem, total } = useCart();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
            {items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="border rounded p-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl">{item.name}</h2>
                                    <p>Cantidad: {item.quantity}</p>
                                    <p>Total: Q{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <p className="text-lg font-bold">Total: Q{total.toFixed(2)}</p>
                        <Link to="/checkout" className="bg-blue-500 text-white px-6 py-3 mt-4 rounded hover:bg-blue-600 inline-block">
                            Proceder a Pagar
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
