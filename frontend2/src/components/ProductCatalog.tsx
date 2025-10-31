import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    isVegetarian: boolean;
    isAvailable: boolean;
}

interface Customization {
    id: number;
    name: string;
    type: string;
    options: string;
    extraPrice: number;
}

const ProductCatalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [customizations, setCustomizations] = useState<Customization[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const { addItem } = useCart();

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:5053/api/products').then(res => res.json()),
            fetch('http://localhost:5053/api/customizations').then(res => res.json())
        ]).then((data) => {
            setProducts(data[0]);
            setCustomizations(data[1]);
        }).catch(console.error);
    }, []);

    const relevantCustomizations = selectedProduct?.category === 'tamale' ? customizations.filter(c => ['masa', 'relleno', 'envoltura', 'picante'].includes(c.type)) :
        selectedProduct?.category === 'bebida' ? customizations.filter(c => ['tipo', 'endulzante', 'topping'].includes(c.type)) : [];

    const handleAddToCart = (product: Product) => {
        if (product.category === 'tamale' || product.category === 'bebida') {
            setSelectedProduct(product);
            setSelectedOptions({});
            setShowModal(true);
        } else {
            addItem(product);
        }
    };

    const handleConfirmCustomization = () => {
        if (selectedProduct) {
            const customizationsStr = JSON.stringify(selectedOptions);
            addItem(selectedProduct, customizationsStr);
            setShowModal(false);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} className="border rounded p-4 shadow">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" />}
                        <h2 className="text-xl font-semibold">{p.name}</h2>
                        <p className="text-gray-600">{p.description}</p>
                        <p className="text-lg font-bold">Q{p.price.toFixed(2)}</p>
                        <p>{p.category} {p.isVegetarian && '(Vegetariano)'}</p>
                        <button onClick={() => handleAddToCart(p)} className="bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-600">Añadir al carrito</button>
                    </div>
                ))}
            </div>

            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl mb-4">Personalizar {selectedProduct.name}</h2>
                        {relevantCustomizations.map(cust => (
                            <div key={cust.id} className="mb-4">
                                <label className="block mb-1">{cust.name}</label>
                                <select
                                    value={selectedOptions[cust.type] || ''}
                                    onChange={(e) => setSelectedOptions(prev => ({ ...prev, [cust.type]: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Selecciona...</option>
                                    {cust.options.split(',').map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                            <button onClick={handleConfirmCustomization} className="bg-green-500 text-white px-4 py-2 rounded">Añadir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
