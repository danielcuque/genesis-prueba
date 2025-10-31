import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <nav className="bg-blue-600 text-white p-4">
          <Link to="/" className="mr-4">Inicio</Link>
          <Link to="/productos" className="mr-4">Productos</Link>
          <Link to="/carrito" className="mr-4">Carrito</Link>
          <Link to="/admin" className="mr-4">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<div className="p-4"><h1>Bienvenido a La Cazuela Chapina</h1></div>} />
          <Route path="/productos" element={<ProductCatalog />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
