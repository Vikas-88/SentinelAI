import { motion } from "motion/react";
import { useRef, useState } from "react";
import { 
  Link as LinkIcon, 
  Search, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Clock,
  TrendingDown,
  FileText,
  ExternalLink,
  Zap,
  Database,
  Loader2
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";

const TRUSTED_DOMAINS = [
  "google.com", "youtube.com", "gmail.com", "googleapis.com",
  "github.com", "githubusercontent.com",
  "microsoft.com", "azure.com", "office.com", "live.com", "outlook.com",
  "apple.com", "icloud.com",
  "amazon.com", "aws.amazon.com", "cloudfront.net",
  "facebook.com", "instagram.com", "whatsapp.com", "meta.com",
  "twitter.com", "x.com",
  "linkedin.com",
  "wikipedia.org",
  "stackoverflow.com",
  "reddit.com",
  "cloudflare.com",
  "mozilla.org", "firefox.com",
  "openai.com", "anthropic.com",
  "npmjs.com", "nodejs.org",
  "python.org",
  "w3.org", "ietf.org",
];

const PHISHING_KEYWORDS = ["verify", "urgent", "suspended", "login-secure", "account-alert", "banking-verify", "paypal-", "apple-id", "amazon-verify"];
const SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".pw", ".top", ".click"];

type ScanResult = {
  safe: boolean; threatLevel: number; hostname: string; hasHttps: boolean;
  domainInfo: { domain: string; ip: string; country: string; registrar: string; created: string; reputation: string };
  indicators: { name: string; severity: string; description: string }[]; tags: string[];
  pageAnalysis?: { title: string; contentCategory: string; contentSummary: string; extractedTextLength: number; phishingPrediction: string; phishingConfidence: number | null; contentConfidence: number | null; analysisMode: string; fetchStatus: string };
  childSafety?: { rating: string; explanation: string; confidence: number | null };
};

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadReport = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020817",
        logging: false,
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
      const safeDomain = (result?.hostname ?? "url").replace(/[^a-z0-9]/gi, "_");
      pdf.save(`SentinelAI_URL_Report_${safeDomain}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleScan = async () => {
    const submittedUrl = url.trim();
    if (!submittedUrl || scanning) return;
    setScanning(true);
    setScanned(false);
    setScanProgress(10);
    setScanError("");
    setResult(null);
    const progressTimer = window.setInterval(() => setScanProgress((prev) => Math.min(prev + 7, 90)), 450);
    try {
      const apiBase = (import.meta as any).env?.VITE_SENTINEL_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiBase}/api/scan/url`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: submittedUrl }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || `Scanner API returned HTTP ${response.status}`);
      setScanProgress(100);
      setResult(payload as ScanResult);
      setScanned(true);
    } catch (error) {
      setScanError(error instanceof Error ? `${error.message}. Check that the SentinelAI FastAPI backend is running.` : "Unable to connect to the scanning backend.");
    } finally {
      window.clearInterval(progressTimer);
      setScanning(false);
    }
  };

  const threatLevel = result?.threatLevel ?? 0;
  const suspiciousIndicators = result?.indicators ?? [];
  const domainInfo = result?.domainInfo ?? { domain: "", ip: "", country: "", registrar: "", created: "", reputation: "" };
  const isSafe = result?.safe ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">URL Scanner</h1>
        <p className="text-gray-400 font-rajdhani">AI-powered phishing and malicious URL detection</p>
      </div>

      {/* URL Input Section */}
      <Card className="glass-strong p-8 border-[#00f0ff]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <div>
            <h2 className="text-2xl font-orbitron">Scan URL</h2>
            <p className="text-sm text-gray-400 font-rajdhani">Enter a URL to analyze for threats</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 h-14 bg-[#0a0f1e] border-[#00f0ff]/30 focus:border-[#00f0ff] font-rajdhani text-lg"
            />
          </div>
          <Button 
            onClick={handleScan}
            disabled={scanning || !url}
            size="lg"
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani px-8"
          >
            <Search className="w-5 h-5 mr-2" />
            Scan URL
          </Button>
        </div>

        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-rajdhani text-gray-400">Analyzing URL...</span>
              <span className="text-sm font-rajdhani text-[#00f0ff]">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
            <div className="mt-2 text-xs text-gray-500 font-rajdhani">
              {scanProgress < 30 && "Checking DNS records..."}
              {scanProgress >= 30 && scanProgress < 60 && "Analyzing SSL certificate..."}
              {scanProgress >= 60 && scanProgress < 90 && "Scanning for malicious content..."}
              {scanProgress >= 90 && "Running AI threat analysis..."}
            </div>
          </motion.div>
        )}
      </Card>

      {scanError && (
        <Card className="glass-strong p-5 border-[#ff0055]/40">
          <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-[#ff0055] mt-0.5" />
            <div><h3 className="font-orbitron text-[#ff0055] mb-1">Scan could not be completed</h3><p className="text-sm text-gray-300 font-rajdhani">{scanError}</p></div>
          </div>
        </Card>
      )}

      {/* Scan Results */}
      {scanned && result && (
        <motion.div
          ref={reportRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Threat Level Card */}
          <div className="grid grid-cols-3 gap-6">
            <Card className={`glass-strong p-6 col-span-1 ${isSafe ? "border-[#00ff88]/30" : "border-[#ff0055]/30"}`}>
              <h3 className="text-lg font-orbitron mb-4">Threat Level</h3>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={isSafe ? "rgba(0,255,136,0.1)" : "rgba(255, 0, 85, 0.1)"}
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={isSafe ? "#00ff88" : "#ff0055"}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - Math.max(threatLevel, isSafe ? 2 : 10) / 100)}
                    className="cyber-glow"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-4xl font-orbitron font-bold ${isSafe ? "text-[#00ff88]" : "text-[#ff0055]"}`}>{threatLevel}</div>
                  <div className="text-xs text-gray-400 font-rajdhani">/ 100</div>
                </div>
              </div>
              {isSafe ? (
                <Badge className="w-full justify-center bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-rajdhani">
                  SAFE — GENUINE URL
                </Badge>
              ) : (
                <Badge className="w-full justify-center bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani">
                  {threatLevel >= 60 ? "HIGH RISK — DO NOT VISIT" : "MODERATE RISK — USE CAUTION"}
                </Badge>
              )}
            </Card>

            <Card className="glass-strong p-6 border-[#00f0ff]/30 col-span-2">
              <h3 className="text-lg font-orbitron mb-4">AI Analysis Summary</h3>
              <div className="space-y-4">
                {isSafe ? (
                  <div className="glass-card p-4 rounded-lg border-l-4 border-l-[#00ff88]">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-orbitron text-[#00ff88] mb-2">URL Verified — No Threats Detected</h4>
                        <p className="text-sm text-gray-300 font-rajdhani mb-3">
                          This URL belongs to a known, verified domain with a strong trust record. No phishing signals, malicious redirects,
                          or blacklist matches were found. HTTPS encryption is active and the certificate is valid.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(result.tags ?? []).map(tag => (
                            <Badge key={tag} className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 text-xs font-rajdhani">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-4 rounded-lg border-l-4 border-l-[#ff0055]">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#ff0055] flex-shrink-0 mt-1 cyber-pulse" />
                      <div>
                        <h4 className="font-orbitron text-[#ff0055] mb-2">Threat Signals Detected</h4>
                        <p className="text-sm text-gray-300 font-rajdhani mb-3">
                          This URL exhibits one or more characteristics associated with phishing or malicious activity.
                          AI analysis flagged {suspiciousIndicators.length} indicator{suspiciousIndicators.length !== 1 ? "s" : ""} that warrant caution before visiting.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(result.tags ?? []).map(tag => (
                            <Badge key={tag} className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className={`w-4 h-4 ${isSafe ? "text-[#00ff88]" : "text-[#ff0055]"}`} />
                      <span className="text-xs text-gray-400 font-rajdhani">Security</span>
                    </div>
                    <div className={`text-lg font-orbitron ${isSafe ? "text-[#00ff88]" : "text-[#ff0055]"}`}>{isSafe ? "Safe" : "Unsafe"}</div>
                  </div>
                  <div className="glass-card p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className={`w-4 h-4 ${isSafe ? "text-[#00ff88]" : "text-[#ff0055]"}`} />
                      <span className="text-xs text-gray-400 font-rajdhani">Trust Score</span>
                    </div>
                    <div className={`text-lg font-orbitron ${isSafe ? "text-[#00ff88]" : "text-[#ff0055]"}`}>{isSafe ? "98/100" : `${100 - threatLevel}/100`}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Domain Information */}
          <Card className="glass-strong p-6 border-[#00f0ff]/30">
            <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00f0ff]" />
              Domain Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">Domain</div>
                <div className="text-sm font-rajdhani text-gray-200">{domainInfo.domain}</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">IP Address</div>
                <div className="text-sm font-rajdhani text-gray-200">{domainInfo.ip}</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">Location</div>
                <div className="text-sm font-rajdhani text-[#ff0055]">{domainInfo.country}</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">Registrar</div>
                <div className="text-sm font-rajdhani text-gray-200">{domainInfo.registrar}</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">Domain Age</div>
                <div className="text-sm font-rajdhani text-[#ff0055]">{domainInfo.created}</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-xs text-gray-400 font-rajdhani mb-1">Reputation</div>
                <div className="text-sm font-rajdhani text-[#ff0055]">{domainInfo.reputation}</div>
              </div>
            </div>
          </Card>

          {/* Website Content & Child Safety */}
          {result.pageAnalysis && (
            <Card className="glass-strong p-6 border-[#00f0ff]/30">
              <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#00f0ff]" />Website Content Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="glass-card p-4 rounded-lg"><div className="text-xs text-gray-400 font-rajdhani mb-1">Detected content category</div><div className="text-lg font-orbitron text-[#00f0ff]">{result.pageAnalysis.contentCategory || "Unknown"}</div>{result.pageAnalysis.contentConfidence != null && <div className="text-xs text-gray-400 mt-1">Model confidence: {(result.pageAnalysis.contentConfidence * 100).toFixed(1)}%</div>}</div>
                <div className="glass-card p-4 rounded-lg"><div className="text-xs text-gray-400 font-rajdhani mb-1">Phishing classifier</div><div className={`text-lg font-orbitron ${result.pageAnalysis.phishingPrediction === "phishing" ? "text-[#ff0055]" : "text-[#00ff88]"}`}>{result.pageAnalysis.phishingPrediction || "Uncertain"}</div>{result.pageAnalysis.phishingConfidence != null && <div className="text-xs text-gray-400 mt-1">Model confidence: {(result.pageAnalysis.phishingConfidence * 100).toFixed(1)}%</div>}</div>
                <div className="glass-card p-4 rounded-lg"><div className="text-xs text-gray-400 font-rajdhani mb-1">Child suitability</div><div className={`text-lg font-orbitron ${result.childSafety?.rating === "Not suitable for children" ? "text-[#ff0055]" : result.childSafety?.rating === "Review recommended" ? "text-[#fbbf24]" : "text-[#00ff88]"}`}>{result.childSafety?.rating || "Unknown"}</div><div className="text-xs text-gray-400 mt-1">{result.childSafety?.explanation || "Insufficient evidence for an age suitability assessment."}</div></div>
              </div>
              <div className="glass-card p-4 rounded-lg mb-4"><div className="text-xs text-gray-400 font-rajdhani mb-2">Page title</div><div className="text-sm text-gray-100 break-words">{result.pageAnalysis.title || "No title extracted"}</div><div className="text-xs text-gray-500 font-rajdhani mt-3">Extracted text: {result.pageAnalysis.extractedTextLength.toLocaleString()} characters · {result.pageAnalysis.fetchStatus} · {result.pageAnalysis.analysisMode}</div></div>
              <div className="glass-card p-4 rounded-lg"><div className="text-xs text-gray-400 font-rajdhani mb-2">Content summary</div><p className="text-sm text-gray-300 font-rajdhani whitespace-pre-wrap">{result.pageAnalysis.contentSummary || "The page did not provide enough readable content to summarize."}</p></div>
            </Card>
          )}

          {/* Indicators */}
          <Card className="glass-strong p-6 border-[#00f0ff]/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-orbitron flex items-center gap-2">
                {isSafe
                  ? <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                  : <AlertTriangle className="w-5 h-5 text-[#ff0055]" />}
                {isSafe ? "Security Checks Passed" : `Threat Indicators (${suspiciousIndicators.length})`}
              </h3>
              {isSafe ? (
                <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-rajdhani">All Clear</Badge>
              ) : (
                <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani">
                  {suspiciousIndicators.filter(i => i.severity === "critical").length} Critical
                </Badge>
              )}
            </div>
            {isSafe ? (
              <div className="space-y-3">
                {(result.indicators.length ? [] : ["No high-confidence threat indicators were identified in the accessible page content. This does not prove the website is safe."]).map((check, i) => (
                  <div key={i} className="glass-card p-4 rounded-lg border-l-4 border-l-[#00ff88] flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#00ff88] flex-shrink-0" />
                    <p className="text-sm text-gray-300 font-rajdhani">{check}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {suspiciousIndicators.map((indicator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-4 rounded-lg border-l-4 ${
                      indicator.severity === "critical"
                        ? "border-l-[#ff0055]"
                        : indicator.severity === "high"
                        ? "border-l-[#ff6b00]"
                        : "border-l-[#8b5cf6]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${indicator.severity === "critical" ? "text-[#ff0055]" : indicator.severity === "high" ? "text-[#ff6b00]" : "text-[#8b5cf6]"}`} />
                        <h4 className="font-orbitron text-sm">{indicator.name}</h4>
                      </div>
                      <Badge className={`text-xs ${
                        indicator.severity === "critical"
                          ? "bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30"
                          : indicator.severity === "high"
                          ? "bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30"
                          : "bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30"
                      } font-rajdhani uppercase`}>
                        {indicator.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 font-rajdhani">{indicator.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Recommendations */}
          <Card className="glass-strong p-6 border-[#00ff88]/30">
            <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00ff88]" />
              {isSafe ? "Safe Browsing Confirmation" : "Safe Browsing Recommendations"}
            </h3>
            <div className="space-y-3">
              {(isSafe ? [
                { title: "No strong phishing signals detected.", body: "This is not a guarantee of safety. Unknown, blocked, or dynamic content may not have been assessed." },
                { title: "Review the extracted page content.", body: "Check the content category, child-suitability assessment, and evidence before deciding whether to trust the site." },
              ] : [
                { title: "Do not visit this URL.", body: "It has been flagged as potentially malicious." },
                { title: "Never enter credentials", body: "on suspicious websites, especially those requesting urgent verification." },
                { title: "Verify directly", body: "with the institution through official channels if you received this URL in an email." },
                { title: "Report this threat", body: "to help protect others from falling victim to this attack." },
              ]).map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-orbitron text-[#00ff88]">{i + 1}</span>
                  </div>
                  <p className="text-sm font-rajdhani text-gray-300">
                    <strong className="text-white">{rec.title}</strong>{" "}{rec.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            {!isSafe && (
              <Button className="bg-[#ff0055] text-white hover:bg-[#ff0055]/80 font-rajdhani">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Threat
              </Button>
            )}
            <Button
              variant="outline"
              onClick={downloadReport}
              disabled={downloading}
              className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani"
            >
              {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              {downloading ? "Generating..." : "Download Report"}
            </Button>
            <Button
              variant="outline"
              className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani"
              onClick={() => { setScanned(false); setUrl(""); }}
            >
              <Search className="w-4 h-4 mr-2" />
              Scan Another URL
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
