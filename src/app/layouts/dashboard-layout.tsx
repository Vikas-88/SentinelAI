import { Outlet, Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  Globe,
  FileText,
  Bell,
  Settings,
  User,
  Activity,
  Search,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "motion/react";

type Severity = "critical" | "high" | "medium" | "info";

interface Notification {
  id: string;
  severity: Severity;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [];

const severityConfig: Record<Severity, { color: string; bg: string; border: string; Icon: React.FC<{ className?: string }> }> = {
  critical: { color: "text-[#ff0055]", bg: "bg-[#ff0055]/15", border: "border-[#ff0055]/40", Icon: AlertCircle },
  high:     { color: "text-[#ff6b00]", bg: "bg-[#ff6b00]/15", border: "border-[#ff6b00]/40", Icon: AlertTriangle },
  medium:   { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]/40", Icon: AlertTriangle },
  info:     { color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/30", Icon: Info },
};

function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications(ns => ns.filter(n => n.id !== id));
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  const visible = filter === "unread" ? notifications.filter(n => !n.read) : notifications;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={`relative hover:bg-[#00f0ff]/10 transition-all ${open ? "bg-[#00f0ff]/15" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className={`w-5 h-5 transition-all ${open ? "text-[#00f0ff] scale-110" : "text-gray-300"}`} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-[#ff0055] rounded-full flex items-center justify-center text-[9px] font-orbitron text-white cyber-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-[420px] glass-strong border border-[#00f0ff]/30 rounded-xl shadow-[0_8px_32px_rgba(0,240,255,0.15)] z-[100] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b border-[#00f0ff]/20 flex items-center justify-between">
            <div>
              <h3 className="font-orbitron text-sm text-white">Notification Centre</h3>
              <p className="text-xs text-gray-400 font-rajdhani mt-0.5">{unread} unread alert{unread !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#00f0ff] font-rajdhani hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 font-rajdhani hover:text-gray-300 flex items-center gap-1 ml-2"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex px-5 pt-3 gap-4 border-b border-[#00f0ff]/10 pb-0">
            {(["all", "unread"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`pb-2 text-xs font-rajdhani uppercase tracking-wider border-b-2 transition-colors ${
                  filter === tab
                    ? "border-[#00f0ff] text-[#00f0ff]"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "all" ? `All (${notifications.length})` : `Unread (${unread})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[420px] divide-y divide-[#00f0ff]/10">
            {visible.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-gray-500">
                <CheckCircle className="w-8 h-8 text-[#00ff88]/40" />
                <p className="font-rajdhani text-sm">
                  {filter === "unread" ? "No unread notifications" : "All clear — no alerts"}
                </p>
              </div>
            ) : (
              visible.map(n => {
                const cfg = severityConfig[n.severity];
                const Icon = cfg.Icon;
                return (
                  <div
                    key={n.id}
                    className={`relative px-5 py-4 flex gap-3 transition-colors hover:bg-white/[0.03] ${!n.read ? "bg-white/[0.02]" : ""}`}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                    )}

                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center mt-0.5`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-orbitron ${!n.read ? "text-white" : "text-gray-300"}`}>{n.title}</p>
                        <span className={`text-[10px] font-rajdhani uppercase px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} flex-shrink-0`}>{n.severity}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-rajdhani mt-1 leading-relaxed">{n.body}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-600 font-rajdhani">{n.time}</span>
                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="text-[10px] text-[#00f0ff] font-rajdhani hover:underline"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => dismiss(n.id)}
                            className="text-gray-600 hover:text-gray-300 transition-colors"
                            aria-label="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-[#00f0ff]/20 text-center">
              <button className="text-xs text-[#00f0ff] font-rajdhani hover:underline">
                View all in Incident Reports →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "URL Scanner", href: "/dashboard/url-scanner", icon: LinkIcon },
    { name: "Email Analyzer", href: "/dashboard/email-analyzer", icon: Mail },
    { name: "Threat Intel", href: "/dashboard/threat-intelligence", icon: Globe },
    { name: "Reports", href: "/dashboard/incident-report", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white dark flex">
      {/* Animated background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-[#020817] via-[#0a0f1e] to-[#020817] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-[#00f0ff]/20 fixed left-0 top-0 bottom-0 z-20 flex flex-col">
        <div className="p-6 border-b border-[#00f0ff]/20">
          <Link to="/" className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-[#00f0ff]" />
            <div>
              <span className="text-2xl font-orbitron neon-text block">SentinelAI</span>
              <span className="text-xs text-gray-400 font-rajdhani">Cyber Defense Platform</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} to={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-rajdhani transition-all ${
                    active
                      ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30"
                      : "hover:bg-[#00f0ff]/10 text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-2 h-2 rounded-full bg-[#00f0ff] cyber-pulse"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#00f0ff]/20">
          <div className="glass-card p-4 rounded-lg mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#00ff88]" />
              <span className="text-xs font-rajdhani text-gray-400">System Status</span>
            </div>
            <div className="text-sm font-orbitron text-[#00ff88]">All Systems Operational</div>
          </div>
          
          <Button variant="outline" className="w-full border-[#00f0ff]/30 text-gray-300 hover:bg-[#00f0ff]/10 font-rajdhani">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="glass-card border-b border-[#00f0ff]/20 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search threats, domains, IPs..."
                  className="pl-10 bg-[#0a0f1e] border-[#00f0ff]/30 focus:border-[#00f0ff] font-rajdhani"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationCenter />

              <div className="flex items-center gap-3 pl-4 border-l border-[#00f0ff]/20">
                <div className="text-right">
                  <div className="text-sm font-rajdhani">Security Admin</div>
                  <div className="text-xs text-gray-400">admin@sentinel.ai</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#8b5cf6] flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
