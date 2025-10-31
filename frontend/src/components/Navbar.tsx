import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow border-b">
      <Link to="/" className="text-xl font-bold text-gray-800">La Cazuela Chapina</Link>
      <div className="flex space-x-2 items-center">
        <Button asChild variant="ghost">
          <Link to="/">Inicio</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/productos">Productos</Link>
        </Button>
        <Button asChild variant="ghost" className="relative">
          <Link to="/carrito">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/admin">Admin</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
