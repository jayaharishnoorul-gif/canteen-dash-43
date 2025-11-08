import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Manager() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [foods, setFoods] = useState(storage.getFoods());
  const [orders, setOrders] = useState(storage.getOrders());

  const handleAddFood = () => {
    if (!name.trim() || !category.trim() || !price.trim()) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const newFood = {
      id: Date.now().toString(),
      name,
      category,
      description: description || '',
      price: Number(price),
      image: '/placeholder.svg',
      createdAt: Date.now(),
    };

    storage.addFood(newFood);
    setFoods(storage.getFoods());
    
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    
    toast({ title: 'Success', description: 'Food item added successfully!' });
  };

  const handleDeleteFood = (id: string) => {
    storage.deleteFood(id);
    setFoods(storage.getFoods());
    toast({ title: 'Deleted', description: 'Food item removed' });
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Food Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Paneer Tikka"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g., Meals, Snacks, Drinks"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g., 120"
              />
            </div>
            <Button onClick={handleAddFood} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Food Item
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                All Food Items ({foods.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {foods.map(food => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-muted-foreground">{food.category} • ₹{food.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {orders.slice(-10).reverse().map(order => (
                  <div
                    key={order.id}
                    className="p-3 rounded-lg border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-mono">#{order.id.slice(-6)}</span>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items • ₹{order.total}
                    </p>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No orders yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
