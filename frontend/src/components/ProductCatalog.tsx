import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [showAdded, setShowAdded] = useState(false);
    const { addItem } = useCart();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE}/api/products`).then(res => res.json()),
            fetch(`${API_BASE}/api/customizations`).then(res => res.json())
        ]).then((data) => {
            setProducts(data[0]);
            setCustomizations(data[1]);
        }).catch(console.error);
    }, [API_BASE]);

    const relevantCustomizations = selectedProduct?.category === 'tamale' ? customizations.filter(c => ['masa', 'relleno', 'envoltura', 'picante'].includes(c.type)) :
        selectedProduct?.category === 'bebida' ? customizations.filter(c => ['tipo', 'endulzante', 'topping'].includes(c.type)) : [];

    const handleAddToCart = (product: Product) => {
        if (product.category === 'tamale' || product.category === 'bebida') {
            setSelectedProduct(product);
            setSelectedOptions({});
        } else {
            addItem(product);
        }
    };

    const handleConfirmCustomization = () => {
        if (selectedProduct) {
            const customizationsStr = JSON.stringify(selectedOptions);
            addItem(selectedProduct, customizationsStr);
            setSelectedProduct(null);
            setShowAdded(true);
            setTimeout(() => setShowAdded(false), 2000);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(p => (
                    <Card key={p.id}>
                        <CardHeader>
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover rounded" />}
                            <CardTitle>{p.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{p.description}</p>
                            <p className="text-lg font-bold">Q{p.price.toFixed(2)}</p>
                            <p>{p.category} {p.isVegetarian && '(Vegetariano)'}</p>
                            {p.category === 'tamale' || p.category === 'bebida' ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleAddToCart(p)} className="mt-2">Personalizar y Añadir</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Personalizar {selectedProduct?.name}</DialogTitle>
                                        </DialogHeader>
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
                                            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancelar</Button>
                                            <Button 
                                            className='cursor-pointer'
                                            onClick={handleConfirmCustomization}>Añadir al Carrito</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button onClick={() => handleAddToCart(p)} className="mt-2">Añadir al Carrito</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {showAdded && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg animate-fade-in z-50">
                    ¡Añadido al carrito!
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
