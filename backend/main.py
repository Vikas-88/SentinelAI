import ipaddress
import os
import re
import socket
import logging
from urllib.parse import urlparse, urljoin

import joblib
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
log = logging.getLogger("sentinelai")

APP_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.getenv("MODEL_DIR", os.path.join(APP_DIR, "models"))
MAX_BYTES = int(os.getenv("MAX_PAGE_BYTES", "1500000"))
TIMEOUT = float(os.getenv("FETCH_TIMEOUT_SECONDS", "12"))
FRONTEND_ORIGINS = [x.strip() for x in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if x.strip()]

app = FastAPI(title="SentinelAI Content Analysis API", version="1.0.0")
app.add_middleware(
    CORSMiddleware, allow_origins=FRONTEND_ORIGINS, allow_credentials=False,
    allow_methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"]
)

def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    try:
        return joblib.load(path) if os.path.isfile(path) else None
    except Exception:
        log.exception("Could not load model %s", path)
        return None

phishing_model = load_model("phishing_model.joblib")
content_model = load_model("content_model.joblib")

class ScanRequest(BaseModel):
    url: str = Field(min_length=4, max_length=2048)
    @field_validator("url")
    @classmethod
    def valid_url(cls, value):
        value = value.strip()
        if not value.startswith(("http://", "https://")):
            value = "https://" + value
        parsed = urlparse(value)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            raise ValueError("Enter a valid http or https URL.")
        if parsed.username or parsed.password:
            raise ValueError("URLs containing embedded credentials are not accepted.")
        return value

def resolve_public_host(hostname: str):
    try:
        records = socket.getaddrinfo(hostname, None, type=socket.SOCK_STREAM)
        ips = sorted({r[4][0] for r in records})
    except socket.gaierror:
        raise HTTPException(status_code=422, detail="The hostname could not be resolved.")
    if not ips:
        raise HTTPException(status_code=422, detail="The hostname did not resolve to an IP address.")
    for value in ips:
        ip = ipaddress.ip_address(value)
        if not ip.is_global:
            raise HTTPException(status_code=400, detail="For safety, private, local, and non-public IP destinations cannot be scanned.")
    return ips[0]

def safe_fetch(raw_url: str):
    current = raw_url
    final_response = None
    for _ in range(4):
        parsed = urlparse(current)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            raise HTTPException(status_code=400, detail="Only public HTTP/HTTPS websites can be scanned.")
        ip = resolve_public_host(parsed.hostname)
        try:
            response = requests.get(
                current, timeout=TIMEOUT, allow_redirects=False, stream=True,
                headers={"User-Agent": "SentinelAI-Research-Scanner/1.0 (+content analysis)", "Accept": "text/html,application/xhtml+xml,text/plain;q=0.8"},
                verify=True,
            )
            if response.status_code in (301, 302, 303, 307, 308):
                location = response.headers.get("location")
                response.close()
                if not location:
                    raise HTTPException(status_code=422, detail="Website returned an invalid redirect.")
                current = urljoin(current, location)
                continue
            response.raise_for_status()
            content_type = response.headers.get("content-type", "").lower()
            if not any(x in content_type for x in ("text/html", "application/xhtml+xml", "text/plain")):
                response.close()
                raise HTTPException(status_code=415, detail=f"Unsupported page content type: {content_type or 'unknown'}.")
            chunks, size = [], 0
            for chunk in response.iter_content(65536):
                if not chunk:
                    continue
                size += len(chunk)
                if size > MAX_BYTES:
                    response.close()
                    raise HTTPException(status_code=413, detail="Page is larger than the configured scan limit.")
                chunks.append(chunk)
            body = b"".join(chunks)
            encoding = response.encoding or "utf-8"
            final_response = {
                "url": current, "ip": ip, "status": response.status_code,
                "content_type": content_type, "html": body.decode(encoding, errors="replace"),
                "https": parsed.scheme == "https",
            }
            response.close()
            return final_response
        except HTTPException:
            raise
        except requests.RequestException as exc:
            log.info("Fetch failed for %s: %s", current, exc)
            raise HTTPException(status_code=422, detail="The website could not be fetched safely (it may block automated requests or be unavailable).")
    raise HTTPException(status_code=422, detail="Too many redirects.")

def extract_page(html: str):
    soup = BeautifulSoup(html, "html.parser")
    for el in soup(["script", "style", "noscript", "svg", "canvas", "template"]):
        el.decompose()
        # Remove navigation and non-content elements
    for selector in [
        "header", "footer", "nav", "aside",
        "[role='navigation']", "[role='banner']",
        "[role='contentinfo']"
    ]:
        for element in soup.select(selector):
            element.decompose()

    # Prefer the main article or content section
    content_root = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id="mw-content-text")
        or soup.body
        or soup
    )
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description = ""
    meta = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    if meta:
        description = str(meta.get("content", ""))

    headings = " ".join(
        x.get_text(" ", strip=True)
        for x in content_root.find_all(["h1", "h2", "h3"])[:30]
    )

    headings = " ".join(
        x.get_text(" ", strip=True)
        for x in content_root.find_all(["h1", "h2", "h3"])[:30]
)
    visible_text = re.sub(
        r"\s+", " ", content_root.get_text(" ", strip=True)
    )
    combined = " ".join(x for x in [title, description, headings, visible_text] if x)
    forms = len(soup.find_all("form"))
    password_fields = len(soup.find_all("input", attrs={"type": re.compile("^password$", re.I)}))
    external_links = []
    for a in soup.find_all("a", href=True)[:300]:
        href = str(a.get("href", "")).strip()
        if href.startswith(("http://", "https://")):
            external_links.append(href)
    return {
        "title": title[:300], "description": description[:1000], "headings": headings[:2500],
        "text": combined[:60000], "visible_text": visible_text[:60000],
        "text_length": len(visible_text), "forms": forms, "password_fields": password_fields,
        "external_links": external_links[:100],
    }

def model_prediction(model, text):
    if model is None or not text.strip():
        return None, None
    try:
        pred = str(model.predict([text])[0]).strip().lower()
        confidence = None
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba([text])[0]
            confidence = float(max(probs))
        return pred, confidence
    except Exception:
        log.exception("Model prediction failed")
        return None, None

def heuristic_analysis(page, final_url, https):
    text = page["text"].lower()
    url_lower = final_url.lower()
    indicators = []
    score = 0
    def add(points, name, severity, description):
        nonlocal score
        score += points
        indicators.append({"name": name, "severity": severity, "description": description})
    if page["password_fields"]:
        # A password field is contextual evidence, not proof of phishing.
        if any(x in text for x in ["verify your account", "account suspended", "urgent action", "confirm your password", "unusual activity", "wallet recovery"]):
            add(28, "Credential-harvesting language", "high", "A password field appears alongside account-verification or urgency language.")
    urgency = ["act immediately", "account suspended", "verify your account", "limited time", "urgent action", "claim your prize", "you have won"]
    if any(k in text for k in urgency):
        add(18, "Urgency or reward language", "medium", "Visible page text contains urgency, account pressure, or prize-claim wording.")
    if any(k in text for k in ["send bitcoin", "crypto recovery phrase", "seed phrase", "gift card payment"]):
        add(30, "High-risk payment request", "critical", "Page text references cryptocurrency secrets or unusual payment methods.")
    host = urlparse(final_url).hostname or ""
    if re.fullmatch(r"(?:\d{1,3}\.){3}\d{1,3}", host):
        add(20, "Raw IP destination", "high", "The website uses a numeric IP address instead of a hostname.")
    if not https:
        add(12, "Unencrypted HTTP", "medium", "The page was retrieved over HTTP rather than HTTPS.")
    if page["password_fields"] and len(page["external_links"]) > 15:
        add(8, "Credential form and many external links", "low", "The page combines a password field with numerous external links; review the destination links.")
    return min(score, 100), indicators

ADULT_TERMS = ["explicit porn", "pornographic", "adult video", "xxx videos", "sex cam", "adult content", "onlyfans"]
GAMBLING_TERMS = ["casino", "sportsbook", "sports betting", "online gambling", "slot machine", "poker"]
def fallback_category(text):
    t = text.lower()
    if any(k in t for k in ADULT_TERMS): return "adult content"
    if any(k in t for k in GAMBLING_TERMS): return "gambling"
    if any(k in t for k in ["sign in", "log in", "password", "account verification", "bank account"]): return "account / financial"
    if any(k in t for k in ["course", "university", "tutorial", "learn", "education"]): return "education"
    if any(k in t for k in ["buy now", "add to cart", "shipping", "product price"]): return "shopping / commerce"
    if any(k in t for k in ["breaking news", "latest news", "reporter", "headline"]): return "news / media"
    if any(k in t for k in ["movie", "music", "streaming", "entertainment"]): return "entertainment"
    return "general / uncategorized"

def make_summary(page):
    text = page["visible_text"]
    if not text:
        return "No readable visible text could be extracted. The site may require JavaScript, block automated access, or contain little text."
    # A deterministic extractive preview; it is not presented as an LLM-generated summary.
    sentences = re.split(r"(?<=[.!?])\s+", text)
    useful = [x.strip() for x in sentences if len(x.strip()) > 35]
    return " ".join(useful[:3])[:700] or text[:500]

def geolocate(ip):
    # Approximate IP geolocation; failure is deliberately represented as unavailable.
    try:
        r = requests.get(f"https://ipwho.is/{ip}", timeout=3)
        data = r.json()
        if data.get("success"):
            city = data.get("city") or ""
            region = data.get("region") or ""
            country = data.get("country") or "Unknown"
            parts = [p for p in [city, region, country] if p]
            return ip, ", ".join(parts)
    except Exception:
        pass
    return ip, "Unavailable"

@app.get("/")
def root():
    return {"service": "SentinelAI Content Analysis API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok", "phishing_model_loaded": phishing_model is not None, "content_model_loaded": content_model is not None}

@app.post("/api/scan/url")
def scan_url(request: ScanRequest):
    fetched = safe_fetch(request.url)
    page = extract_page(fetched["html"])
    content_pred, content_conf = model_prediction(content_model, page["text"])
    phishing_pred, phishing_conf = model_prediction(phishing_model, page["text"])

    category = content_pred or fallback_category(page["text"])
    mode = "trained ML models" if (content_model is not None or phishing_model is not None) else "content heuristics (models not installed)"
    score, indicators = heuristic_analysis(page, fetched["url"], fetched["https"])

    if phishing_pred:
        positive = phishing_pred in {"phishing", "malicious", "1", "true", "bad", "unsafe"}
        if positive:
            model_points = 45 if phishing_conf is None else int(25 + 35 * phishing_conf)
            score = min(100, max(score, model_points))
            indicators.insert(0, {"name": "Phishing text classifier", "severity": "critical" if score >= 70 else "high",
                "description": f"The trained page-text classifier predicted '{phishing_pred}'" + (f" with {phishing_conf:.1%} confidence." if phishing_conf is not None else ".")})
        elif phishing_pred in {"benign", "legitimate", "safe", "0", "false", "good"}:
            # A benign prediction is not enough to erase independent evidence.
            score = max(score, 0)

    score = min(100, int(score))
    threat_level = "low" if score < 25 else "medium" if score < 55 else "high" if score < 80 else "critical"
    adult_detected = category.lower() in {"adult", "adult content", "pornography", "porn"} or any(k in page["text"].lower() for k in ADULT_TERMS)
    gambling_detected = category.lower() == "gambling" or any(k in page["text"].lower() for k in GAMBLING_TERMS)
    if adult_detected:
        child_rating = "Not suitable for children"
        child_explanation = "Adult-content indicators were detected in accessible page text. This is a content flag, not a certified age rating."
    elif gambling_detected:
        child_rating = "Not suitable for children"
        child_explanation = "Gambling-related content was detected. This assessment is based on accessible page text."
    elif not page["text"] or page["text_length"] < 100:
        child_rating = "Review recommended"
        child_explanation = "Too little readable content was available to assess age suitability reliably."
    else:
        child_rating = "No obvious adult content detected"
        child_explanation = "The scanned text did not match the configured adult-content indicators. This does not establish that the website is child-safe."

    ip, location = geolocate(fetched["ip"])
    host = urlparse(fetched["url"]).hostname or ""
    is_safe = score < 25 and not (phishing_pred and phishing_pred in {"phishing", "malicious", "1", "true", "bad", "unsafe"})
    if score >= 80: status = "Critical risk"
    elif score >= 55: status = "High risk"
    elif score >= 25: status = "Review recommended"
    else: status = "No strong threat signals detected"

    if phishing_pred is None:
        phishing_label = "uncertain (model unavailable)" if phishing_model is None else "uncertain"
    else:
        phishing_label = phishing_pred

    return {
        "safe": is_safe, "threatLevel": score, "hostname": host, "hasHttps": fetched["https"],
        "domainInfo": {"domain": host, "ip": ip, "country": location, "registrar": "Not queried", "created": "Not queried", "reputation": "Not checked against a live threat-intelligence feed"},
        "indicators": indicators,
        "tags": [status, category, "HTTPS" if fetched["https"] else "HTTP"],
        "pageAnalysis": {
            "title": page["title"], "contentCategory": category,
            "contentSummary": make_summary(page), "extractedTextLength": page["text_length"],
            "phishingPrediction": phishing_label, "phishingConfidence": phishing_conf,
            "contentConfidence": content_conf, "analysisMode": mode,
            "fetchStatus": f"HTTP {fetched['status']}",
        },
        "childSafety": {"rating": child_rating, "explanation": child_explanation, "confidence": content_conf if content_model else None},
        "threatLevelLabel": threat_level, "analysisStatus": "completed",
    }
