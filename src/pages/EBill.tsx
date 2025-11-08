import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function EBill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bill = storage.getEBills().find(b => b.id === id);

  if (!bill) {
    return (
      <div className="container py-12 px-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <p className="text-muted-foreground">Bill not found</p>
          <Button className="mt-4" onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    toast({ title: 'Printing...', description: 'Use your browser print dialog' });
  };

  return (
    <div className="container py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your order has been placed successfully</p>
        </div>

        <Card className="shadow-custom-lg print:shadow-none">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl">CanteenOne</CardTitle>
            <p className="text-sm text-muted-foreground">E-Bill</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bill ID:</span>
                <span className="font-mono">{bill.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(bill.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="capitalize">{bill.paymentMethod}</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Order Items</h3>
                {bill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="flex-1">
                      {item.food.name} × {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.food.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{bill.total / 1.05}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>₹{Math.round(bill.total - bill.total / 1.05)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Paid</span>
                  <span className="text-primary">₹{bill.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6 print:hidden">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Print / Save
          </Button>
          <Button className="flex-1" onClick={() => navigate('/')}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
