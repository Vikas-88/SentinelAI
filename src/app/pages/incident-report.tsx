import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  FileText,
  Download,
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Database,
  Target,
  Zap,
  CheckCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function IncidentReport() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020817",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;
      let y = 0;

      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -y, pageW, imgH);
        y += pageH;
      }

      pdf.save(`SentinelAI_Incident_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };
  const reportData = {
    id: "INC-2026-05-23-0847",
    date: "May 23, 2026 08:47:32 UTC",
    severity: "Critical",
    status: "Contained",
    type: "Advanced Persistent Threat (APT)",
    duration: "2h 34m",
    affectedSystems: 12,
    threatsBlocked: 247,
  };

  const timeline = [
    { 
      time: "08:47:32", 
      event: "Initial Detection", 
      description: "Suspicious network activity detected from IP 185.220.101.45",
      status: "detected",
      severity: "high"
    },
    { 
      time: "08:47:35", 
      event: "AI Analysis Started", 
      description: "Machine learning models initiated threat classification",
      status: "processing",
      severity: "info"
    },
    { 
      time: "08:48:12", 
      event: "Threat Classified", 
      description: "Identified as Advanced Persistent Threat targeting database servers",
      status: "identified",
      severity: "critical"
    },
    { 
      time: "08:48:15", 
      event: "Auto-Response Activated", 
      description: "Firewall rules updated, suspicious IP blocked",
      status: "responding",
      severity: "info"
    },
    { 
      time: "08:49:22", 
      event: "Lateral Movement Detected", 
      description: "Attacker attempting to access multiple endpoints",
      status: "escalated",
      severity: "critical"
    },
    { 
      time: "08:50:01", 
      event: "Containment Initiated", 
      description: "Affected systems isolated from network",
      status: "containing",
      severity: "high"
    },
    { 
      time: "09:15:45", 
      event: "Malware Removed", 
      description: "All malicious payloads quarantined and removed",
      status: "cleaning",
      severity: "info"
    },
    { 
      time: "10:32:18", 
      event: "Systems Restored", 
      description: "All affected systems back online with enhanced monitoring",
      status: "recovered",
      severity: "success"
    },
    { 
      time: "11:21:09", 
      event: "Incident Resolved", 
      description: "Threat neutralized, systems secure, continuous monitoring active",
      status: "resolved",
      severity: "success"
    },
  ];

  const affectedAssets = [
    { name: "DB-PROD-01", type: "Database Server", status: "Restored", impact: "High" },
    { name: "WEB-APP-03", type: "Web Application", status: "Restored", impact: "Medium" },
    { name: "API-GW-02", type: "API Gateway", status: "Restored", impact: "High" },
    { name: "FILE-SRV-05", type: "File Server", status: "Restored", impact: "Low" },
  ];

  const threatIndicators = [
    { indicator: "185.220.101.45", type: "IP Address", confidence: "High", source: "TOR Exit Node" },
    { indicator: "malware_payload.exe", type: "File Hash", confidence: "Critical", source: "Known APT28 Tool" },
    { indicator: "apt-backdoor.dll", type: "Process", confidence: "Critical", source: "Persistence Mechanism" },
    { indicator: "Command & Control Server", type: "Domain", confidence: "High", source: "c2.darkweb[.]onion" },
  ];

  const recommendations = [
    "Update all database server security patches within 24 hours",
    "Implement network segmentation to prevent lateral movement",
    "Enable multi-factor authentication on all administrative accounts",
    "Conduct security awareness training focusing on APT tactics",
    "Review and update incident response procedures",
    "Deploy additional network monitoring on critical assets",
  ];

  return (
    <div className="space-y-6">
      {/* Header — outside the PDF capture area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">Incident Report</h1>
          <p className="text-gray-400 font-rajdhani">AI-Generated Security Incident Analysis</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani">
            <FileText className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

    <div ref={reportRef} className="space-y-6">

      {/* Report Header Card */}
      <Card className="glass-strong p-8 border-[#00f0ff]/30">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#ff0055]/20 to-[#8b5cf6]/20 border border-[#ff0055]/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#ff0055] cyber-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-orbitron font-bold neon-text-red mb-1">Critical Security Incident</h2>
              <p className="text-gray-400 font-rajdhani">Incident ID: {reportData.id}</p>
            </div>
          </div>
          <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 text-lg px-4 py-2 font-rajdhani">
            {reportData.status}
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs text-gray-400 font-rajdhani">Detection Time</span>
            </div>
            <div className="text-lg font-orbitron text-white">{reportData.date}</div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#ff0055]" />
              <span className="text-xs text-gray-400 font-rajdhani">Severity Level</span>
            </div>
            <div className="text-lg font-orbitron text-[#ff0055]">{reportData.severity}</div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-xs text-gray-400 font-rajdhani">Threat Type</span>
            </div>
            <div className="text-sm font-orbitron text-[#8b5cf6]">{reportData.type}</div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs text-gray-400 font-rajdhani">Duration</span>
            </div>
            <div className="text-lg font-orbitron text-[#00f0ff]">{reportData.duration}</div>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-2xl font-orbitron mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#00f0ff]" />
          Executive Summary
        </h3>
        <div className="glass-card p-6 rounded-lg border-l-4 border-l-[#00f0ff]">
          <p className="text-gray-300 font-rajdhani leading-relaxed mb-4">
            On May 23, 2026 at 08:47:32 UTC, SentinelAI's threat detection system identified suspicious network activity 
            originating from a known TOR exit node (IP: 185.220.101.45). The AI-powered analysis engine immediately classified 
            this as an Advanced Persistent Threat (APT) campaign targeting our database infrastructure.
          </p>
          <p className="text-gray-300 font-rajdhani leading-relaxed mb-4">
            The attacker deployed sophisticated malware associated with the APT28 group, attempting to establish persistence 
            and exfiltrate sensitive data. Our automated response system activated within 3 seconds, blocking the malicious 
            IP and isolating affected systems. The threat was fully contained within 2 hours and 34 minutes.
          </p>
          <p className="text-gray-300 font-rajdhani leading-relaxed">
            <strong className="text-white">Impact:</strong> 12 systems were temporarily affected but no data was exfiltrated. 
            All systems have been restored to full operational status with enhanced security measures. A total of 247 malicious 
            connection attempts were blocked during the incident.
          </p>
        </div>
      </Card>

      {/* Impact Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="glass-card p-6 border-[#ff0055]/30">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-[#ff0055]" />
            <h3 className="text-xl font-orbitron">Affected Systems</h3>
          </div>
          <div className="text-5xl font-orbitron font-bold text-[#ff0055] mb-2">{reportData.affectedSystems}</div>
          <p className="text-sm text-gray-400 font-rajdhani">All systems restored</p>
        </Card>

        <Card className="glass-card p-6 border-[#00f0ff]/30">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#00f0ff]" />
            <h3 className="text-xl font-orbitron">Threats Blocked</h3>
          </div>
          <div className="text-5xl font-orbitron font-bold text-[#00f0ff] mb-2">{reportData.threatsBlocked}</div>
          <p className="text-sm text-gray-400 font-rajdhani">Attack attempts prevented</p>
        </Card>

        <Card className="glass-card p-6 border-[#00ff88]/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-[#00ff88]" />
            <h3 className="text-xl font-orbitron">Data Protected</h3>
          </div>
          <div className="text-5xl font-orbitron font-bold text-[#00ff88] mb-2">100%</div>
          <p className="text-sm text-gray-400 font-rajdhani">Zero data exfiltration</p>
        </Card>
      </div>

      {/* Incident Timeline */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-2xl font-orbitron mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#00f0ff]" />
          Incident Timeline
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff0055] via-[#8b5cf6] to-[#00ff88]"></div>
          
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                <div 
                  className={`absolute left-3 w-6 h-6 rounded-full border-4 ${
                    item.severity === 'critical' ? 'bg-[#ff0055] border-[#020817]' :
                    item.severity === 'high' ? 'bg-[#ff6b00] border-[#020817]' :
                    item.severity === 'success' ? 'bg-[#00ff88] border-[#020817]' :
                    'bg-[#00f0ff] border-[#020817]'
                  }`}
                ></div>
                
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-[#00f0ff]">{item.time}</span>
                      <h4 className="font-orbitron text-white">{item.event}</h4>
                    </div>
                    <Badge 
                      className={`text-xs ${
                        item.severity === 'critical' ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' :
                        item.severity === 'high' ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30' :
                        item.severity === 'success' ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30' :
                        'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30'
                      } font-rajdhani`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 font-rajdhani">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Affected Assets */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-2xl font-orbitron mb-6">Affected Assets</h3>
        <div className="space-y-3">
          {affectedAssets.map((asset, index) => (
            <div key={index} className="glass-card p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center">
                  <Database className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <div>
                  <div className="font-orbitron text-white mb-1">{asset.name}</div>
                  <div className="text-sm text-gray-400 font-rajdhani">{asset.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${
                  asset.impact === 'High' ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' :
                  asset.impact === 'Medium' ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30' :
                  'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                } font-rajdhani`}>
                  {asset.impact} Impact
                </Badge>
                <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-rajdhani">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {asset.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Threat Indicators */}
      <Card className="glass-strong p-6 border-[#00f0ff]/30">
        <h3 className="text-2xl font-orbitron mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-[#ff0055]" />
          Indicators of Compromise (IOCs)
        </h3>
        <div className="space-y-3">
          {threatIndicators.map((indicator, index) => (
            <div key={index} className="glass-card p-4 rounded-lg border-l-4 border-l-[#ff0055]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#ff0055]" />
                  <span className="font-mono text-sm text-white">{indicator.indicator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30 text-xs font-rajdhani">
                    {indicator.type}
                  </Badge>
                  <Badge className={`text-xs font-rajdhani ${
                    indicator.confidence === 'Critical' 
                      ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30'
                      : 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30'
                  }`}>
                    {indicator.confidence} Confidence
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-rajdhani pl-7">Source: {indicator.source}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="glass-strong p-6 border-[#00ff88]/30">
        <h3 className="text-2xl font-orbitron mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#00ff88]" />
          AI-Generated Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 glass-card p-4 rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-orbitron text-[#00ff88]">{index + 1}</span>
              </div>
              <p className="text-sm font-rajdhani text-gray-300">{rec}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between glass-card p-6 rounded-lg border border-[#00f0ff]/30">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-[#00f0ff]" />
          <div>
            <p className="text-sm font-rajdhani text-gray-300">Report generated by SentinelAI on {reportData.date}</p>
            <p className="text-xs text-gray-500 font-rajdhani">Classification: Confidential - Internal Use Only</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani">
            Share Report
          </Button>
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloading ? "Generating..." : "Download Full Report"}
          </Button>
        </div>
      </div>
    </div>{/* end reportRef */}
    </div>
  );
}
