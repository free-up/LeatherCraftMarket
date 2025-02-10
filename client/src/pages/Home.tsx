import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://t.me/your_telegram_username', '_blank');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
        Изделия ручной работы из кожи
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <a className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">{product.price} ₽</p>
                    <Button
                      onClick={handleBuyClick}
                      className="bg-gradient-to-r from-amber-700 to-amber-500"
                      size="sm"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Купить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}