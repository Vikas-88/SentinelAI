import { motion } from "motion/react";
import { useState } from "react";
import { 
  Mail, 
  Search, 
  AlertTriangle,
  CheckCircle,
  User,
  Shield,
  ExternalLink,
  FileText,
  Zap,
  Target,
  Eye
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export default function EmailAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalyzed(true);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  // Mock email data
  const emailSample = {
    from: "security@paypa1-verify.com",
    subject: "URGENT: Verify Your Account Within 24 Hours",
    date: "May 23, 2026 14:32",
    content: `Dear Valued Customer,

We have detected unusual activity on your account. To protect your security, we need you to verify your identity immediately.

Please click the link below to verify your account within 24 hours or your account will be permanently suspended:

https://paypa1-verify-security.com/urgent/verify?id=7384729

If you do not verify within 24 hours, we will be forced to:
- Suspend your account permanently
- Freeze all transactions
- Remove access to your funds

This is an automated message. Please do not reply to this email.

Best regards,
PayPal Security Team`
  };

  const threatScore = 94;

  const suspiciousPhrases = [
    { text: "URGENT", severity: "high", reason: "Creates false sense of urgency" },
    { text: "verify your identity immediately", severity: "critical", reason: "Pressure tactic" },
    { text: "account will be permanently suspended", severity: "critical", reason: "Threatening language" },
    { text: "click the link below", severity: "high", reason: "Requests immediate action" },
    { text: "within 24 hours", severity: "high", reason: "Artificial deadline" },
    { text: "automated message", severity: "medium", reason: "Discourages replies" },
  ];

  const indicators = [
    { 
      name: "Spoofed Sender Domain", 
      severity: "critical", 
      description: "Domain 'paypa1-verify.com' uses '1' instead of 'l' to mimic PayPal" 
    },
    { 
      name: "Credential Theft Attempt", 
      severity: "critical", 
      description: "Links to fake login page designed to steal credentials" 
    },
    { 
      name: "Social Engineering", 
      severity: "high", 
      description: "Uses fear and urgency to manipulate recipient" 
    },
    { 
      name: "Suspicious Links", 
      severity: "critical", 
      description: "URL leads to phishing site, not official PayPal domain" 
    },
    { 
      name: "Grammatical Inconsistencies", 
      severity: "medium", 
      description: "Professional companies don't use this threatening tone" 
    },
  ];

  const emailMetadata = [
    { label: "Sender", value: "security@paypa1-verify.com", status: "danger" },
    { label: "Reply-To", value: "noreply@suspicious-domain.ru", status: "danger" },
    { label: "SPF Check", value: "Failed", status: "danger" },
    { label: "DKIM", value: "Not Present", status: "danger" },
    { label: "DMARC", value: "Failed", status: "danger" },
    { label: "Authentication", value: "Failed All Checks", status: "danger" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">Email Phishing Analyzer</h1>
        <p className="text-gray-400 font-rajdhani">AI-powered email threat detection and social engineering analysis</p>
      </div>

      {/* Email Input */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron">Email Content</h2>
              <p className="text-sm text-gray-400 font-rajdhani">Paste email content to analyze</p>
            </div>
          </div>

          <Textarea
            placeholder="Paste email content here..."
            className="h-96 bg-[#0a0f1e] border-[#00f0ff]/30 focus:border-[#00f0ff] font-mono text-sm resize-none"
            defaultValue={emailSample.content}
          />

          <Button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full mt-4 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black hover:opacity-90 font-rajdhani"
          >
            <Search className="w-4 h-4 mr-2" />
            Analyze Email
          </Button>

          {analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-rajdhani text-gray-400">AI Analysis in progress...</span>
                <span className="text-sm font-rajdhani text-[#00f0ff]">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </motion.div>
          )}
        </Card>

        {/* Email Preview */}
        <Card className="glass-strong p-6 border-[#00f0ff]/30">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-[#8b5cf6]" />
            <h2 className="text-xl font-orbitron">Email Preview</h2>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-lg">
              <div className="text-xs text-gray-400 font-rajdhani mb-1">From</div>
              <div className="text-sm font-rajdhani text-[#ff0055]">{emailSample.from}</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-xs text-gray-400 font-rajdhani mb-1">Subject</div>
              <div className="text-sm font-rajdhani text-gray-200">{emailSample.subject}</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-xs text-gray-400 font-rajdhani mb-1">Date</div>
              <div className="text-sm font-rajdhani text-gray-200">{emailSample.date}</div>
            </div>

            <div className="glass-card p-4 rounded-lg border-l-4 border-l-[#ff0055]">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#ff0055] cyber-pulse" />
                <span className="text-sm font-orbitron text-[#ff0055]">Warning</span>
              </div>
              <p className="text-xs text-gray-400 font-rajdhani">
                This email exhibits characteristics of a phishing attempt. Do not click any links or provide any information.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Results */}
      {analyzed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Threat Score and AI Summary */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="glass-strong p-6 border-[#ff0055]/30">
              <h3 className="text-lg font-orbitron mb-4">Threat Score</h3>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255, 0, 85, 0.1)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#ff0055"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - threatScore / 100)}
                    className="cyber-glow"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-orbitron font-bold text-[#ff0055]">{threatScore}</div>
                  <div className="text-xs text-gray-400 font-rajdhani">/ 100</div>
                </div>
              </div>
              <Badge className="w-full justify-center bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani text-xs">
                PHISHING ATTEMPT
              </Badge>
            </Card>

            <Card className="glass-strong p-6 border-[#00f0ff]/30 col-span-2">
              <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ff0055]" />
                AI Classification
              </h3>
              <div className="space-y-4">
                <div className="glass-card p-4 rounded-lg border-l-4 border-l-[#ff0055]">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#ff0055] flex-shrink-0 mt-1 cyber-pulse" />
                    <div>
                      <h4 className="font-orbitron text-[#ff0055] mb-2">Credential Phishing Attack</h4>
                      <p className="text-sm text-gray-300 font-rajdhani mb-3">
                        This is a sophisticated phishing email designed to steal PayPal login credentials. 
                        The attacker uses domain spoofing (paypa1-verify.com) and psychological manipulation 
                        through urgency and fear to trick recipients into clicking malicious links.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">Phishing</Badge>
                        <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">Domain Spoofing</Badge>
                        <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">Social Engineering</Badge>
                        <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 text-xs font-rajdhani">Credential Theft</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-3 rounded-lg">
                    <div className="text-xs text-gray-400 font-rajdhani mb-1">Attack Type</div>
                    <div className="text-sm font-orbitron text-[#ff0055]">Phishing</div>
                  </div>
                  <div className="glass-card p-3 rounded-lg">
                    <div className="text-xs text-gray-400 font-rajdhani mb-1">Target</div>
                    <div className="text-sm font-orbitron text-[#ff0055]">Credentials</div>
                  </div>
                  <div className="glass-card p-3 rounded-lg">
                    <div className="text-xs text-gray-400 font-rajdhani mb-1">Sophistication</div>
                    <div className="text-sm font-orbitron text-[#8b5cf6]">Medium</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Email Metadata */}
          <Card className="glass-strong p-6 border-[#00f0ff]/30">
            <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00f0ff]" />
              Email Authentication
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {emailMetadata.map((item, index) => (
                <div key={index} className="glass-card p-4 rounded-lg">
                  <div className="text-xs text-gray-400 font-rajdhani mb-1">{item.label}</div>
                  <div className={`text-sm font-rajdhani ${item.status === 'danger' ? 'text-[#ff0055]' : 'text-[#00ff88]'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Suspicious Phrases */}
          <Card className="glass-strong p-6 border-[#00f0ff]/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-orbitron flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff0055]" />
                Suspicious Phrases Detected ({suspiciousPhrases.length})
              </h3>
              <Badge className="bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30 font-rajdhani">
                {suspiciousPhrases.filter(p => p.severity === 'critical').length} Critical
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suspiciousPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-4 rounded-lg border-l-4 ${
                    phrase.severity === 'critical' 
                      ? 'border-l-[#ff0055]' 
                      : phrase.severity === 'high'
                      ? 'border-l-[#ff6b00]'
                      : 'border-l-[#8b5cf6]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-sm text-gray-200">"{phrase.text}"</span>
                    <Badge className={`text-xs ml-2 flex-shrink-0 ${
                      phrase.severity === 'critical' 
                        ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' 
                        : phrase.severity === 'high'
                        ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30'
                        : 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                    } font-rajdhani uppercase`}>
                      {phrase.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 font-rajdhani">{phrase.reason}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Threat Indicators */}
          <Card className="glass-strong p-6 border-[#00f0ff]/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-orbitron flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ff0055]" />
                Social Engineering Indicators
              </h3>
            </div>
            <div className="space-y-3">
              {indicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-4 rounded-lg border-l-4 ${
                    indicator.severity === 'critical' 
                      ? 'border-l-[#ff0055]' 
                      : indicator.severity === 'high'
                      ? 'border-l-[#ff6b00]'
                      : 'border-l-[#8b5cf6]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-orbitron text-sm">{indicator.name}</h4>
                    <Badge className={`text-xs ${
                      indicator.severity === 'critical' 
                        ? 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/30' 
                        : indicator.severity === 'high'
                        ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30'
                        : 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30'
                    } font-rajdhani uppercase`}>
                      {indicator.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 font-rajdhani">{indicator.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="glass-strong p-6 border-[#00ff88]/30">
            <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00ff88]" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff0055]/20 border border-[#ff0055]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-orbitron text-[#ff0055]">!</span>
                </div>
                <p className="text-sm font-rajdhani text-gray-300">
                  <strong className="text-white">Delete this email immediately.</strong> Do not click any links or download attachments.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-orbitron text-[#00ff88]">✓</span>
                </div>
                <p className="text-sm font-rajdhani text-gray-300">
                  <strong className="text-white">Report to your email provider</strong> to help prevent similar attacks on others.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-orbitron text-[#00ff88]">✓</span>
                </div>
                <p className="text-sm font-rajdhani text-gray-300">
                  <strong className="text-white">Verify directly with PayPal</strong> through their official website or app if you have concerns.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-orbitron text-[#00ff88]">✓</span>
                </div>
                <p className="text-sm font-rajdhani text-gray-300">
                  <strong className="text-white">Enable two-factor authentication</strong> on all important accounts for added security.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="bg-[#ff0055] text-white hover:bg-[#ff0055]/80 font-rajdhani">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Phishing
            </Button>
            <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-rajdhani">
              <FileText className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
