import { useState, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { FoodCard } from '@/components/FoodCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const foods = storage.getFoods();

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(foods.map(f => f.category))];
    return cats;
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  return (
    <div className="container py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Explore Our Menu</h1>
        <p className="text-muted-foreground">Fresh food, delivered to your seat</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for dishes..."
          className="pl-9"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap px-4 py-2 transition-smooth"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFoods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
