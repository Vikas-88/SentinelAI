import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/landing-page";
import DashboardLayout from "./layouts/dashboard-layout";
import MainDashboard from "./pages/main-dashboard";
import URLScanner from "./pages/url-scanner";
import EmailAnalyzer from "./pages/email-analyzer";
import ThreatIntelligence from "./pages/threat-intelligence";
import IncidentReport from "./pages/incident-report";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: MainDashboard },
      { path: "url-scanner", Component: URLScanner },
      { path: "email-analyzer", Component: EmailAnalyzer },
      { path: "threat-intelligence", Component: ThreatIntelligence },
      { path: "incident-report", Component: IncidentReport },
    ],
  },
]);
