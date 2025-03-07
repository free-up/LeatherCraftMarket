
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
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SiteSettings {
  siteName: string;
  mainTitle: string;
  mainDescription: string;
  cardSize: {
    width: number;
    height: number;
  };
  sections: {
    home: string;
    archive: string;
    admin: string;
  };
}

export default function Settings() {
  const { isAuthenticated, isLoading } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'KoBro',
    mainTitle: 'Кожаные изделия ручной работы KoBro',
    mainDescription: 'Качественные изделия из натуральной кожи',
    cardSize: {
      width: 300,
      height: 400,
    },
    sections: {
      home: 'Главная',
      archive: 'Архив изделий',
      admin: 'Админ панель',
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке настроек', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить настройки сайта',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/settings', settings);
      toast({
        title: 'Успех',
        description: 'Настройки сайта успешно сохранены',
      });
    } catch (error) {
      console.error('Ошибка при сохранении настроек', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки сайта',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    const newSettings = { ...settings };
    
    // Обработка вложенных полей через точечную нотацию
    const parts = field.split('.');
    let current: any = newSettings;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
    setSettings(newSettings);
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">Доступ запрещен. Необходима авторизация.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Настройки сайта</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Основные настройки</CardTitle>
            <CardDescription>Настройте основные параметры сайта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Название сайта</Label>
              <Input 
                id="siteName" 
                value={settings.siteName} 
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mainTitle">Заголовок главной страницы</Label>
              <Input 
                id="mainTitle" 
                value={settings.mainTitle} 
                onChange={(e) => handleChange('mainTitle', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mainDescription">Описание сайта</Label>
              <Input 
                id="mainDescription" 
                value={settings.mainDescription} 
                onChange={(e) => handleChange('mainDescription', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Настройки разделов</CardTitle>
            <CardDescription>Измените названия разделов сайта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeSection">Главная</Label>
              <Input 
                id="homeSection" 
                value={settings.sections.home} 
                onChange={(e) => handleChange('sections.home', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="archiveSection">Архив</Label>
              <Input 
                id="archiveSection" 
                value={settings.sections.archive} 
                onChange={(e) => handleChange('sections.archive', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminSection">Админ панель</Label>
              <Input 
                id="adminSection" 
                value={settings.sections.admin} 
                onChange={(e) => handleChange('sections.admin', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Настройки карточек</CardTitle>
            <CardDescription>Измените размеры карточек товаров</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardWidth">Ширина карточки (px)</Label>
              <Input 
                id="cardWidth" 
                type="number" 
                value={settings.cardSize.width} 
                onChange={(e) => handleChange('cardSize.width', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardHeight">Высота карточки (px)</Label>
              <Input 
                id="cardHeight" 
                type="number" 
                value={settings.cardSize.height} 
                onChange={(e) => handleChange('cardSize.height', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
        
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
