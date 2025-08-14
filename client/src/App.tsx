import React, { useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import Sidebar from "./components/Layout/Sidebar";
import TopBar from "./components/Layout/TopBar";
import CreateBotModal from "./components/Modals/CreateBotModal";
import Overview from "./pages/Overview";
import Bots from "./pages/Bots";
import Strategies from "./pages/Strategies";
import Exchanges from "./pages/Exchanges";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import Backtesting from "./pages/Backtesting";
import Monitoring from "./pages/Monitoring";
import Admin from "./pages/Admin";
import Help from "./pages/Help";
import { useApiStore } from "./stores";
import { startRealTimeConnection } from "./services/realtime";

function App() {
  const { checkConnection } = useApiStore();

  useEffect(() => {
    // Initialize API connection
    checkConnection();
    
    // TODO: Start real-time updates after basic app is working
    // startRealTimeConnection();
  }, [checkConnection]);

  return (
    <div id="app" className="min-h-screen flex bg-bg-1 font-inter">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="p-6">
          <Router>
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/bots" component={Bots} />
              <Route path="/strategies" component={Strategies} />
              <Route path="/exchanges" component={Exchanges} />
              <Route path="/compliance" component={Compliance} />
              <Route path="/reports" component={Reports} />
              <Route path="/backtesting" component={Backtesting} />
              <Route path="/monitoring" component={Monitoring} />
              <Route path="/admin" component={Admin} />
              <Route path="/help" component={Help} />
            </Switch>
          </Router>
        </main>
      </div>
      <CreateBotModal />
    </div>
  );
}

export default App;
