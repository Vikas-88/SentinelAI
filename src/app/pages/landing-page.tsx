import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  Shield, 
  Zap, 
  Brain, 
  Globe, 
  Lock, 
  Activity, 
  AlertTriangle,
  Check,
  ArrowRight,
  Sparkles,
  Database,
  Network
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function LandingPage() {
  const stats = [
    { value: "99.9%", label: "Threat Detection", color: "text-[#00f0ff]" },
    { value: "24/7", label: "AI Monitoring", color: "text-[#8b5cf6]" },
    { value: "<1ms", label: "Response Time", color: "text-[#00ff88]" },
    { value: "500M+", label: "Threats Blocked", color: "text-[#ff0055]" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms detect threats before they strike",
      color: "#00f0ff"
    },
    {
      icon: Shield,
      title: "Real-Time Protection",
      description: "Continuous monitoring and instant threat neutralization",
      color: "#8b5cf6"
    },
    {
      icon: Activity,
      title: "Threat Intelligence",
      description: "Global threat database updated in real-time",
      color: "#0066ff"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Automated incident response and mitigation",
      color: "#00ff88"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Military-grade encryption and access control",
      color: "#ff0055"
    },
    {
      icon: Database,
      title: "Deep Analysis",
      description: "Forensic-level threat analysis and reporting",
      color: "#00f0ff"
    }
  ];

  const liveThreats = [
    { type: "Phishing", source: "Russia", target: "Financial Sector", status: "Blocked" },
    { type: "Malware", source: "China", target: "Healthcare", status: "Neutralized" },
    { type: "DDoS", source: "N. Korea", target: "Tech Industry", status: "Mitigated" },
    { type: "Ransomware", source: "Unknown", target: "Retail", status: "Blocked" },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white dark">
      {/* Animated background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#020817] via-[#0a0f1e] to-[#020817] pointer-events-none"></div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-[#00f0ff] rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#00f0ff]/20 glass-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-[#00f0ff]" />
              <span className="text-2xl font-orbitron neon-text">SentinelAI</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#features" className="hover:text-[#00f0ff] transition-colors">Features</a>
              <a href="#intelligence" className="hover:text-[#00f0ff] transition-colors">Intelligence</a>
              <a href="#contact" className="hover:text-[#00f0ff] transition-colors">Contact</a>
              <Link to="/dashboard">
                <Button className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 font-rajdhani">
                  Launch Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-sm font-rajdhani text-[#00f0ff]">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-7xl font-orbitron font-bold mb-6 neon-text">
              AI-Powered Cyber
              <br />
              Defense Platform
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-rajdhani">
              Military-grade cybersecurity powered by artificial intelligence.
              Detect, analyze, and neutralize threats in real-time before they impact your organization.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani text-lg px-8 py-6">
                  Start Protecting Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-24">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className={`text-5xl font-orbitron font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 font-rajdhani">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Threat Ticker */}
        <section className="bg-gradient-to-r from-[#ff0055]/20 to-[#8b5cf6]/20 border-y border-[#ff0055]/30 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 overflow-hidden">
              <AlertTriangle className="w-5 h-5 text-[#ff0055] flex-shrink-0 cyber-pulse" />
              <span className="font-orbitron text-sm text-[#ff0055] flex-shrink-0">LIVE THREATS:</span>
              <div className="flex gap-8 animate-[scroll_20s_linear_infinite]">
                {[...liveThreats, ...liveThreats].map((threat, i) => (
                  <span key={i} className="text-sm font-rajdhani flex-shrink-0">
                    {threat.type} from {threat.source} → {threat.target} - <span className="text-[#00ff88]">{threat.status}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-orbitron font-bold mb-4 neon-text-purple">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-400 font-rajdhani">
              Everything you need to defend against modern cyber threats
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card p-8 hover:border-[#00f0ff]/50 transition-all group cursor-pointer h-full">
                  <div 
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05)`,
                      border: `1px solid ${feature.color}40`
                    }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-3 group-hover:text-[#00f0ff] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-rajdhani">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Threat Map Preview */}
        <section id="intelligence" className="max-w-7xl mx-auto px-6 py-24">
          <div className="glass-strong rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-[#8b5cf6]/10"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-orbitron font-bold mb-4 neon-text">
                  Global Threat Intelligence
                </h2>
                <p className="text-xl text-gray-400 font-rajdhani">
                  Real-time monitoring of cyber threats worldwide
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-[#00f0ff]" />
                    <h3 className="text-xl font-orbitron">Active Monitoring</h3>
                  </div>
                  <p className="text-gray-400 font-rajdhani mb-4">
                    Our AI monitors 500+ million endpoints across 195 countries in real-time
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-rajdhani">Coverage</span>
                      <span className="text-[#00f0ff]">Global</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-rajdhani">Update Frequency</span>
                      <span className="text-[#00ff88]">Real-time</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Network className="w-6 h-6 text-[#8b5cf6]" />
                    <h3 className="text-xl font-orbitron">Threat Sources</h3>
                  </div>
                  <div className="space-y-3">
                    {["Phishing Attempts", "Malware Distribution", "DDoS Attacks", "Zero-Day Exploits"].map((threat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-sm font-rajdhani">{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="glass-strong rounded-2xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/20 via-[#8b5cf6]/20 to-[#ff0055]/20 gradient-shift"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-orbitron font-bold mb-6 neon-text">
                Ready to Secure Your Future?
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-rajdhani">
                Join thousands of organizations protected by SentinelAI
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 font-rajdhani text-lg px-12 py-6">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="border-t border-[#00f0ff]/20 glass-card mt-24">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-8 h-8 text-[#00f0ff]" />
                  <span className="text-xl font-orbitron neon-text">SentinelAI</span>
                </div>
                <p className="text-sm text-gray-400 font-rajdhani">
                  Next-generation AI-powered cybersecurity platform
                </p>
              </div>
              <div>
                <h4 className="font-orbitron mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-rajdhani">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-rajdhani">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-rajdhani">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#00f0ff]/20 pt-8 text-center text-sm text-gray-400 font-rajdhani">
              © 2026 SentinelAI. All rights reserved. Protecting organizations worldwide.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
