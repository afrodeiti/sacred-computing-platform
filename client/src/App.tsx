import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HealingSearch from "@/pages/healing-search";
import IntentionRecommendation from "@/pages/intention-recommendation";
import SacredGeometryPage from "@/pages/sacred-geometry";
import SacredGeometryInteractivePage from "@/pages/sacred-geometry-interactive";
import IntentionBroadcast from "@/pages/intention-broadcast";
import { SacredProvider } from "./context/sacred-context";
import { SocketProvider } from "./context/socket-context";
import { ThemeProvider } from "./components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/healing-search" component={HealingSearch} />
      <Route path="/intention-recommendation" component={IntentionRecommendation} />
      <Route path="/sacred-geometry" component={SacredGeometryPage} />
      <Route path="/sacred-geometry-interactive" component={SacredGeometryInteractivePage} />
      <Route path="/intention-broadcast" component={IntentionBroadcast} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="sacred-theme">
      <QueryClientProvider client={queryClient}>
        <SacredProvider>
          <SocketProvider>
            <Router />
            <Toaster />
          </SocketProvider>
        </SacredProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
