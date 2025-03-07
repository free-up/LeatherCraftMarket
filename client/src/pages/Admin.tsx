import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { insertProductSchema } from "@shared/schema";
import type { InsertProduct } from "@shared/schema";
import { Archive, Trash2, Eye, Pencil } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Admin() {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrls: [""],
    },
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: archivedProducts, isLoading: isLoadingArchived } = useQuery<Product[]>({
    queryKey: ["/api/products/archived"],
  });

  const createProduct = useMutation({
    mutationFn: async (data: InsertProduct) => {
      await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      setEditingProduct(null);
      toast({
        title: "Успех",
        description: "Товар успешно создан",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProduct }) => {
      await apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/archived"] });
      form.reset();
      setEditingProduct(null);
      toast({
        title: "Успех",
        description: "Товар успешно обновлен",
      });
    },
  });

  const archiveProduct = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/products/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/archived"] });
      toast({
        title: "Успех",
        description: "Товар перемещен в архив",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/archived"] });
      toast({
        title: "Успех",
        description: "Товар удален",
      });
    },
  });

  const addImageField = () => {
    const currentUrls = form.getValues().imageUrls;
    form.setValue('imageUrls', [...currentUrls, '']);
  };

  const removeImageField = (index: number) => {
    const currentUrls = form.getValues().imageUrls;
    if (currentUrls.length > 1) {
      form.setValue('imageUrls', currentUrls.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrls: product.imageUrls,
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      imageUrls: [""],
    });
  };

  const onSubmit = (data: InsertProduct) => {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data });
    } else {
      createProduct.mutate(data);
    }
  };

  const renderProductList = (items: Product[] | undefined, isLoadingItems: boolean) => {
    if (isLoadingItems) {
      return (
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
      );
    }

    return (
      <div className="space-y-4">
        {items?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.price} ₽</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/product/${product.id}`}>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {!product.archived && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => archiveProduct.mutate(product.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteProduct.mutate(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleFileUpload = async (file: File, field: any) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки файла');
      }

      const data = await response.json();
      // Устанавливаем значение поля на полученный URL
      field.onChange(data.url);
      toast({
        title: "Успешно",
        description: "Изображение загружено",
      });
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      toast({
        title: "Ошибка загрузки",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {editingProduct ? "Редактировать товар" : "Добавить новый товар"}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (в рублях)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('imageUrls').map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`imageUrls.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Изображение {index + 1}</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="flex gap-2 items-center">
                            <Input {...field} type="url" placeholder="URL изображения или загрузите файл" />
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`file-upload-${index}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, field);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                            >
                              Загрузить файл
                            </Button>
                          </div>
                        </FormControl>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeImageField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="w-full"
              >
                Добавить еще изображение
              </Button>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createProduct.isPending || updateProduct.isPending}
                >
                  {editingProduct ? "Сохранить изменения" : "Добавить товар"}
                </Button>
                {editingProduct && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Отмена
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Управление товарами</h2>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Активные товары</TabsTrigger>
              <TabsTrigger value="archived">Архив</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {renderProductList(products, isLoading)}
            </TabsContent>
            <TabsContent value="archived">
              {renderProductList(archivedProducts, isLoadingArchived)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}