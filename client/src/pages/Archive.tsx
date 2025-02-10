import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@shared/schema";

export default function Archive() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/archived"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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
      <h1 className="text-3xl font-bold mb-8">Архивированные товары</h1>

      <div className="space-y-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex gap-4">
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="h-24 w-24 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-muted-foreground mb-2">{product.description}</p>
                <p className="text-lg font-medium">{product.price} ₽</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}