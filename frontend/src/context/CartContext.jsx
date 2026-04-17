import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rgs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rgs_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, weight = '', qty = 1) => {
    const key = `${product._id}-${weight}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + qty } : i);
      }
      const price = product.discountPrice || product.price;
      return [...prev, {
        key,
        product: product._id,
        title: product.titleEn,
        titleUr: product.titleUr,
        image: product.images?.[0] || '',
        price,
        weight,
        quantity: qty,
      }];
    });
  };

  const removeFromCart = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 2000 ? 0 : (items.length > 0 ? 150 : 0);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart,
      totalItems, subtotal, deliveryFee, total,
      isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
