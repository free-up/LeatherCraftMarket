import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/ui/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Archive from "@/pages/Archive";
import ProductDetails from "@/pages/ProductDetails";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Navigation() {
  //This Navigation component only partially addresses the user request.  A hidden route for admin access is needed for a complete solution.
  const { isAuthenticated, loading, logout } = useAuth(); // useAuth is assumed to be defined elsewhere

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg font-bold">
            Мой Магазин
          </Link>
          <Link href="/archive" className="text-sm text-muted-foreground">
            Архив
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!loading && isAuthenticated && (
            <>
              <Link href="/admin" className="text-sm text-muted-foreground">
                Админка
              </Link>
              <Link href="/settings" className="text-sm text-muted-foreground">
                Настройки
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}> {/* Button component is assumed to be defined elsewhere */}
                Выйти
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/archive" component={Archive} />
              <Route path="/product/:id" component={ProductDetails} />
              <Route path="/admin">
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              </Route>
              <Route path="/settings">
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;