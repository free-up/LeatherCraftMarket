
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

export default function Settings() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    siteName: 'Магазин товаров',
    siteDescription: 'Качественные товары по выгодным ценам',
    contactEmail: 'example@example.com',
    contactPhone: '+7 (999) 123-45-67',
    headerImage: '',
    footerText: '© 2023 Магазин товаров. Все права защищены.',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    cardSize: {
      width: 300,
      height: 400,
    },
    productsPerPage: 12,
    sections: {
      featured: 'Популярные товары',
      new: 'Новинки',
      sale: 'Распродажа',
    },
    navigationLinks: [
      { name: 'Главная', path: '/' },
      { name: 'Каталог', path: '/catalog' },
      { name: 'О нас', path: '/about' },
      { name: 'Контакты', path: '/contacts' },
    ],
  });

  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Загрузка настроек с сервера
    const loadSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить настройки сайта.',
          variant: 'destructive',
        });
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const handleChange = (field, value) => {
    // Обработка вложенных полей с использованием точечной нотации
    if (field.includes('.')) {
      const parts = field.split('.');
      setSettings(prev => {
        const updatedSettings = { ...prev };
        let current = updatedSettings;
        
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        return updatedSettings;
      });
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNavLinkChange = (index, field, value) => {
    setSettings(prev => {
      const updatedNavLinks = [...prev.navigationLinks];
      updatedNavLinks[index] = { 
        ...updatedNavLinks[index], 
        [field]: value 
      };
      return {
        ...prev,
        navigationLinks: updatedNavLinks
      };
    });
  };

  const addNavLink = () => {
    setSettings(prev => ({
      ...prev,
      navigationLinks: [
        ...prev.navigationLinks,
        { name: 'Новая ссылка', path: '/new-link' }
      ]
    }));
  };

  const removeNavLink = (index) => {
    setSettings(prev => ({
      ...prev,
      navigationLinks: prev.navigationLinks.filter((_, i) => i !== index)
    }));
  };
  
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/upload', formData);
      if (response.data && response.data.url) {
        handleChange('headerImage', response.data.url);
        toast({
          title: 'Успешно',
          description: 'Изображение загружено',
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive',
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await axios.post('/api/settings', settings);
      toast({
        title: 'Успешно',
        description: 'Настройки сохранены',
      });
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      toast({
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Настройки сайта</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="product-cards">Карточки товаров</TabsTrigger>
          <TabsTrigger value="navigation">Навигация</TabsTrigger>
          <TabsTrigger value="sections">Разделы</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Настройки названия сайта, описания и контактной информации
                </CardDescription>
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
                  <Label htmlFor="siteDescription">Описание сайта</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Контактный email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Контактный телефон</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="footerText">Текст в подвале</Label>
                  <Input
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>
                  Настройки визуального оформления сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headerImage">Изображение для шапки сайта</Label>
                  <div className="flex items-center gap-4">
                    {settings.headerImage && (
                      <img 
                        src={settings.headerImage} 
                        alt="Шапка сайта" 
                        className="h-16 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="header-image-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <Button
                      onClick={() => document.getElementById("header-image-upload")?.click()}
                      variant="outline"
                    >
                      Загрузить
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Основной цвет</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Дополнительный цвет</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="product-cards">
            <Card>
              <CardHeader>
                <CardTitle>Карточки товаров</CardTitle>
                <CardDescription>
                  Настройки отображения карточек товаров
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardWidth">Ширина карточки товара (px)</Label>
                  <Input
                    id="cardWidth"
                    type="number"
                    value={settings.cardSize.width}
                    onChange={(e) => handleChange('cardSize.width', parseInt(e.target.value))}
                    min="200"
                    max="500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardHeight">Высота карточки товара (px)</Label>
                  <Input
                    id="cardHeight"
                    type="number"
                    value={settings.cardSize.height}
                    onChange={(e) => handleChange('cardSize.height', parseInt(e.target.value))}
                    min="300"
                    max="600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productsPerPage">Товаров на странице</Label>
                  <Input
                    id="productsPerPage"
                    type="number"
                    value={settings.productsPerPage}
                    onChange={(e) => handleChange('productsPerPage', parseInt(e.target.value))}
                    min="4"
                    max="24"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="navigation">
            <Card>
              <CardHeader>
                <CardTitle>Навигация</CardTitle>
                <CardDescription>
                  Настройка элементов навигационного меню
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.navigationLinks.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                      <div className="space-y-2">
                        <Label htmlFor={`nav-name-${index}`}>Название</Label>
                        <Input
                          id={`nav-name-${index}`}
                          value={link.name}
                          onChange={(e) => handleNavLinkChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`nav-path-${index}`}>Путь</Label>
                        <Input
                          id={`nav-path-${index}`}
                          value={link.path}
                          onChange={(e) => handleNavLinkChange(index, 'path', e.target.value)}
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeNavLink(index)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNavLink}
                    className="w-full mt-4"
                  >
                    Добавить ссылку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <CardTitle>Разделы сайта</CardTitle>
                <CardDescription>
                  Настройки заголовков разделов на главной странице
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionFeatured">Раздел "Популярные товары"</Label>
                  <Input
                    id="sectionFeatured"
                    value={settings.sections.featured}
                    onChange={(e) => handleChange('sections.featured', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sectionNew">Раздел "Новинки"</Label>
                  <Input
                    id="sectionNew"
                    value={settings.sections.new}
                    onChange={(e) => handleChange('sections.new', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sectionSale">Раздел "Распродажа"</Label>
                  <Input
                    id="sectionSale"
                    value={settings.sections.sale}
                    onChange={(e) => handleChange('sections.sale', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex items-center justify-end gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
