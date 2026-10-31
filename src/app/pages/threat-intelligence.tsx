import { motion } from "motion/react";
import { 
  Globe, 
  Activity, 
  TrendingUp,
  AlertTriangle,
  Shield,
  Zap,
  Database,
  Map
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { useState, useEffect } from "react";

export default function ThreatIntelligence() {
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveThreats(prev => (prev < 1247 ? prev + 13 : 1247));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const globalAttackData = [
    { country: "United States", attacks: 450, color: "#00f0ff" },
    { country: "China", attacks: 380, color: "#0066ff" },
    { country: "Russia", attacks: 320, color: "#8b5cf6" },
    { country: "North Korea", attacks: 180, color: "#ff0055" },
    { country: "Iran", attacks: 150, color: "#ff6b00" },
    { country: "Brazil", attacks: 120, color: "#00ff88" },
  ];

  const hourlyActivity = [
    { hour: "00:00", attacks: 120, blocked: 118 },
    { hour: "04:00", attacks: 95, blocked: 93 },
    { hour: "08:00", attacks: 180, blocked: 178 },
    { hour: "12:00", attacks: 220, blocked: 217 },
    { hour: "16:00", attacks: 190, blocked: 188 },
    { hour: "20:00", attacks: 160, blocked: 158 },
  ];

  const threatCategories = [
    { name: "Phishing", value: 35, color: "#ff0055", count: 437 },
    { name: "Malware", value: 28, color: "#8b5cf6", count: 349 },
    { name: "DDoS", value: 20, color: "#00f0ff", count: 249 },
    { name: "Ransomware", value: 12, color: "#ff6b00", count: 149 },
    { name: "Zero-Day", value: 5, color: "#0066ff", count: 63 },
  ];

  const liveAttacks = [
    { id: 1, type: "Phishing", source: "Russia", target: "US - Financial", time: "Just now", severity: "high" },
    { id: 2, type: "Malware", source: "China", target: "EU - Healthcare", time: "3 sec ago", severity: "critical" },
    { id: 3, type: "DDoS", source: "N. Korea", target: "JP - Technology", time: "8 sec ago", severity: "high" },
    { id: 4, type: "Ransomware", source: "Unknown", target: "AU - Government", time: "12 sec ago", severity: "critical" },
    { id: 5, type: "Phishing", source: "Brazil", target: "CA - Retail", time: "15 sec ago", severity: "medium" },
    { id: 6, type: "Zero-Day", source: "Iran", target: "UK - Energy", time: "18 sec ago", severity: "critical" },
  ];

  const topTargets = [
    { sector: "Financial Services", attacks: 523, trend: "+12%" },
    { sector: "Healthcare", attacks: 445, trend: "+8%" },
    { sector: "Technology", attacks: 398, trend: "+15%" },
    { sector: "Government", attacks: 312, trend: "+5%" },
    { sector: "Retail", attacks: 289, trend: "+9%" },
    { sector: "Energy", attacks: 234, trend: "+18%" },
  ];

  const weeklyTrend = [
    { day: "Mon", threats: 1100 },
    { day: "Tue", threats: 1250 },
    { day: "Wed", threats: 1180 },
    { day: "Thu", threats: 1320 },
    { day: "Fri", threats: 1450 },
    { day: "Sat", threats: 980 },
    { day: "Sun", threats: 850 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">Threat Intelligence</h1>
          <p className="text-gray-400 font-rajdhani">Global cyber threat monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00ff88] cyber-pulse"></div>
          <span className="text-sm font-rajdhani text-gray-400">Live Data Stream</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6 border-[#ff0055]/30 hover:border-[#ff0055]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#ff0055]/20 border border-[#ff0055]/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#ff0055] cyber-pulse" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#ff0055]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#ff0055] mb-1">{activeThreats.toLocaleString()}</div>
            <div className="text-sm text-gray-400 font-rajdhani">Active Threats (24h)</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6 border-[#00f0ff]/30 hover:border-[#00f0ff]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#00f0ff]" />
              </div>
              <Activity className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#00f0ff] mb-1">195</div>
            <div className="text-sm text-gray-400 font-rajdhani">Countries Monitored</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card p-6 border-[#00ff88]/30 hover:border-[#00ff88]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00ff88]" />
              </div>
              <Zap className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#00ff88] mb-1">99.2%</div>
            <div className="text-sm text-gray-400 font-rajdhani">Blocked Successfully</div>
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
                <Database className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div className="text-3xl font-orbitron font-bold text-[#8b5cf6] mb-1">2.4M</div>
            <div className="text-sm text-gray-400 font-rajdhani">Threat Signatures</div>
          </Card>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Global Attack Map Visualization */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30 col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Map className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="text-xl font-orbitron">Global Attack Sources</h3>
          </div>
          
          {/* Simulated World Map */}
          <div className="relative h-80 bg-gradient-to-b from-[#0a0f1e] to-[#020817] rounded-lg border border-[#00f0ff]/20 overflow-hidden mb-4">
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            {/* Attack markers */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-[#ff0055]"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#ff0055] animate-ping"></div>
              </motion.div>
            ))}
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke="#00f0ff"
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </svg>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={globalAttackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="country" stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 15, 30, 0.9)', 
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '8px',
                  fontFamily: 'Rajdhani'
                }}
              />
              <Bar dataKey="attacks" fill="#00f0ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Live Attack Feed */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-orbitron">Live Feed</h3>
            <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani cyber-pulse">
              Live
            </Badge>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {liveAttacks.map((attack) => (
              <motion.div
                key={attack.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-card p-3 rounded-lg border-l-4 ${
                  attack.severity === 'critical' 
                    ? 'border-l-[#ff0055]' 
                    : attack.severity === 'high'
                    ? 'border-l-[#ff6b00]'
                    : 'border-l-[#8b5cf6]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    className={`text-xs ${
                      attack.severity === 'critical' 
                        ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' 
                        : attack.severity === 'high'
                        ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30'
                        : 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                    } font-rajdhani`}
                  >
                    {attack.type}
                  </Badge>
                  <span className="text-xs text-gray-400 font-rajdhani">{attack.time}</span>
                </div>
                <div className="text-xs text-gray-300 font-rajdhani">
                  <span className="text-[#ff0055]">{attack.source}</span> → <span className="text-[#00f0ff]">{attack.target}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Threat Categories and Hourly Activity */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <h3 className="text-xl font-orbitron mb-6">Threat Categories</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={threatCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatCategories.map((entry, index) => (
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
            <div className="flex-1 space-y-3">
              {threatCategories.map((cat) => (
                <div key={cat.name} className="glass-card p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-sm font-rajdhani">{cat.name}</span>
                    </div>
                    <span className="text-sm font-orbitron" style={{ color: cat.color }}>{cat.count}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-rajdhani">{cat.value}% of total</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <h3 className="text-xl font-orbitron mb-6">Attack vs Defense (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyActivity}>
              <defs>
                <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0055" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff0055" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="hour" stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 15, 30, 0.9)', 
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '8px',
                  fontFamily: 'Rajdhani'
                }}
              />
              <Area type="monotone" dataKey="attacks" stroke="#ff0055" strokeWidth={2} fillOpacity={1} fill="url(#colorAttacks)" />
              <Area type="monotone" dataKey="blocked" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff0055]"></div>
              <span className="text-xs font-rajdhani text-gray-400">Attacks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
              <span className="text-xs font-rajdhani text-gray-400">Blocked</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Targeted Sectors */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-xl font-orbitron mb-6">Top Targeted Sectors</h3>
        <div className="grid grid-cols-3 gap-4">
          {topTargets.map((target, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-rajdhani text-sm text-gray-300">{target.sector}</span>
                <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">
                  {target.trend}
                </Badge>
              </div>
              <div className="text-2xl font-orbitron text-[#00f0ff]">{target.attacks}</div>
              <div className="text-xs text-gray-500 font-rajdhani">attacks detected</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weekly Trend */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-xl font-orbitron mb-6">Weekly Threat Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
            <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontFamily: 'Rajdhani' }} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(10, 15, 30, 0.9)', 
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '8px',
                fontFamily: 'Rajdhani'
              }}
            />
            <Line type="monotone" dataKey="threats" stroke="#00f0ff" strokeWidth={3} dot={{ fill: '#00f0ff', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
