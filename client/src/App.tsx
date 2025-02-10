import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Archive from "@/pages/Archive";
import ProductDetails from "@/pages/ProductDetails";

function Navigation() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/">
              <a className="flex items-center px-2 py-2 text-lg font-medium">
                Leather Craft
              </a>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/admin">
              <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Admin
              </a>
            </Link>
            <Link href="/archive">
              <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Archive
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={Admin} />
            <Route path="/archive" component={Archive} />
            <Route path="/product/:id" component={ProductDetails} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;