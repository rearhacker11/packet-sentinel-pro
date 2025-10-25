import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface PacketLog {
  id: string;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  port: number;
  protocol: string;
  action: string;
  packet_size: number;
  is_suspicious: boolean;
}

const Logs = () => {
  const [logs, setLogs] = useState<PacketLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchLogs();
  }, []);

  const checkAuthAndFetchLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLogs();
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("packet_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Failed to fetch logs");
    } else {
      setLogs(data || []);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.source_ip.includes(searchTerm) ||
    log.destination_ip.includes(searchTerm) ||
    log.protocol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Packet Logs
            </h1>
          </div>
        </div>

        <Card className="mb-6 border-primary/20 bg-card/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by IP or protocol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-primary/20"
                />
              </div>
              <Button variant="outline" className="border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <Card 
              key={log.id} 
              className={`border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40 transition-colors ${
                log.is_suspicious ? "border-l-4 border-l-destructive" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">{format(new Date(log.timestamp), "HH:mm:ss")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Source IP:</span>
                      <p className="font-medium text-primary">{log.source_ip}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Destination IP:</span>
                      <p className="font-medium text-secondary">{log.destination_ip}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Port:</span>
                      <p className="font-medium">{log.port}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Protocol:</span>
                      <p className="font-medium uppercase">{log.protocol}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action:</span>
                      <p className={`font-medium ${
                        log.action === "blocked" ? "text-destructive" : "text-primary"
                      }`}>
                        {log.action.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {log.is_suspicious && (
                    <span className="px-3 py-1 rounded bg-destructive/20 text-destructive text-xs font-medium">
                      SUSPICIOUS
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <Card className="border-primary/20 bg-card/95 backdrop-blur">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No logs found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Logs;