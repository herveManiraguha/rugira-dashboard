import React from "react";
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

// Import pages
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import SilentCallback from "@/pages/SilentCallback";
import Overview from "@/pages/Overview";
import DemoOverview from "@/pages/DemoOverview";
import Strategies from "@/pages/Strategies";
import Venues from "@/pages/Venues";
import Compliance from "@/pages/Compliance";
import Reports from "@/pages/ReportsNew";
import Backtesting from "@/pages/Backtesting";
import Monitoring from "@/pages/Monitoring";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import ApiKeys from "@/pages/ApiKeys";
import Organization from "@/pages/Organization";
import Admin from "@/pages/Admin";
import UserDetail from "@/pages/UserDetail";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import InternalChecks from "@/pages/InternalChecks";
import Bots from "@/pages/Bots";



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
                <Bots />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/strategies">
            <ProtectedRoute>
              <MainLayout>
                <Strategies />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/venues">
            <ProtectedRoute>
              <MainLayout>
                <Venues />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/compliance">
            <ProtectedRoute>
              <MainLayout>
                <Compliance />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/reports">
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/backtesting">
            <ProtectedRoute>
              <MainLayout>
                <Backtesting />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/monitoring">
            <ProtectedRoute>
              <MainLayout>
                <Monitoring />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/settings">
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/profile">
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/admin">
            <ProtectedRoute>
              <MainLayout>
                <Admin />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/admin/user/:id">
            <ProtectedRoute>
              <MainLayout>
                <UserDetail />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/profile">
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/api-keys">
            <ProtectedRoute>
              <MainLayout>
                <ApiKeys />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/organization">
            <ProtectedRoute>
              <MainLayout>
                <Organization />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/help">
            <ProtectedRoute>
              <MainLayout>
                <Help />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path="/internal/checks">
            <ProtectedRoute>
              <MainLayout>
                <InternalChecks />
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