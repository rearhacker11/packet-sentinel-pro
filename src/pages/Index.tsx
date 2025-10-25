import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Lock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 cyber-glow animate-pulse-slow">
          <Shield className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          FirewallX
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
          Advanced Personal Firewall Management System
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Take control of your network security with real-time monitoring, intelligent rule management, and instant threat detection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button 
            onClick={() => navigate("/auth")} 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground cyber-glow text-lg px-8"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => navigate("/auth")} 
            size="lg"
            variant="outline"
            className="border-primary/50 text-lg px-8"
          >
            Sign In
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
            <Activity className="w-12 h-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-muted-foreground">Monitor network traffic and threats in real-time with our advanced dashboard</p>
          </div>

          <div className="p-6 rounded-lg border border-secondary/20 bg-card/50 backdrop-blur hover:border-secondary/40 transition-colors">
            <Lock className="w-12 h-12 text-secondary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Smart Rules</h3>
            <p className="text-muted-foreground">Create and manage intelligent firewall rules with priority control</p>
          </div>

          <div className="p-6 rounded-lg border border-accent/20 bg-card/50 backdrop-blur hover:border-accent/40 transition-colors">
            <Zap className="w-12 h-12 text-accent mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
            <p className="text-muted-foreground">Get notified of suspicious activity and security threats immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
