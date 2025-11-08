import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container py-12 px-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
          <Button onClick={() => navigate('/')}>Browse Menu</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart ({cartCount} items)</h1>

        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <Card key={item.food.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="h-24 w-24 rounded-lg object-cover bg-muted"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.food.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.food.description}</p>
                  <p className="text-lg font-bold text-primary">₹{item.food.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.food.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (5%)</span>
              <span>₹{Math.round(cartTotal * 0.05)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{Math.round(cartTotal * 1.05)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button className="flex-1" onClick={() => navigate('/payment')}>
              Proceed to Payment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
