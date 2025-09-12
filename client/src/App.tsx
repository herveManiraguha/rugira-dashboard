import React, { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/Layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { EnvironmentProvider } from "@/contexts/EnvironmentContext";
import { ScopeProvider } from "@/contexts/ScopeContext";
import { AppInitializer } from "@/components/AppInitializer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./index.css";

// Import critical pages immediately (login, auth, and initial dashboard view)
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import SilentCallback from "@/pages/SilentCallback";
import Overview from "@/pages/Overview";
import DemoOverview from "@/pages/DemoOverview";
import NotFound from "@/pages/NotFound";

// Lazy load heavy dashboard sections for code-splitting
const Strategies = lazy(() => import("@/pages/Strategies"));
const Venues = lazy(() => import("@/pages/Venues"));
const Compliance = lazy(() => import("@/pages/Compliance"));
const Reports = lazy(() => import("@/pages/ReportsNew"));
const Backtesting = lazy(() => import("@/pages/Backtesting"));
const Monitoring = lazy(() => import("@/pages/Monitoring"));
const Settings = lazy(() => import("@/pages/Settings"));
const Profile = lazy(() => import("@/pages/Profile"));
const ApiKeys = lazy(() => import("@/pages/ApiKeys"));
const Organization = lazy(() => import("@/pages/Organization"));
const Admin = lazy(() => import("@/pages/Admin"));
const UserDetail = lazy(() => import("@/pages/UserDetail"));
const Help = lazy(() => import("@/pages/Help"));
const InternalChecks = lazy(() => import("@/pages/InternalChecks"));
const Bots = lazy(() => import("@/pages/Bots"));
const Tenants = lazy(() => import("@/pages/Tenants"));
const TenantDetail = lazy(() => import("@/pages/TenantDetail"));
const CreateTenant = lazy(() => import("@/pages/CreateTenant"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider>
        <ScopeProvider>
          <DemoProvider>
            <AuthProvider>
              <AppInitializer>
              <Switch>
          {/* Public routes */}
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/auth/silent-callback" component={SilentCallback} />
          
          {/* Public demo route */}
          <Route path="/demo" component={DemoOverview} />
          
          {/* Protected routes */}
          <Route path="/overview">
            <ProtectedRoute>
              <MainLayout>
                <Overview />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/bots">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Bots />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/strategies">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Strategies />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/venues">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Venues />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/compliance">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Compliance />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/reports">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Reports />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/backtesting">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Backtesting />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/monitoring">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Monitoring />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/settings">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/profile">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Profile />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/admin">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Admin />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/admin/user/:id">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <UserDetail />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/tenants">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Tenants />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/tenants/new">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <CreateTenant />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/tenants/:id">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <TenantDetail />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/api-keys">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <ApiKeys />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/organization">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Organization />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/help">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Help />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/internal/checks">
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <InternalChecks />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route component={NotFound} />
        </Switch>
              </AppInitializer>
            </AuthProvider>
          </DemoProvider>
        </ScopeProvider>
      </EnvironmentProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;