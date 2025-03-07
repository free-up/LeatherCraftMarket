
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("/api/auth/login", { password });
      
      // Сохраняем токен в localStorage
      localStorage.setItem("auth_token", response.data.token);
      
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      });
      
      // Перенаправление на админку
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный пароль",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход в админку</CardTitle>
          <CardDescription>
            Введите пароль для входа в административную панель
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
