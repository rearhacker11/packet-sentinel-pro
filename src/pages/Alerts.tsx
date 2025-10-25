import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Alert {
  id: string;
  severity: string;
  title: string;
  description: string;
  timestamp: string;
  is_read: boolean;
  source_ip: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchAlerts();
  }, []);

  const checkAuthAndFetchAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchAlerts();
  };

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      toast.error("Failed to fetch alerts");
    } else {
      setAlerts(data || []);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update alert");
    } else {
      fetchAlerts();
    }
  };

  const deleteAlert = async (id: string) => {
    const { error } = await supabase.from("alerts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete alert");
    } else {
      toast.success("Alert deleted");
      fetchAlerts();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "high": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
      case "medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      case "low": return "text-primary border-primary/50 bg-primary/10";
      default: return "text-muted-foreground border-muted/50 bg-muted/10";
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Security Alerts
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`border-2 ${getSeverityColor(alert.severity)} backdrop-blur ${
                alert.is_read ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                        getSeverityColor(alert.severity)
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{alert.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span>Time: {format(new Date(alert.timestamp), "PPpp")}</span>
                      {alert.source_ip && <span>Source IP: {alert.source_ip}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.is_read && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => markAsRead(alert.id)}
                        className="border-primary/50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alerts.length === 0 && (
          <Card className="border-primary/20 bg-card/95 backdrop-blur">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts at this time</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Alerts;