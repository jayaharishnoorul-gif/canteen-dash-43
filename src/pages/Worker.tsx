import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';

export default function Worker() {
  const [orders] = useState(storage.getOrders());

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            All Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice().reverse().map(order => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.food.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">₹{item.food.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-sm text-muted-foreground capitalize">{order.paymentMethod}</span>
                    <span className="font-bold text-primary">Total: ₹{order.total}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No orders to display
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
