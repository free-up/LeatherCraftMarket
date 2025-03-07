import React, { useEffect, useState } from "react";
import Link from "wouter/link";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";

export interface SiteSettings {
  headerImage?: string;
}

const Navigation: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки настроек:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <a className="font-bold text-xl flex items-center">
                {settings.headerImage ? (
                  <img
                    src={settings.headerImage}
                    alt="Логотип"
                    className="h-10 mr-2 rounded"
                  />
                ) : (
                  <span className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white mr-2">
                    М
                  </span>
                )}
                <span>МагазинТуй</span>
              </a>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/">
              <a className="px-3 py-2 rounded hover:bg-slate-100">Главная</a>
            </Link>
            <Link href="/catalog">
              <a className="px-3 py-2 rounded hover:bg-slate-100">Каталог</a>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/admin">
                  <a className="px-3 py-2 rounded hover:bg-slate-100">
                    Админка
                  </a>
                </Link>
                <Link href="/settings">
                  <a className="px-3 py-2 rounded hover:bg-slate-100">
                    Настройки
                  </a>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Выйти
                </Button>
              </>
            ) : (
              <Link href="/login">
                <a className="px-3 py-2 rounded hover:bg-slate-100">
                  Вход
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;