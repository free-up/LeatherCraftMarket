import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = () => {
    setCurrentImageIndex((current) =>
      current === product.imageUrls.length - 1 ? 0 : current + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((current) =>
      current === 0 ? product.imageUrls.length - 1 : current - 1
    );
  };

  const handleBuyClick = () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = `Здравствуйте! Интересует товар: ${product.name}\n${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/broncheg?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={product.imageUrls[currentImageIndex]}
            alt={`${product.name} - изображение ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-t-lg"
          />
          {product.imageUrls.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          {product.archived && (
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" className="text-lg font-semibold transform rotate-12">
                Продано
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">{product.price} ₽</p>
          </div>
          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
          <div className="flex gap-4">
            <Link href={product.archived ? "/archive" : "/"}>
              <Button variant="outline">
                {product.archived ? "Назад к архиву" : "Назад к списку"}
              </Button>
            </Link>
            {!product.archived && (
              <Button onClick={handleBuyClick} className="bg-gradient-to-r from-amber-700 to-amber-500">
                <MessageCircle className="mr-2 h-4 w-4" />
                Купить
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}