import { motion } from "motion/react";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  TrendingUp,
  Download,
  Zap,
  Globe,
  Lock,
  Eye,
  FileText,
  Terminal,
  Cpu,
  Database
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useState, useEffect } from "react";

export default function MainDashboard() {
  const [threatScore, setThreatScore] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Animate threat score
    const timer = setInterval(() => {
      setThreatScore(prev => (prev < 92 ? prev + 1 : 92));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate scan progress
    const timer = setInterval(() => {
      setScanProgress(prev => (prev < 100 ? prev + 2 : 0));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const threatData = [
    { time: "00:00", threats: 45 },
    { time: "04:00", threats: 78 },
    { time: "08:00", threats: 120 },
    { time: "12:00", threats: 95 },
    { time: "16:00", threats: 150 },
    { time: "20:00", threats: 110 },
    { time: "24:00", threats: 88 },
  ];

  const categoryData = [
    { name: "Phishing", value: 400, color: "#ff0055" },
    { name: "Malware", value: 300, color: "#8b5cf6" },
    { name: "DDoS", value: 200, color: "#00f0ff" },
    { name: "Ransomware", value: 100, color: "#0066ff" },
  ];

  const performanceData = [
    { category: "Detection", value: 95 },
    { category: "Response", value: 88 },
    { category: "Prevention", value: 92 },
    { category: "Analysis", value: 90 },
    { category: "Recovery", value: 85 },
  ];

  const liveAlerts = [
    { id: 1, type: "Critical", message: "Suspicious login attempt from Russia", time: "2 min ago", severity: "high" },
    { id: 2, type: "Warning", message: "Unusual network traffic detected", time: "5 min ago", severity: "medium" },
    { id: 3, type: "Info", message: "System backup completed successfully", time: "10 min ago", severity: "low" },
    { id: 4, type: "Critical", message: "Malware signature detected in email attachment", time: "15 min ago", severity: "high" },
    { id: 5, type: "Warning", message: "Multiple failed authentication attempts", time: "20 min ago", severity: "medium" },
  ];

  const recentScans = [
    { id: 1, target: "https://suspicious-site.com", result: "Blocked", threats: 5, time: "3 min ago" },
    { id: 2, target: "invoice-2024.pdf", result: "Clean", threats: 0, time: "8 min ago" },
    { id: 3, target: "https://phishing-attempt.net", result: "Blocked", threats: 12, time: "12 min ago" },
    { id: 4, target: "system-update.exe", result: "Quarantined", threats: 3, time: "18 min ago" },
  ];

  const terminalLogs = [
    "[00:42:15] AI Engine: Analyzing network packet stream...",
    "[00:42:16] Threat Detector: Suspicious pattern identified",
    "[00:42:17] Response System: Initiating containment protocol",
    "[00:42:18] Firewall: Blocking IP 185.220.101.45",
    "[00:42:19] AI Engine: Threat neutralized successfully",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">Command Center</h1>
          <p className="text-gray-400 font-rajdhani">Real-time threat monitoring and AI-powered defense</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani">
            <Eye className="w-4 h-4 mr-2" />
            Full Scan
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6 border-[#00ff88]/30 hover:border-[#00ff88]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00ff88]" />
              </div>
              <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-rajdhani">Active</Badge>
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#00ff88] mb-1">Protected</div>
            <div className="text-sm text-gray-400 font-rajdhani">All systems secure</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6 border-[#ff0055]/30 hover:border-[#ff0055]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#ff0055]/20 border border-[#ff0055]/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#ff0055] cyber-pulse" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#ff0055]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#ff0055] mb-1">247</div>
            <div className="text-sm text-gray-400 font-rajdhani">Threats blocked today</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card p-6 border-[#00f0ff]/30 hover:border-[#00f0ff]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#00f0ff]" />
              </div>
              <CheckCircle className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#00f0ff] mb-1">99.9%</div>
            <div className="text-sm text-gray-400 font-rajdhani">Detection accuracy</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-6 border-[#8b5cf6]/30 hover:border-[#8b5cf6]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <span className="text-xs text-gray-400 font-rajdhani">AVG</span>
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#8b5cf6] mb-1">&lt;1ms</div>
            <div className="text-sm text-gray-400 font-rajdhani">Response time</div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Threat Score Meter - Large */}
        <Card className="glass-strong p-8 border-[#00f0ff]/30 col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-orbitron">Security Score</h3>
            <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-rajdhani">Excellent</Badge>
          </div>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(0, 240, 255, 0.1)"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - threatScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-orbitron font-bold neon-text">{threatScore}</div>
              <div className="text-sm text-gray-400 font-rajdhani">/ 100</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-rajdhani">Firewall</span>
              <span className="text-[#00ff88] font-rajdhani">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-rajdhani">AI Protection</span>
              <span className="text-[#00ff88] font-rajdhani">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-rajdhani">Real-time Scan</span>
              <span className="text-[#00f0ff] font-rajdhani">Running</span>
            </div>
          </div>
        </Card>

        {/* Threat Activity Chart */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-orbitron">Threat Activity (24h)</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#00f0ff]"></div>
                <span className="text-xs text-gray-400 font-rajdhani">Detected</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 15, 30, 0.9)', 
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '8px',
                  fontFamily: 'Rajdhani'
                }}
              />
              <Area type="monotone" dataKey="threats" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Live Alerts */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-orbitron">Live Alerts</h3>
            <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani cyber-pulse">
              {liveAlerts.filter(a => a.severity === 'high').length} Critical
            </Badge>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {liveAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-card p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' 
                    ? 'border-l-[#ff0055]' 
                    : alert.severity === 'medium'
                    ? 'border-l-[#8b5cf6]'
                    : 'border-l-[#00f0ff]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    className={`${
                      alert.severity === 'high' 
                        ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' 
                        : alert.severity === 'medium'
                        ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                        : 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30'
                    } font-rajdhani`}
                  >
                    {alert.type}
                  </Badge>
                  <span className="text-xs text-gray-400 font-rajdhani">{alert.time}</span>
                </div>
                <p className="text-sm font-rajdhani text-gray-300">{alert.message}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Threat Categories */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <h3 className="text-xl font-orbitron mb-6">Threat Categories</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 15, 30, 0.9)', 
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '8px',
                    fontFamily: 'Rajdhani'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span className="text-sm font-rajdhani text-gray-300">{cat.name}</span>
                <span className="text-xs text-gray-500 ml-auto">{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Scans */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-orbitron">Recent Scans</h3>
            <Button variant="ghost" size="sm" className="text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div key={scan.id} className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scan.result === 'Clean' 
                      ? 'bg-[#00ff88]/20 border border-[#00ff88]/30' 
                      : scan.result === 'Blocked'
                      ? 'bg-[#ff0055]/20 border border-[#ff0055]/30'
                      : 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/30'
                  }`}>
                    {scan.result === 'Clean' ? (
                      <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#ff0055]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-rajdhani text-gray-300 truncate">{scan.target}</div>
                    <div className="text-xs text-gray-500 font-rajdhani">{scan.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${
                    scan.result === 'Clean' 
                      ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30' 
                      : scan.result === 'Blocked'
                      ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30'
                      : 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                  } font-rajdhani`}>
                    {scan.result}
                  </Badge>
                  {scan.threats > 0 && (
                    <span className="text-xs text-[#ff0055] font-rajdhani">{scan.threats} threats</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Terminal */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-[#00ff88]" />
            <h3 className="text-xl font-orbitron">AI Terminal</h3>
          </div>
          <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
            {terminalLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="mb-2 text-[#00ff88]"
              >
                {log}
              </motion.div>
            ))}
            <div className="flex items-center gap-1">
              <span className="text-[#00f0ff]">{'>'}</span>
              <span className="cyber-pulse">_</span>
            </div>
          </div>
        </Card>
      </div>

      {/* System Performance */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-xl font-orbitron mb-6">System Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={performanceData}>
            <PolarGrid stroke="rgba(0, 240, 255, 0.2)" />
            <PolarAngleAxis dataKey="category" stroke="#94a3b8" style={{ fontFamily: 'Rajdhani' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
            <Radar name="Performance" dataKey="value" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(10, 15, 30, 0.9)', 
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '8px',
                fontFamily: 'Rajdhani'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Active Scan Progress */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#00f0ff] cyber-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-orbitron">Active System Scan</h3>
              <p className="text-sm text-gray-400 font-rajdhani">Scanning endpoints and network traffic</p>
            </div>
          </div>
          <Badge className="bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30 font-rajdhani">In Progress</Badge>
        </div>
        <Progress value={scanProgress} className="h-3 mb-2" />
        <div className="flex justify-between text-sm font-rajdhani text-gray-400">
          <span>{scanProgress}% Complete</span>
          <span>ETA: {Math.max(0, Math.floor((100 - scanProgress) / 10))} min</span>
        </div>
      </Card>
    </div>
  );
}
