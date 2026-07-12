import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentArea } from './components/Content/ContentArea';
import { LandingPage } from './components/Landing/LandingPage';
import { Footer } from './components/Footer/Footer';

// Dynamically load all JSON documentation datasets
const docsModules = import.meta.glob<{ default: any }>('./doc-data/*.json', { eager: true });
const allDocs = Object.values(docsModules).map((mod) => mod.default);

// Sort versions: isLatest at the top, then remaining descending
const sortedDocs = [...allDocs].sort((a, b) => {
  if (a.isLatest && !b.isLatest) return -1;
  if (!a.isLatest && b.isLatest) return 1;
  return b.version.localeCompare(a.version, undefined, { numeric: true, sensitivity: 'base' });
});

const defaultDoc = sortedDocs.find((doc) => doc.isLatest) || sortedDocs[0];
const defaultVersion = defaultDoc ? defaultDoc.version : '2.0.0';

const versionsList = sortedDocs.map((d) => ({
  version: d.version,
  isLatest: !!d.isLatest,
  isDeprecated: !!d.isDeprecated,
  title: d.title,
}));

export const App: React.FC = () => {
  const [version, setVersion] = useState<string>(defaultVersion);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'docs'>('home');

  // Active documentation selection
  const activeDocs = sortedDocs.find((d) => d.version === version) || defaultDoc;

  // Active Section & Item State with lazy initializers to prevent crashes on version load
  const [activeSectionId, setActiveSectionId] = useState<string>(() => activeDocs.sections[0].id);
  const [activeItemId, setActiveItemId] = useState<string>(() => {
    const firstItem = activeDocs.sections[0].items[0] as any;
    return firstItem.items ? firstItem.items[0].id : firstItem.id;
  });

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Adjust active items when version switcher triggers
  useEffect(() => {
    const sectionExists = activeDocs.sections.find((s: any) => s.id === activeSectionId);
    let itemExists = false;
    if (sectionExists) {
      for (const item of sectionExists.items as any[]) {
        if (item.id === activeItemId) {
          itemExists = true;
          break;
        }
        if (item.items) {
          if (item.items.some((sub: any) => sub.id === activeItemId)) {
            itemExists = true;
            break;
          }
        }
      }
    }

    if (!sectionExists || !itemExists) {
      setActiveSectionId(activeDocs.sections[0].id);
      const firstItem = activeDocs.sections[0].items[0] as any;
      const firstItemId = firstItem.items ? firstItem.items[0].id : firstItem.id;
      setActiveItemId(firstItemId);
    }
  }, [version, activeDocs]);

  // Handle sidebar & search clicks
  const handlePageChange = (sectionId: string, itemId: string) => {
    setActiveSectionId(sectionId);
    setActiveItemId(itemId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active section details
  const activeSection = activeDocs.sections.find((s: any) => s.id === activeSectionId) || activeDocs.sections[0];
  
  // Find active item, resolving nested sub-items
  let activeItem: any = null;
  for (const item of activeSection.items as any[]) {
    if (item.id === activeItemId) {
      activeItem = item;
      break;
    }
    if (item.items) {
      const subItem = item.items.find((sub: any) => sub.id === activeItemId);
      if (subItem) {
        activeItem = subItem;
        break;
      }
    }
  }
  if (!activeItem) {
    const firstItem = activeSection.items[0] as any;
    activeItem = firstItem.items ? firstItem.items[0] : firstItem;
  }

  // Flatten pages to support previous / next progression
  const flatPages: any[] = [];
  activeDocs.sections.forEach((section: any) => {
    section.items.forEach((item: any) => {
      if (item.items) {
        item.items.forEach((sub: any) => {
          flatPages.push({
            sectionId: section.id,
            sectionTitle: section.title,
            itemId: sub.id,
            itemTitle: sub.title,
          });
        });
      } else {
        flatPages.push({
          sectionId: section.id,
          sectionTitle: section.title,
          itemId: item.id,
          itemTitle: item.title,
        });
      }
    });
  });

  const currentIndex = flatPages.findIndex(
    (p) => p.sectionId === activeSectionId && p.itemId === activeItemId
  );

  const prevPage =
    currentIndex > 0
      ? {
          sectionId: flatPages[currentIndex - 1].sectionId,
          itemId: flatPages[currentIndex - 1].itemId,
          title: flatPages[currentIndex - 1].itemTitle,
        }
      : null;

  const nextPage =
    currentIndex < flatPages.length - 1
      ? {
          sectionId: flatPages[currentIndex + 1].sectionId,
          itemId: flatPages[currentIndex + 1].itemId,
          title: flatPages[currentIndex + 1].itemTitle,
        }
      : null;

  return (
    <div className={`${activeTab === 'docs' ? 'md:h-screen md:overflow-hidden min-h-screen' : 'min-h-screen'} bg-slate-50 dark:bg-mcp-dark text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200`}>
      
      {/* Navbar Header */}
      <Header
        version={version}
        setVersion={setVersion}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        sections={activeDocs.sections}
        onSelectResult={handlePageChange}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        versions={versionsList}
      />

      {/* Mobile Menu Drawer (Always mounted at root layout) */}
      <div className="md:hidden">
        <Sidebar
          sections={activeDocs.sections}
          activeItemId={activeItemId}
          activeSectionId={activeSectionId}
          onItemClick={handlePageChange}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          version={version}
          setVersion={setVersion}
          versions={versionsList}
        />
      </div>

      {/* Main Content Layout Switcher */}
      {activeTab === 'home' ? (
        <LandingPage
          onGoToDocs={() => {
            setActiveTab('docs');
            handlePageChange(activeDocs.sections[0].id, activeDocs.sections[0].items[0].id);
          }}
        />
      ) : (
        <div className="flex-grow flex w-full max-w-[90rem] mx-auto min-w-0 min-h-0">
          {/* Desktop Navigation Sidebar (Hidden on mobile) */}
          <Sidebar
            sections={activeDocs.sections}
            activeItemId={activeItemId}
            activeSectionId={activeSectionId}
            onItemClick={handlePageChange}
            mobileMenuOpen={false}
            setMobileMenuOpen={() => {}}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            version={version}
            setVersion={setVersion}
            versions={versionsList}
          />

          {/* Content Panel Area */}
          <ContentArea
            sectionTitle={activeSection.title}
            item={activeItem as any}
            prevPage={prevPage}
            nextPage={nextPage}
            onPageChange={handlePageChange}
            isVersionDeprecated={activeDocs.isDeprecated}
            versionDeprecationMessage={activeDocs.deprecationMessage}
            isItemDeprecated={activeItem?.isDeprecated}
            itemDeprecationMessage={activeItem?.deprecationMessage}
          />
        </div>
      )}

      {/* Shared Footer component */}
      <div className="shrink-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default App;
