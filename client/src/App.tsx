import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // ← Добавьте это