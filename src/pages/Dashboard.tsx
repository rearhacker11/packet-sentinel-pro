import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, AlertTriangle, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRules: 0,
    activeRules: 0,
    blockedPackets: 0,
    alerts: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await fetchStats(user.id);
    setLoading(false);
  };

  const fetchStats = async (userId: string) => {
    const [rulesData, logsData, alertsData] = await Promise.all([
      supabase.from("firewall_rules").select("*", { count: "exact" }).eq("user_id", userId),
      supabase.from("packet_logs").select("*", { count: "exact" }).eq("user_id", userId).eq("action", "blocked"),
      supabase.from("alerts").select("*", { count: "exact" }).eq("user_id", userId).eq("is_read", false),
    ]);

    const activeRules = rulesData.data?.filter(r => r.is_enabled).length || 0;

    setStats({
      totalRules: rulesData.count || 0,
      activeRules,
      blockedPackets: logsData.count || 0,
      alerts: alertsData.count || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FirewallX Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 bg-card/95 backdrop-blur cyber-glow hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalRules}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeRules} active</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-card/95 backdrop-blur cyber-glow-blue hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blocked Packets</CardTitle>
              <Activity className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.blockedPackets}</div>
              <p className="text-xs text-muted-foreground mt-1">Total blocked</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-card/95 backdrop-blur hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.alerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Unread alerts</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/95 backdrop-blur hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Settings className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">Active</div>
              <p className="text-xs text-muted-foreground mt-1">Firewall running</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Firewall Rules
              </CardTitle>
              <CardDescription>Manage your firewall rules and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/rules")} className="w-full bg-primary hover:bg-primary/90 cyber-glow">
                Manage Rules
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                Packet Logs
              </CardTitle>
              <CardDescription>View and analyze network traffic logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/logs")} className="w-full bg-secondary hover:bg-secondary/90 cyber-glow-blue">
                View Logs
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Security Alerts
              </CardTitle>
              <CardDescription>Monitor security threats and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/alerts")} variant="destructive" className="w-full">
                View Alerts
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" />
                Settings
              </CardTitle>
              <CardDescription>Configure firewall settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/settings")} variant="outline" className="w-full border-accent/50">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;