import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { storage } from '@/lib/storage';
import { PaymentMethod } from '@/types';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!user) return;

    if (cart.length === 0) {
      toast({ title: 'Error', description: 'Cart is empty', variant: 'destructive' });
      return;
    }

    // Validate payment method specific fields
    if (paymentMethod === 'card' && !cardNumber.trim()) {
      toast({ title: 'Error', description: 'Please enter card details', variant: 'destructive' });
      return;
    }
    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast({ title: 'Error', description: 'Please enter UPI ID', variant: 'destructive' });
      return;
    }

    const total = Math.round(cartTotal * 1.05);
    const order = {
      id: Date.now().toString(),
      userId: user.id,
      items: cart,
      total,
      status: 'pending' as const,
      paymentMethod,
      createdAt: Date.now(),
    };

    const eBill = {
      id: Date.now().toString(),
      orderId: order.id,
      userId: user.id,
      items: cart,
      total,
      paymentMethod,
      createdAt: Date.now(),
    };

    storage.addOrder(order);
    storage.addEBill(eBill);
    
    // Add notification for managers
    storage.addNotification({
      id: Date.now().toString(),
      userId: 'all_managers',
      message: `New order #${order.id.slice(-6)} - ₹${total}`,
      read: false,
      createdAt: Date.now(),
    });

    clearCart();
    toast({ title: 'Success', description: 'Order placed successfully!' });
    navigate(`/ebill/${eBill.id}`);
  };

  return (
    <div className="container py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>₹{Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{Math.round(cartTotal * 1.05)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5" />
                    <span>Cash on Delivery</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" />
                    <span>Card Payment</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wallet className="h-5 w-5" />
                    <span>UPI Payment</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/cart')}>
              Back to Cart
            </Button>
            <Button className="flex-1" onClick={handlePayment}>
              Pay ₹{Math.round(cartTotal * 1.05)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
