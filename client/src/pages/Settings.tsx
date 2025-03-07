
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { toast } = useToast();
  const [headerImage, setHeaderImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setHeaderImage(data.headerImage || "");
        }
      } catch (error) {
        console.error("Ошибка при загрузке настроек:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка загрузки файла");
      }

      const data = await response.json();
      setHeaderImage(data.url);
      toast({
        title: "Успешно",
        description: "Изображение загружено",
      });
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      toast({
        title: "Ошибка загрузки",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headerImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сохранения настроек");
      }

      toast({
        title: "Успешно",
        description: "Настройки сохранены",
      });
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
      toast({
        title: "Ошибка",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Настройки сайта</h1>
      
      <Tabs defaultValue="appearance">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="general">Общие</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Настройки внешнего вида</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="header-image">Изображение в шапке</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="header-image"
                    value={headerImage}
                    onChange={(e) => setHeaderImage(e.target.value)}
                    placeholder="URL изображения"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="header-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("header-image-upload")?.click()}
                  >
                    Загрузить
                  </Button>
                </div>
                {headerImage && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Предпросмотр:</p>
                    <div className="border rounded-md overflow-hidden h-32 bg-gray-100">
                      <img
                        src={headerImage}
                        alt="Предпросмотр шапки"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={saveSettings} 
                disabled={loading}
              >
                {loading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Здесь будут общие настройки сайта.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
