import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ComboSuggestion from './components/ComboSuggestion';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <div className="p-4">
              <h1 className="text-3xl font-bold mb-6">Bienvenido a La Cazuela Chapina</h1>
              <p className="mb-8">Descubre nuestros tamales tradicionales y bebidas artesanales, personalizados según tus preferencias.</p>
              <ComboSuggestion />
            </div>
          } />
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
