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
  return (
    <header>
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-amber-900 to-amber-700">
          <div className="absolute inset-0 bg-black/30">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center">
                Кожаные изделия ручной работы KoBro
              </h1>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/">
                <a className="flex items-center px-2 py-2 text-lg font-medium">
                  KoBro
                </a>
              </Link>
              <Link href="/archive">
                <a className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Архив изделий
                </a>
              </Link>
            </div>
            <div className="flex">
              <Link href="/login"> {/* Changed link to login page */}
                <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Админ панель
                </a>
              </Link>
            </div>
          </div>
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