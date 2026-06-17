import { useState, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { Sidebar } from './components/Sidebar';
import { Content } from './components/Content';
import docsData from './data/docs.json';

function App() {
  const versions = useMemo(() => docsData.map((d) => d.version), []);
  const latestVersion = useMemo(() => docsData.find((d) => d.isLatest)?.version || versions[0], [versions]);
  
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);
  const [activeSection, setActiveSection] = useState('');

  const currentDocs = useMemo(() => 
    docsData.find((d) => d.version === selectedVersion) || docsData[0],
  [selectedVersion]);

  return (
    <div className="bg-[#09090b] min-h-screen selection:bg-blue-500/30 text-white overflow-x-clip">
      <TopBar 
        versions={versions}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
      />
      
      <Hero />
      
      <div id="docs" className="max-w-7xl mx-auto px-6 py-24 flex gap-12 items-start">
        <Sidebar features={currentDocs.features} activeSection={activeSection} />
        
        <div className="flex-1 min-w-0">
          <Content 
            features={currentDocs.features}
            onSectionVisible={setActiveSection}
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/10 text-center text-slate-500">
        <p>Built with Fastify, Socket.IO, and Love</p>
      </footer>
    </div>
  );
}

export default App;
