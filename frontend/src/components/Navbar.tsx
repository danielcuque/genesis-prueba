import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow border-b">
      <Link to="/" className="text-xl font-bold text-gray-800">La Cazuela Chapina</Link>
      <div className="flex space-x-2">
        <Button asChild variant="ghost">
          <Link to="/">Inicio</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/productos">Productos</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/carrito">Carrito</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/admin">Admin</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
