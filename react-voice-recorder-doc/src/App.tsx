import React, { useState, useEffect } from "react";
import {
  Mic,
  Sparkles,
  ExternalLink,
  Code2,
  Sun,
  Moon,
  Check,
  Copy,
  Globe,
  Apple,
  Laptop,
  Play,
  Terminal,
  HardDrive,
  Layout,
  Cpu,
  CheckCircle2,
  XCircle, X, Info
} from "lucide-react";
import "./App.css";
console.log();

// Move static data outside to prevent purity errors
const STATIC_WAVEFORM_HEIGHTS = [
  40, 70, 45, 90, 65, 30, 85, 50, 75, 40, 95, 60, 80, 50, 35, 90, 70, 45, 60,
  85, 40, 75, 55, 30,
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const package_ver = import.meta.env.VITE_PACKAGE_VER || "0.0.0";

  return (
    <div className="page-shell">
      <aside>
        <div className="brand">
          <div className="brand-mark">
            <div className="logo">
              <Mic size={24} color="white" />
            </div>
            <div>
              <h1>Voice Recorder</h1>
              <p>{package_ver} • ISC License</p>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <nav aria-label="Section navigation">
          <div className="nav-group">
            <p>Overview</p>
            <div className="nav-links">
              <a href="#hero">Intro</a>
              <a href="#features">Features</a>
              <a href="#install">Install</a>
            </div>
          </div>
          <div className="nav-group">
            <p>Developer guide</p>
            <div className="nav-links">
              <a href="#components">Components</a>
              <a href="#compression">Compression</a>
              <a href="#example">Usage Example</a>
              <a href="#impression">Strong Impression</a>
              <a href="#comparison">comparison</a>
              <a href="#compatibility">Compatibility</a>

            </div>
          </div>
        </nav>
      </aside>

      <main id="content">
        <div className="container">
          {/* HERO */}
          <section className="hero" id="hero">
            <div className="hero-grid">
              <div>
                <a
                  className=""
                  href="https://www.npmjs.com/package/@ananay-nag/react-voice-recorder"
                  target="_blank"
                >

                  <span className="eyebrow">
                    <Sparkles size={14} /> @ananay-nag/react-voice-recorder
                  </span>
                </a>
                <h2>Record. Compress. Preview. Ship.</h2>
                <div className="hero-actions">
                  <a
                    className="btn btn-primary"
                    href="https://react-voice-demo-app.vercel.app/"
                    target="_blank"
                  >
                    <ExternalLink size={18} /> Live Demo
                  </a>
                  <a className="btn btn-secondary" href="#example">
                    <Code2 size={18} /> View Code
                  </a>
                </div>
              </div>
              <div className="hero-panel">
                <div className="waveform">
                  {STATIC_WAVEFORM_HEIGHTS.map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }}></span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* INSTALL SECTION WITH COPY BUTTON */}
          <section id="install">
            <div className="section-head">
              <div>
                <span className="pill">Quick Start</span>
                <h3>Installation</h3>
              </div>
            </div>
            <div className="code-block">
              <div className="code-head">
                <span>Terminal</span>
                <button
                  className="copy-btn-inline"
                  onClick={() =>
                    copyToClipboard(
                      "npm install @ananay-nag/react-voice-recorder",
                    )
                  }
                >
                  {copied ? (
                    <Check size={16} className="text-accent" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              <pre>
                <code>npm install @ananay-nag/react-voice-recorder</code>
              </pre>
            </div>
          </section>

          {/* COMPRESSION MATRIX */}
          <section id="compression">
            <div className="section-head">
              <div>
                <span className="pill">Performance</span>
                <h3>Compression Matrix</h3>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Format</th>
                    <th>Bitrate</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>none</code>
                    </td>
                    <td>WAV</td>
                    <td>Raw</td>
                    <td>Uncompressed High Quality</td>
                  </tr>
                  <tr>
                    <td>
                      <code>low</code>
                    </td>
                    <td>WebM</td>
                    <td>96 kbps</td>
                    <td>Crystal Clear Voice</td>
                  </tr>
                  <tr>
                    <td>
                      <code>medium</code>
                    </td>
                    <td>WebM</td>
                    <td>64 kbps</td>
                    <td>Balanced (Default)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>high</code>
                    </td>
                    <td>WebM</td>
                    <td>32 kbps</td>
                    <td>Extreme File Saving</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FULL EXAMPLE SECTION */}
          <section id="example">
            <div className="section-head">
              <h3>Implementation Example</h3>
            </div>
            <div className="showcase">
              <div className="demo-frame">
                <div className="demo-browser">
                  <div className="dot"></div>
                  <span style={{ marginLeft: "45px" }}>
                    recorder-preview.tsx
                  </span>
                </div>
                <div className="demo-content">
                  <div className="mini-recorder">
                    <div className="record-ui">
                      <div className="record-btn">
                        <Mic size={32} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700 }}>Voice Input Active</p>
                        <div className="bar-group">
                          {STATIC_WAVEFORM_HEIGHTS.slice(0, 12).map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h / 1.5}%` }}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="code-block">
                <div className="code-head">
                  <span>React Code</span>
                </div>
                <pre>
                  <code className="language-jsx">
                    {`const handleRecordedData = (data) => {
    setAudioData(data);
    // data: { blob, url, size }
    };

    <VoiceRecorder 
    duration={60} 
    compressionLevel="high" 
    />`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="status">
            <div className="showcase">
              {/* Visual Mock-up */}
              <div className="demo-frame">
                <div className="demo-browser">
                  <div className="dot"></div>
                  <span style={{ marginLeft: "45px" }}>
                    recording-status.tsx
                  </span>
                </div>
                <div className="demo-content">
                  <div className="mini-recorder status-theme">
                    <div className="record-ui">
                      {/* Live Indicator Visual */}
                      <div className="status-indicator-container">
                        <div className="live-ring"></div>
                        <div className="live-dot-main"></div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="flex-between">
                          <p className="status-label">RECRODING STATUS</p>
                          <span className="live-timer">00:14s</span>
                        </div>

                        <div className="status-display-box">
                          <span className="status-text-bold">
                            RECORDING LIVE
                          </span>
                          <div className="audio-activity-dots">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="activity-dot"></div>
                            ))}
                          </div>
                        </div>

                        {/* High-frequency waveform for "active" recording */}
                        <div className="bar-group activity-monitor">
                          {STATIC_WAVEFORM_HEIGHTS.slice(5, 20).map((h, i) => (
                            <span
                              key={i}
                              style={{
                                height: `${h / 1.8}%`,
                                animationDelay: `${i * 0.05}s`,
                              }}
                              className="activity-bar"
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Block */}
              <div className="code-block modern-code-container">
                <div className="code-header">
                  <div className="code-file-info">
                    <Terminal size={14} className="text-muted" />
                    <span>RecordingMonitor.jsx</span>
                  </div>
                  <button
                    className="copy-btn-inline"
                    onClick={() => {
                      /* Add copy logic */
                    }}
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="code-content">
                  <pre>
                    <code className="language-jsx">
                      {`function Monitor({ isRecording }) {
  return (
    <div className="recorder-shell">
      <RecordingStatus 
        isRecording={isRecording} 
      />
    </div>
  );
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section id="example">
            <div className="showcase">
              {/* Visual Mock-up */}
              <div className="demo-frame">
                <div className="demo-browser">
                  <div className="dot"></div>
                  <span style={{ marginLeft: "45px" }}>
                    preview-voice-note.tsx
                  </span>
                </div>
                <div className="demo-content">
                  <div className="mini-recorder playback-theme">
                    <div className="record-ui">
                      {/* Play Button Visual */}
                      <div className="record-btn play-active">
                        <Play size={28} fill="white" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="flex-between">
                          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                            voice-note-01.webm
                          </p>
                          <span className="time-display">0:42 / 1:05</span>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="playback-timeline">
                          <div
                            className="playback-progress"
                            style={{ width: "65%" }}
                          >
                            <div className="playback-knob"></div>
                          </div>
                        </div>

                        {/* Mini Waveform Visual */}
                        <div className="bar-group mini">
                          {STATIC_WAVEFORM_HEIGHTS.slice(0, 18).map((h, i) => (
                            <span
                              key={i}
                              style={{
                                height: `${h / 2}%`,
                                opacity: i < 12 ? 1 : 0.3, // Dim bars that haven't been "played" yet
                              }}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Block */}
              <div className="code-block">
                <div className="code-head">
                  <span>React Implementation</span>
                  <button className="copy-btn-inline">
                    <Copy size={14} />
                  </button>
                </div>
                <pre>
                  <code className="language-jsx">
                    {`const [audioData, setAudioData] = useState<{}>(null);
function AudioPlayer() {
  return (
     {audioData && (
        <PreviewVoiceNote audioUrl={audioData?.url ?? null}>
        </PreviewVoiceNote>
      )}
  );
}`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="example">
            <div className="showcase">
              {/* Visual Mock-up */}
              <div className="demo-frame">
                <div className="demo-browser">
                  <div className="dot"></div>
                  <span style={{ marginLeft: "45px" }}>
                    preview-voice-note.tsx
                  </span>
                </div>
                <div className="demo-content">
                  <div className="mini-recorder playback-theme">
                    <div className="record-ui">
                      {/* Play Button Visual */}
                      <div className="record-btn play-active">
                        <Play size={28} fill="white" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="flex-between">
                          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                            voice-note-01.webm
                          </p>
                          <span className="time-display">0:42 / 1:05</span>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="playback-timeline">
                          <div
                            className="playback-progress"
                            style={{ width: "65%" }}
                          >
                            <div className="playback-knob"></div>
                          </div>
                        </div>

                        {/* Mini Waveform Visual */}
                        <div className="bar-group mini">
                          {STATIC_WAVEFORM_HEIGHTS.slice(0, 18).map((h, i) => (
                            <span
                              key={i}
                              style={{
                                height: `${h / 2}%`,
                                opacity: i < 12 ? 1 : 0.3, // Dim bars that haven't been "played" yet
                              }}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Block */}
              <div className="code-block">
                <div className="code-head">
                  <span>React Implementation</span>
                  <button className="copy-btn-inline">
                    <Copy size={14} />
                  </button>
                </div>
                <pre>
                  <code className="language-jsx">
                    {`function AudioPlayer({ audioUrl }) {
  return (
    <PreviewVoiceNote 
      audioUrl={audioUrl} 
    />
  );
}`}
                  </code>
                </pre>
              </div>
            </div>
          </section>
          <ValueProp></ValueProp>
          <LibraryComparison></LibraryComparison>

          {/* COMPATIBILITY SECTION */}
          <section id="compatibility">
            <div className="section-head">
              <h3>Browser Compatibility</h3>
            </div>
            <div className="grid-4 compat">
              <article className="card">
                <div className="icon-chip">
                  <Globe size={20} />
                </div>
                <strong>Chrome</strong>
                <p>101+</p>
              </article>
              <article className="card">
                <div className="icon-chip">
                  <Globe size={20} />
                </div>
                <strong>Firefox</strong>
                <p>53+</p>
              </article>
              <article className="card">
                <div className="icon-chip">
                  <Apple size={20} />
                </div>
                <strong>Safari</strong>
                <p>11+</p>
              </article>
              <article className="card">
                <div className="icon-chip">
                  <Laptop size={20} />
                </div>
                <strong>Edge</strong>
                <p>79+</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;

const ValueProp: React.FC = () => {
  return (
    <section className="value-prop-section" id="impression">
      <div className="section-head-center">
        <span className="pill accent">
          Why @ananay-nag/react-voice-recorder ?
        </span>
        <h2>Built for Production, not just Demos.</h2>
        <p>
          Most recorders give you a stream and leave you with the "Heavy
          Lifting." We handle the architecture so you can ship features.
        </p>
      </div>

      <div className="bento-grid">
        {/* Card 1: Compression */}
        <div className="bento-card featured">
          <div className="bento-icon-box blue">
            <Cpu size={24} />
          </div>
          <h3>Smart Compression</h3>
          <p>
            Don't clog your S3 buckets. Choose from 4 compression levels to
            reduce file size by up to 80% without losing vocal clarity.
          </p>
          <div className="compression-viz">
            <div className="viz-row">
              <span>Raw WAV</span>
              <div className="viz-bar full">
                <small>10.2 MB</small>
              </div>
            </div>
            <div className="viz-row">
              <span>Our High-Comp</span>
              <div className="viz-bar optimized">
                <small>1.8 MB</small>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Atomic UI */}
        <div className="bento-card">
          <div className="bento-icon-box green">
            <Layout size={24} />
          </div>
          <h3>Atomic UI Design</h3>
          <p>
            Don't get stuck with a rigid modal. Use our individual components to
            build the exact layout your app needs.
          </p>
        </div>

        {/* Card 3: Size Tracking */}
        <div className="bento-card">
          <div className="bento-icon-box orange">
            <HardDrive size={24} />
          </div>
          <h3>Real-time Metadata</h3>
          <p>
            Instant file-size reporting and duration tracking before you even
            hit "Upload."
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="comparison-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Workflow Challenge</th>
              <th>The "Standard" Way</th>
              <th className="highlight-col">The @ananay-nag Way</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>File Management</td>
              <td>
                <XCircle size={16} color="#ff4757" /> Manual Blob conversion
              </td>
              <td>
                <CheckCircle2 size={16} color="#2ed573" /> Ready-to-ship data
                object
              </td>
            </tr>
            <tr>
              <td>Server Costs</td>
              <td>
                <XCircle size={16} color="#ff4757" /> Massive unoptimized files
              </td>
              <td>
                <CheckCircle2 size={16} color="#2ed573" /> Built-in WebM
                compression
              </td>
            </tr>
            <tr>
              <td>Mobile Logic</td>
              <td>
                <XCircle size={16} color="#ff4757" /> Browser compatibility
                headaches
              </td>
              <td>
                <CheckCircle2 size={16} color="#2ed573" /> Cross-browser tested
                polyfills
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

const COMPARISON_DATA = [
  { feature: "Built-in Compression", yours: true, others: [false, false, false] },
  { feature: "Atomic Components", yours: true, others: [true, false, false] },
  { feature: "Audio Visualizers", yours: true, others: [true, true, false] },
  { feature: "File Size Tracking", yours: true, others: [false, false, true] },
  { feature: "Glassmorphism UI", yours: true, others: [false, false, false] },
  { feature: "iOS/Safari Optimized", yours: true, others: [true, false, true] },
];

const LibraryComparison: React.FC = () => {
  return (
    <section className="comparison-section" id="comparison">
      <div className="section-head">
        <div>
          <span className="pill accent">Benchmarks</span>
          <h3>Market Comparison</h3>
        </div>
        <p>How we stack up against the most popular alternatives in the React ecosystem.</p>
      </div>

      <div className="table-overflow-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-col">Feature</th>
              <th className="yours-col">
                <div className="brand-badge">
                  <Sparkles size={14} />
                  @ananay-nag/<br />react-voice-recorder
                </div>
              </th>
              <th>react-audio-voice</th>
              <th>react-mic</th>
              <th>react-voice-rec</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row, idx) => (
              <tr key={idx}>
                <td className="feature-label">
                  {row.feature}
                  <Info size={12} className="info-icon" />
                </td>
                <td className="yours-cell">
                  <div className="status-icon success">
                    <Check size={18} strokeWidth={3} />
                  </div>
                </td>
                {row.others.map((status, i) => (
                  <td key={i}>
                    <div className={`status-icon ${status ? 'success' : 'fail'}`}>
                      {status ? <Check size={16} /> : <X size={16} />}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-footer">
        <p>* Data based on latest stable releases as of 2026.</p>
      </div>
    </section>
  );
};

