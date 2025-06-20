import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Campsite from './Pages/Campsite';
import ScrollToTop from './components/ScrollToTop';
import Book from './Pages/Book';
import Login from './Pages/Login';
import Order from './Pages/Order';
import Menber from './Pages/Menber';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

function App() {  
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>          
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campsite/:id" element={<Campsite />} />
              <Route path="/campsite/:id/:campsiteId" element={<Book />} />
              <Route path="/login" element={<Login />} />
              <Route path="/order" element={<Order />} />
              <Route path="/menber" element={<Menber />} />
            </Routes>              
        </CartProvider>    
      </UserProvider>    
    </BrowserRouter>
    
  );
}

export default App
