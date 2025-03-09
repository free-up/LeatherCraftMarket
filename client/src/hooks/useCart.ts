// client/src/hooks/useCart.ts
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useCart = (userId: string) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const cartDoc = await getDoc(doc(db, "carts", userId));
      if (cartDoc.exists()) setCart(cartDoc.data().items);
    };
    fetchCart();
  }, [userId]);

  const addToCart = async (product) => {
    await setDoc(doc(db, "carts", userId), {
      items: [...cart, product]
    }, { merge: true });
  };

  return { cart, addToCart };
};