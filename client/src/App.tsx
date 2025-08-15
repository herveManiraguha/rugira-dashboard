import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/Layout/MainLayout";
import "./index.css";

// Import pages
import Overview from "@/pages/Overview";
import Strategies from "@/pages/Strategies";
import Exchanges from "@/pages/Exchanges";
import Compliance from "@/pages/Compliance";
import Reports from "@/pages/Reports";
import Backtesting from "@/pages/Backtesting";
import Monitoring from "@/pages/Monitoring";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import UserDetail from "@/pages/UserDetail";
import Help from "@/pages/Help";
import NotFound from "@/pages/not-found";
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
      <MainLayout>
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/bots" component={Bots} />
          <Route path="/strategies" component={Strategies} />
          <Route path="/exchanges" component={Exchanges} />
          <Route path="/compliance" component={Compliance} />
          <Route path="/reports" component={Reports} />
          <Route path="/backtesting" component={Backtesting} />
          <Route path="/monitoring" component={Monitoring} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
        <Route path="/bots" component={Bots} />
          <Route path="/admin/user/:id" component={UserDetail} />
          <Route path="/help" component={Help} />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;