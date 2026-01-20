import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Posts from "@/pages/Posts";
import PostDetail from "@/pages/PostDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import { easing, duration, distance } from "@/lib/motion";

function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: distance.small }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -distance.small }}
      transition={{ 
        duration: duration.standard, 
        ease: easing.standard 
      }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/">
          <PageTransition><Home /></PageTransition>
        </Route>
        <Route path="/projects">
          <PageTransition><Projects /></PageTransition>
        </Route>
        <Route path="/projects/:id">
          <PageTransition><ProjectDetail /></PageTransition>
        </Route>
        <Route path="/posts">
          <PageTransition><Posts /></PageTransition>
        </Route>
        <Route path="/posts/:slug">
          <PageTransition><PostDetail /></PageTransition>
        </Route>
        <Route path="/contact">
          <PageTransition><Contact /></PageTransition>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
          <Navigation />
          <main className="flex-grow relative z-10">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
