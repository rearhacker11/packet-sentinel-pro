import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface FirewallRule {
  id: string;
  name: string;
  rule_type: string;
  source_ip: string;
  destination_ip: string;
  port: string;
  protocol: string;
  priority: number;
  is_enabled: boolean;
  description: string;
}

const Rules = () => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rule_type: "block",
    source_ip: "",
    destination_ip: "",
    port: "",
    protocol: "tcp",
    priority: 100,
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchRules();
  }, []);

  const checkAuthAndFetchRules = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchRules();
  };

  const fetchRules = async () => {
    const { data, error } = await supabase
      .from("firewall_rules")
      .select("*")
      .order("priority", { ascending: true });

    if (error) {
      toast.error("Failed to fetch rules");
    } else {
      setRules(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("firewall_rules").insert([
      { ...formData, user_id: user.id }
    ]);

    if (error) {
      toast.error("Failed to create rule");
    } else {
      toast.success("Rule created successfully");
      setShowForm(false);
      setFormData({
        name: "",
        rule_type: "block",
        source_ip: "",
        destination_ip: "",
        port: "",
        protocol: "tcp",
        priority: 100,
        description: "",
      });
      fetchRules();
    }
  };

  const toggleRule = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("firewall_rules")
      .update({ is_enabled: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update rule");
    } else {
      toast.success("Rule updated");
      fetchRules();
    }
  };

  const deleteRule = async (id: string) => {
    const { error } = await supabase.from("firewall_rules").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete rule");
    } else {
      toast.success("Rule deleted");
      fetchRules();
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
              Firewall Rules
            </h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 cyber-glow">
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-primary/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Create New Rule</CardTitle>
              <CardDescription>Define a new firewall rule</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rule_type">Rule Type</Label>
                    <Select value={formData.rule_type} onValueChange={(value) => setFormData({ ...formData, rule_type: value })}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source_ip">Source IP</Label>
                    <Input
                      id="source_ip"
                      placeholder="192.168.1.1 or any"
                      value={formData.source_ip}
                      onChange={(e) => setFormData({ ...formData, source_ip: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination_ip">Destination IP</Label>
                    <Input
                      id="destination_ip"
                      placeholder="192.168.1.1 or any"
                      value={formData.destination_ip}
                      onChange={(e) => setFormData({ ...formData, destination_ip: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="80, 443, 1-1024"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Protocol</Label>
                    <Select value={formData.protocol} onValueChange={(value) => setFormData({ ...formData, protocol: value })}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="icmp">ICMP</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Create Rule</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-primary">{rule.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rule.rule_type === "block" 
                          ? "bg-destructive/20 text-destructive" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        {rule.rule_type.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-secondary/20 text-secondary">
                        {rule.protocol.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span>Source: {rule.source_ip || "any"}</span>
                      <span>Destination: {rule.destination_ip || "any"}</span>
                      <span>Port: {rule.port || "any"}</span>
                      <span>Priority: {rule.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={rule.is_enabled}
                      onCheckedChange={() => toggleRule(rule.id, rule.is_enabled)}
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;