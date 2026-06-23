import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

// Pre-defined JSON samples for user selection
const SAMPLES = {
  chat: {
    event: "chat_message",
    username: "alice_dev",
    message: "Hey! Did you check out the new binary transport protocol?",
    timestamp: 1718985600,
    active: true
  },
  sensor: {
    device_id: "sensor_node_west_42",
    temperature: 24.85,
    humidity: 62.4,
    co2_level: 412,
    status: "operational"
  },
  gaming: {
    player_id: "gopher_knight_99",
    position: { x: 1240.52, y: 78.41, z: -455.0 },
    velocity: { x: 4.5, y: 0.0, z: -1.2 },
    health: 95,
    equipped_shield: true
  }
};

// Estimating MsgPack size
function estimateMsgPackSize(val) {
  if (val === null || val === undefined) return 1;
  if (typeof val === 'boolean') return 1;
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      if (val >= -32 && val <= 127) return 1;
      if (val >= -128 && val <= 127) return 2;
      if (val >= -32768 && val <= 32767) return 3;
      if (val >= -2147483648 && val <= 2147483647) return 5;
      return 9;
    }
    return 9; // float64
  }
  if (typeof val === 'string') {
    const len = val.length;
    if (len <= 31) return 1 + len;
    if (len <= 255) return 2 + len;
    if (len <= 65535) return 3 + len;
    return 5 + len;
  }
  if (Array.isArray(val)) {
    const len = val.length;
    let headerSize = 1;
    if (len > 15) headerSize = len <= 65535 ? 3 : 5;
    return headerSize + val.reduce((acc, item) => acc + estimateMsgPackSize(item), 0);
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    const len = keys.length;
    let headerSize = 1;
    if (len > 15) headerSize = len <= 65535 ? 3 : 5;
    return headerSize + keys.reduce((acc, k) => acc + estimateMsgPackSize(k) + estimateMsgPackSize(val[k]), 0);
  }
  return 1;
}

// Convert object to flat array of sorted-key values (what schema serialization does)
function stripKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(stripKeys);
  return Object.keys(obj).sort().map(key => stripKeys(obj[key]));
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.badge}>
          <span className={styles.badgePulse}></span>
          BitSocket v1.0.0 is officially released!
        </div>
        <h1 className={styles.heroTitle}>
          {siteConfig.title}
        </h1>
        <p className={styles.heroSubtitle}>
          An enterprise compressed binary transport engine. Retain the fluid <strong>Socket.io developer experience</strong> while supercharging communication with <strong>90% smaller binary wire footprints</strong> natively in Go, Node.js, and Python.
        </p>
        <div className={styles.buttons}>
          <Link
            className={styles.primaryBtn}
            to="/docs/intro">
            Get Started
          </Link>
          <Link
            className={styles.secondaryBtn}
            to="https://github.com/ananay-nag/bit-socket">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  // Interactive Calculator State
  const [selectedSample, setSelectedSample] = useState('chat');
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLES.chat, null, 2));
  const [error, setError] = useState(null);
  
  // Computed values
  const [jsonSize, setJsonSize] = useState(0);
  const [schemaArray, setSchemaArray] = useState([]);
  const [binarySize, setBinarySize] = useState(0);
  const [percentageSavings, setPercentageSavings] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState('node');

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      
      const rawJsonSize = jsonText.replace(/\s+/g, '').length; // Minified JSON size
      const stripped = stripKeys(parsed);
      const msgpackSize = estimateMsgPackSize(stripped) + 6; // +6 bytes for BitSocket frame header (Type + NspLen + EventLen + CorrID)
      
      setJsonSize(rawJsonSize);
      setSchemaArray(stripped);
      setBinarySize(msgpackSize);
      
      const savings = Math.max(0, Math.round(((rawJsonSize - msgpackSize) / rawJsonSize) * 100));
      setPercentageSavings(savings);
    } catch (err) {
      setError("Invalid JSON format. Please check syntax.");
    }
  }, [jsonText]);

  const handleSelectSample = (e) => {
    const key = e.target.value;
    setSelectedSample(key);
    setJsonText(JSON.stringify(SAMPLES[key], null, 2));
  };

  const codeSnippets = {
    node: {
      title: "Node.js Server Setup",
      file: "server.js",
      code: `import { BitSocketServer, Schema } from '@ananay-nag/bit-socket-node';

const io = new BitSocketServer({ port: 6001 });

// Register schema for keyless encoding
const userSchema = new Schema('USER', { name: 'string', age: 'uint8' });
io.of('/user').schema(userSchema);

io.of('/user').on('connection', (socket) => {
  socket.on('USER', (payload) => {
    console.log('Received payload:', payload.name, payload.age);
  });
});`
    },
    go: {
      title: "Go Server Setup",
      file: "main.go",
      code: `package main

import (
	"fmt"
	"github.com/ananay-nag/bit-socket-go/protocol"
	"github.com/ananay-nag/bit-socket-go/server"
)

func main() {
	io := server.New(server.Config{Port: 6001})

	// Register schema for keyless encoding
	schema := protocol.MustNewSchema("USER", map[string]interface{}{
		"name": "string",
		"age":  "uint8",
	})
	io.Of("/user").Schema(schema)

	io.Of("/user").OnConnection(func(socket *server.Socket) {
		socket.On("USER", func(payload interface{}, ack server.AckFunc) {
			fmt.Println("Received payload:", payload)
		})
	})

	select {}
}`
    },
    python: {
      title: "Python Server Setup",
      file: "server.py",
      code: `import asyncio
from bitsocket.server import BitSocketServer
from bitsocket.protocol import Schema

async def main():
    io = BitSocketServer(port=6001)

    # Register schema for keyless encoding
    user_schema = Schema("USER", {"name": "string", "age": "uint8"})
    io.of("/user").schema(user_schema)

    async def on_connection(sock):
        @sock.on("USER")
        async def on_user(payload, ack):
            print("Received payload:", payload["name"], payload["age"])

    io.of("/user").on_connection(on_connection)
    await io.serve_forever()

asyncio.run(main())`
    }
  };

  return (
    <Layout
      title="BitSocket - Enterprise Compressed Binary Transport Engine"
      description="Zero-overhead schema-based WebSocket binary transport for Go, Node.js, and Python.">
      <HomepageHeader />
      
      <main>
        {/* Core Value Features */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>High Performance Binary Core</h2>
              <p className={styles.sectionSubtitle}>
                Standard WebSockets waste massive bandwidth transmitting redundant JSON object keys. BitSocket maps variables to binary schemas, stripping metadata overhead.
              </p>
            </div>
            
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>✨</div>
                <h3 className={styles.featureCardTitle}>Automatic Keyless Schema</h3>
                <p className={styles.featureCardDescription}>
                  Compile structural templates that serialize data directly into array indices, eliminating repetitive JSON object keys from crossing the network.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>🌐</div>
                <h3 className={styles.featureCardTitle}>Cross-Language Sync</h3>
                <p className={styles.featureCardDescription}>
                  First-class libraries in <strong>Node.js</strong>, <strong>Go</strong>, and <strong>Python</strong>. Built-in handshake synchronizes schemas across language nodes.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>⚡</div>
                <h3 className={styles.featureCardTitle}>Deflate Stream Compression</h3>
                <p className={styles.featureCardDescription}>
                  BitSocket automatically packs serialized binary payloads using zlib stream-based Deflate algorithms to squeeze high-frequency message packets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Calculator Interactive Benchmarking */}
        <section className={clsx(styles.section, styles.sectionLight)}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Interactive Wire-Size Simulator</h2>
              <p className={styles.sectionSubtitle}>
                Modify the JSON payload or choose a sample to see how BitSocket strips keys and compresses structures to optimize transmission sizes.
              </p>
            </div>

            <div className={styles.calculatorCard}>
              <div className={styles.calcGrid}>
                {/* Inputs Column */}
                <div className={styles.calcCol}>
                  <div className={styles.calcLabel}>Select Payload Sample</div>
                  <select 
                    value={selectedSample} 
                    onChange={handleSelectSample} 
                    className={styles.calcSelect}
                  >
                    <option value="chat">Chat Message JSON</option>
                    <option value="sensor">Sensor Node Telemetry</option>
                    <option value="gaming">Real-time Gaming Coordinates</option>
                  </select>

                  <div className={styles.calcLabel}>JSON Input Payload</div>
                  <div className={styles.textareaWrapper}>
                    <textarea
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      className={styles.textarea}
                    />
                    {error && <div className={styles.errorText}>{error}</div>}
                  </div>
                </div>

                {/* Outputs & Results Column */}
                <div className={styles.calcCol}>
                  <div className={styles.resultHeader}>
                    <div>
                      <div className={styles.savingsHeadingText}>Bandwidth Saved</div>
                      <div className={styles.savingsHeading}>{percentageSavings}% Smaller</div>
                    </div>
                    <div className={styles.savingPercentage}>
                      -{percentageSavings}%
                    </div>
                  </div>

                  <div className={styles.comparisonSection}>
                    <div className={styles.metricRow}>
                      <span className={styles.metricName}>Standard Minified JSON</span>
                      <span className={styles.metricValue}>{jsonSize} bytes</span>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: '100%' }}></div>
                    </div>

                    <div className={styles.metricRow}>
                      <span className={styles.metricName}>BitSocket Binary (Deflate MsgPack)</span>
                      <span className={styles.metricValueGreen}>{binarySize} bytes</span>
                    </div>
                    <div className={styles.barBg}>
                      <div 
                        className={styles.barFillGreen} 
                        style={{ width: `${Math.max(10, (binarySize / jsonSize) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.structurePanel}>
                    <div className={styles.structureTitle}>Keyless Schema Byte Array:</div>
                    <pre className={styles.structureCode}>
                      {JSON.stringify(schemaArray, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Language Port Tabs */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Unified API Design</h2>
              <p className={styles.sectionSubtitle}>
                BitSocket maintains a highly consistent developer experience across all ports, ensuring transition times are practically zero.
              </p>
            </div>

            <div className={styles.tabsContainer}>
              <button 
                className={clsx(styles.tabBtn, activeTab === 'node' && styles.tabBtnActive)} 
                onClick={() => setActiveTab('node')}
              >
                Node.js (JS/TS)
              </button>
              <button 
                className={clsx(styles.tabBtn, activeTab === 'go' && styles.tabBtnActive)} 
                onClick={() => setActiveTab('go')}
              >
                Go (Golang)
              </button>
              <button 
                className={clsx(styles.tabBtn, activeTab === 'python' && styles.tabBtnActive)} 
                onClick={() => setActiveTab('python')}
              >
                Python (asyncio)
              </button>
            </div>

            <div className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span className={clsx(styles.circle, styles.circleRed)}></span>
                <span className={clsx(styles.circle, styles.circleYellow)}></span>
                <span className={clsx(styles.circle, styles.circleGreen)}></span>
                <span className={styles.fileName}>{codeSnippets[activeTab].file}</span>
              </div>
              <CodeBlock language={activeTab === 'node' ? 'javascript' : activeTab === 'go' ? 'go' : 'python'}>
                {codeSnippets[activeTab].code}
              </CodeBlock>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
