import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Zap,
  Layers,
  Copy,
  Menu,
  X,
  BookOpen,
  BarChart3,
  Package,
  Settings,
  Smartphone,
  Tablet,
  Wifi,
  Cpu,
  Check,
  Activity,
  ShieldCheck,
} from "lucide-react";
import "./App.css";
import apiDocsData from "./data/apiDocs.json";

const VERSIONS = Object.keys(apiDocsData);
const package_ver = import.meta.env.VITE_PACKAGE_VER || "0.0.0";

export default function App() {
  const latestVersion = VERSIONS[VERSIONS.length - 1];
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div className="docs-shell">
      {/* ANIMATED BACKGROUND ORBS */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-mark">
            <div className="logo-sq">
              <Monitor size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="brand-name">web-device-info</span>
              <VersionDropdown selectedVersion={selectedVersion} onSelect={setSelectedVersion} versions={VERSIONS} />
            </div>

          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <label>Getting Started</label>
            <a href="#intro" className="active">
              <BookOpen size={16} /> Introduction
            </a>
            <a href="#install">
              <Package size={16} /> Installation
            </a>
          </div>
          <div className="nav-section">
            <label>Usage</label>
            <a href="#frameworks">
              <Layers size={16} /> Frameworks
            </a>
            <a href="#listeners">
              <Activity size={16} /> Listeners
            </a>
          </div>
          <div className="nav-section">
            <label>Reference</label>
            <a href="#api">
              <Settings size={16} /> API Reference
            </a>
            <a href="#compare">
              <BarChart3 size={16} /> Comparison
            </a>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="mobile-header">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>web-device-info</span>
            <VersionDropdown selectedVersion={selectedVersion} onSelect={setSelectedVersion} versions={VERSIONS} />
          </div>
        </header>

        <Docs package_ver={package_ver} selectedVersion={selectedVersion} />
      </main>
    </div>
  );
}

function VersionDropdown({ selectedVersion, onSelect, versions }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="version-dropdown-container" onClick={() => setIsOpen(!isOpen)}>
      <div className="version-dropdown-active">
        {selectedVersion} <span className="caret">▼</span>
      </div>
      {isOpen && (
        <div className="version-dropdown-menu">
          {versions.map((v: string) => (
            <div
              key={v}
              className={`version-item ${v === selectedVersion ? 'active' : ''}`}
              onClick={() => onSelect(v)}
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Docs({ package_ver, selectedVersion }: { package_ver: string, selectedVersion: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiData = (apiDocsData as any)[selectedVersion] || (apiDocsData as any)[VERSIONS[0]];

  return (
    <div className="content-container">
      <DeviceSandbox selectedVersion={selectedVersion} copyToClipboard={copyToClipboard} copied={copied} id="intro" />
      <FeaturesGrid />
      <FrameworkUsage />
      <GlobalListeners />
      <ApiReference version={selectedVersion} apiData={apiData} />
      <ComparisonMatrix />
    </div>
  );
}



function FeaturesGrid() {
  return (
    <section className="grid-section">
      <div className="bento-grid">
        <div className="bento-card featured">
          <div className="icon-wrap blue"><Maximize2 /></div>
          <h3>Physical Diagonal Calculation</h3>
          <p>The only library that uses Pythagorean math to calculate the approximate screen diagonal in inches, helping you define density breakpoints.</p>
        </div>
        <div className="bento-card">
          <div className="icon-wrap green"><Zap /></div>
          <h3>Real-time Updates</h3>
          <p>Automatic triggers for resize, orientation, and online/offline changes.</p>
        </div>
        <div className="bento-card">
          <div className="icon-wrap purple"><ShieldCheck /></div>
          <h3>Tiny & Typed</h3>
          <p>~10KB total. Full TypeScript support with native ESM and CommonJS exports.</p>
        </div>
      </div>
    </section>
  );
}

function FrameworkUsage() {
  const [activeTab, setActiveTab] = useState("react");
  return (
    <section id="frameworks" className="showcase-section">
      <div className="section-title">
        <h2>Unified Usage</h2>
        <p>Import specific wrappers or use the Core JS library.</p>
      </div>

      <div className="showcase-box">
        <div className="tabs">
          {["react", "angular", "vue", "svelte", "vanilla"].map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <div className="code-window">
          <pre>
            {activeTab === "react" && <CodeSnippet code={`import { ReactDeviceInfo } from "@ananay-nag/web-device-info";\n\nconst { useDeviceInfo } = ReactDeviceInfo;\nconst info = useDeviceInfo({ useViewport: true });`} />}
            {activeTab === "angular" && <CodeSnippet code={`import { AngularDeviceInfo } from "@ananay-nag/web-device-info";\n\n// Use in OnInit\nthis.deviceInfo = AngularDeviceInfo.getDeviceInfo({ useViewport: true });`} />}
            {activeTab === "vue" && <CodeSnippet code={`import { VueDeviceInfo } from "@ananay-nag/web-device-info";\n\nconst { useDeviceInfo } = VueDeviceInfo;\nconst deviceInfo = useDeviceInfo({ useViewport: true });`} />}
            {activeTab === "svelte" && <CodeSnippet code={`import { SvelteDeviceInfo } from "@ananay-nag/web-device-info";\n\nconst { deviceInfo } = SvelteDeviceInfo.useDeviceInfo({ useViewport: true });\n// Access with $deviceInfo`} />}
            {activeTab === "vanilla" && <CodeSnippet code={`import { JSDeviceInfo } from "@ananay-nag/web-device-info";\n\nconst info = JSDeviceInfo.getDeviceInfo({ useViewport: true });`} />}
          </pre>
        </div>
      </div>
    </section>
  );
}

function GlobalListeners() {
  return (
    <section id="listeners" className="info-section">
      <div className="section-title">
        <h3>Global Listeners</h3>
        <p>Listen to changes outside of UI components.</p>
      </div>
      <div className="terminal-box">
        <pre>
          <CodeSnippet code={`import { onDeviceChange } from "@ananay-nag/web-device-info";\n\nonDeviceChange((info) => {\n  console.log("Device changed:", info.orientation, info.width);\n});`} />
        </pre>
      </div>
    </section>
  );
}

function ApiReference({ version, apiData }: { version: string, apiData: any }) {
  if (!apiData) return null;
  return (
    <section id="api" className="api-section">
      <h2>API Reference <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 500 }}>{version}</span></h2>

      <div className="api-block">
        <h3>DeviceOptions</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apiData.options.map((opt: any) => (
                <tr key={opt.name}>
                  <td><code>{opt.name}</code></td>
                  <td>{opt.type}</td>
                  <td>{opt.default}</td>
                  <td>{opt.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="api-block">
        <h3>DeviceInfo Object</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apiData.objects.map((obj: any) => (
                <tr key={obj.name}>
                  <td><code>{obj.name}</code></td>
                  <td>{obj.type}</td>
                  <td>{obj.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix() {
  return (
    <section id="compare" className="table-section">
      <h2>Comparison Matrix</h2>
      <div className="table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th className="highlight">web-device-info</th>
              <th>UA-Parser</th>
              <th>React-Device</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Multi-framework</td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>Screen Diagonal</td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>Real-time Signals</td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>Tiny & Dep-free</td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Maximize2() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

const DEVICE_STATES = [
  {
    id: "desktop",
    name: "Desktop",
    width: 1920,
    height: 1080,
    os: "Windows 11",
    platform: "Win32 (amd64)",
    isMobile: false,
    isDesktop: true,
    isTab: false,
    icon: <Monitor size={48} />,
    color: "#6366f1",
  },
  {
    id: "tablet",
    name: "Tablet",
    width: 820,
    height: 1180,
    os: "iPadOS",
    platform: "MacIntel",
    isMobile: false,
    isDesktop: false,
    isTab: true,
    icon: <Tablet size={40} />,
    color: "#a855f7",
  },
  {
    id: "mobile",
    name: "Smartphone",
    width: 390,
    height: 844,
    os: "iOS / Android",
    platform: "iPhone",
    isMobile: true,
    isDesktop: false,
    isTab: false,
    icon: <Smartphone size={32} />,
    color: "#2dd4bf",
  },
];

const DeviceSandbox = ({ selectedVersion, copyToClipboard, copied }: any) => {
  const [index, setIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const states = [...DEVICE_STATES];
  const current = states[index];

  // Auto-cycle every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % states.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [states.length]);

  // Determine target aspect ratio based on device
  let targetRatio = 1.77;
  if (current.id === "desktop") targetRatio = 1.6;
  if (current.id === "tablet") targetRatio = 0.75;
  if (current.id === "mobile") targetRatio = 0.56;
  if (current.id === "current") targetRatio = windowSize.width / Math.max(windowSize.height, 1);

  // Calculate the maximum rectangle that fits inside max available dimensions
  const maxAvailableWidth = windowSize.width * 0.9;
  const maxAvailableHeight = windowSize.height * 0.75;
  const maxFixedHeight = 750;

  let targetHeight = Math.min(maxAvailableHeight, maxFixedHeight);
  let targetWidth = targetHeight * targetRatio;

  // Scale down proportionally if width is too large for the viewport
  if (targetWidth > maxAvailableWidth) {
    targetWidth = maxAvailableWidth;
    targetHeight = targetWidth / targetRatio;
  }

  // Floor for mobile to prevent it from getting unreadably thin
  if (current.id === "mobile" && targetWidth < 280) {
    targetWidth = 280;
    targetHeight = targetWidth / targetRatio;
  }

  return (
    <section className="sandbox-wrapper" id="intro">

      <div className="sandbox-header">
        <h2>
          Real-time Device Detection with <span className="highlight">web-device-info</span>
        </h2>
      </div>
      <div className="sandbox-main">
        {/* LEFT STATS */}
        <div className="side-stats">
          <div className="sandbox-header">
            <h2>
              {current.name}
            </h2>
          </div>
          <motion.div
            key={`os-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="info-card glass"
          >
            <div className="card-icon blue">
              <Monitor size={18} />
            </div>
            <div className="card-txt">
              <label>OS:</label>
              <strong>{current.os}</strong>
            </div>
          </motion.div>

          <motion.div
            key={`plt-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="info-card glass"
          >
            <div className="card-icon gold">
              <Cpu size={18} />
            </div>
            <div className="card-txt">
              <label>Platform:</label>
              <strong>{current.platform}</strong>
            </div>
          </motion.div>

          <motion.div
            key={`type-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="info-card glass dark"
          >
            <div className="card-icon">
              <Layers size={18} />
            </div>
            <div className="card-txt">
              <label>Type: {current.name}</label>
              <div className="bool-row">
                Is Mobile:{" "}
                {current.isMobile ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
              <div className="bool-row">
                Is Desktop:{" "}
                {current.isDesktop ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
              <div className="bool-row">
                Is Tab:{" "}
                {current.isTab ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CENTER VISUAL DEVICE */}
        <div className="device-stage">
          <motion.div
            className="morph-frame"
            animate={{
              width: targetWidth,
              height: targetHeight,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <div className="screen-inner">
              <div className="screen-header">
                <label>SCREEN WIDTH CALCULATION</label>
                <span className="func-tag">linear(width)</span>
              </div>

              <div className="screen-center hero-in-screen" style={{ width: "100%", textAlign: "center" }}>
                <motion.div
                  key={`hero-${index}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: current.width < 400 ? "10px" : "25px",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    <a href="https://www.npmjs.com/package/@ananay-nag/web-device-info" style={{ pointerEvents: "none" }}>
                      <div className="badge-pill" style={{ fontSize: current.width < 400 ? "0.6rem" : "0.9rem", padding: current.width < 400 ? "4px 8px" : "6px 12px" }}>
                        {selectedVersion} Latest Release
                      </div>
                      <div className="badge-pill" style={{ fontSize: current.width < 400 ? "0.6rem" : "0.9rem", padding: current.width < 400 ? "4px 8px" : "6px 12px" }}>
                        MIT License
                      </div>
                    </a>
                  </div>

                  <h1 style={{
                    fontSize: current.width < 400 ? "2.5rem" : current.width < 1000 ? "3.5rem" : "4.5rem",
                    lineHeight: 1.1, margin: 0, transition: "all 0.3s"
                  }}>
                    One Library. <br />
                    <span className="text-gradient">Multi Framework.</span> <br />
                    <span className="text-gradient-2">Every Signal.</span>
                  </h1>

                  {current.width >= 300 && (
                    <p className="lede" style={{
                      fontSize: current.width < 400 ? "1.1rem" : "1.3rem",
                      margin: 0, transition: "all 0.3s", lineHeight: 1.4, opacity: 0.8,
                      maxWidth: current.width < 400 ? "100%" : "70%"
                    }}>
                      Universal hardware intelligence for JS, React, Angular, Vue, and Svelte.
                    </p>
                  )}

                  {current.width > 300 && (
                    <div className="terminal-bar" style={{
                      padding: "10px 20px",
                      fontSize: current.width < 400 ? "0.8rem" : "1.1rem",
                      transform: current.width < 400 ? "scale(0.85)" : "scale(1)",
                      cursor: "pointer",
                      marginTop: "10px"
                    }} onClick={(e) => { e.stopPropagation(); copyToClipboard("npm i @ananay-nag/web-device-info"); }}>
                      <code>npm i @ananay-nag/web-device-info</code>
                      <Copy size={16} />
                    </div>
                  )}

                  <div style={{ marginTop: "10px", fontSize: current.width < 400 ? "0.8rem" : "1.1rem", color: "var(--text-dim)", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "6px" }}>
                    {current.width.toLocaleString()} px width
                  </div>
                </motion.div>
              </div>

              <div className="screen-footer">
                <div className="percentage">82.18%</div>
              </div>
            </div>
            <div className="bezel-stand"></div>
          </motion.div>

          {/* NETWORK PILL */}
          <motion.div style={{ 'paddingTop': '20px' }}
            className="net-status-pill glass"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Wifi size={16} className="text-success" />
            <div>
              <label>NETWORK STATUS </label>
              <strong className="text-success"> ONLINE</strong>
            </div>
          </motion.div>
        </div>

        {/* RIGHT STATS */}
        {/* <div className="side-stats">
          <motion.div
            key={`type-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="info-card glass dark"
          >
            <div className="card-icon">
              <Layers size={18} />
            </div>
            <div className="card-txt">
              <label>Type: {current.name}</label>
              <div className="bool-row">
                Is Mobile:{" "}
                {current.isMobile ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
              <div className="bool-row">
                Is Desktop:{" "}
                {current.isDesktop ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
              <div className="bool-row">
                Is Tab:{" "}
                {current.isTab ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <X size={14} className="text-danger" />
                )}
              </div>
            </div>
          </motion.div>
        </div> */}
      </div>
    </section>
  );
};

const CodeSnippet = ({ code }: { code: string }) => {
  const highlighted = code
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/("[^"]*")/g, "<span style='color: #98c379;'>$1</span>")
    .replace(/\b(import|from|const|let|var|this|function)\b/g, "<span style='color: #c678dd;'>$1</span>")
    .replace(/\b(true|false)\b/g, "<span style='color: #d19a66;'>$1</span>")
    .replace(/(\/\/.*)/g, "<span style='color: #5c6370; font-style: italic;'>$1</span>")
    .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, "<span style='color: #e5c07b;'>$1</span>")
    .replace(/\b(useDeviceInfo|getDeviceInfo|onDeviceChange|console|log|info|deviceInfo)\b/g, "<span style='color: #61afef;'>$1</span>")
    .replace(/([{}])/g, "<span style='color: #abb2bf;'>$1</span>");

  return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
};
