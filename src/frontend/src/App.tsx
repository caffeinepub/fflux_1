import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Home from './pages/Home';
import Builds from './pages/Builds';
import LoginButton from './components/LoginButton';
import CreatorStatus from './components/CreatorStatus';
import { Download, List } from 'lucide-react';
import { Button } from './components/ui/button';

// Layout component with header and footer
function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background image */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/fflux-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/assets/generated/fflux-logo.dim_512x512.png" 
                  alt="fflux" 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl font-bold tracking-tight">fflux</h1>
              </div>
              
              <nav className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/' })}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/builds' })}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Builds
                </Button>
                <div className="h-6 w-px bg-border" />
                <CreatorStatus />
                <LoginButton />
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} fflux. All rights reserved.</p>
              <p>
                Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const buildsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/builds',
  component: Builds,
});

const routeTree = rootRoute.addChildren([indexRoute, buildsRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
