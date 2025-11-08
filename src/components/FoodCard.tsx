import { FoodItem } from '@/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus, Info } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard = ({ food }: FoodCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-smooth hover:shadow-custom-md group">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => navigate(`/food/${food.id}`)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-1">{food.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{food.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-lg font-bold text-primary">₹{food.price}</span>
          </div>
          
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => addToCart(food)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};
