import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="animate-pulse">
          <div className="h-96 bg-muted rounded-t-lg" />
          <CardContent className="p-6">
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-2" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <Link href="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">${product.price}</p>
          </div>
          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Назад к списку</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
