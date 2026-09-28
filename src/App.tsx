/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { AuthenticationSection } from './components/AuthenticationSection';
import { ProcurementSection } from './components/ProcurementSection';
import { RegionalHubsSection } from './components/RegionalHubsSection';
import { AlertsSection } from './components/AlertsSection';
import { CartModal } from './components/CartModal';
import { ReportModal } from './components/ReportModal';
import { CertificateModal } from './components/CertificateModal';
import { 
  REGIONAL_LOCATIONS, 
  INITIAL_DRUGS, 
  DISTRIBUTION_HUBS, 
  INITIAL_VERIFICATION_LOGS 
} from './data/mockData';
import { DrugRecord, RegionalLocation, CartItem, VerificationLog } from './types';
import { 
  ShieldCheck, 
  PhoneCall, 
  Building2, 
  HeartHandshake, 
  ExternalLink,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Region selection: defaults to Enugu State (Enugu North - Ogbete & GRA)
  const [currentLocation, setCurrentLocation] = useState<RegionalLocation>(REGIONAL_LOCATIONS[0]);
  const [activeTab, setActiveTab] = useState<'verify' | 'procure' | 'network' | 'alerts'>('verify');
  
  // Data state
  const [drugs, setDrugs] = useState<DrugRecord[]>(INITIAL_DRUGS);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>(INITIAL_VERIFICATION_LOGS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportPrefill, setReportPrefill] = useState<Partial<DrugRecord> | undefined>(undefined);
  const [inspectingDrug, setInspectingDrug] = useState<DrugRecord | null>(null);

  // Cart operations
  const handleAddToCart = (drug: DrugRecord, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find(item => item.drug.id === drug.id);
      if (existing) {
        return prev.map(item => 
          item.drug.id === drug.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { drug, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (drugId: string, delta: number) => {
    setCart((prev) => {
      return prev.map(item => {
        if (item.drug.id === drugId) {
          const newQty = Math.max(item.drug.minOrderQty, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (drugId: string) => {
    setCart(prev => prev.filter(item => item.drug.id !== drugId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenReportWithDrug = (drug?: Partial<DrugRecord>) => {
    setReportPrefill(drug);
    setIsReportOpen(true);
  };

  const handleAddVerificationLog = (log: VerificationLog) => {
    setVerificationLogs(prev => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentLocation={currentLocation}
        onLocationChange={setCurrentLocation}
        availableLocations={REGIONAL_LOCATIONS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReportModal={() => handleOpenReportWithDrug()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Tab 1: Anti-Counterfeit Verification Engine */}
        {activeTab === 'verify' && (
          <AuthenticationSection
            drugs={drugs}
            currentLocation={currentLocation}
            onReportDrug={handleOpenReportWithDrug}
            verificationLogs={verificationLogs}
            onAddVerificationLog={handleAddVerificationLog}
          />
        )}

        {/* Tab 2: Wholesale & Institutional Procurement */}
        {activeTab === 'procure' && (
          <ProcurementSection
            drugs={drugs}
            currentLocation={currentLocation}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onInspectDrug={(drug) => setInspectingDrug(drug)}
          />
        )}

        {/* Tab 3: Regional Hubs & Logistics Corridors */}
        {activeTab === 'network' && (
          <RegionalHubsSection
            hubs={DISTRIBUTION_HUBS}
            currentLocation={currentLocation}
          />
        )}

        {/* Tab 4: NAFDAC South East Recalls & Surveillance */}
        {activeTab === 'alerts' && (
          <AlertsSection
            onOpenReportModal={() => handleOpenReportWithDrug()}
          />
        )}

        {/* Regional Quick Bar for Enugu */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Enugu State Pharmaceutical Vigilance Desk
                </h4>
                <p className="text-xs text-slate-500">
                  Direct liaison with Directorate of Pharmaceutical Services, Ministry of Health, Enugu
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enugu Central Store: Online & Stocked</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Cold-Chain Fleet: 2°C - 8°C Verified</span>
              </div>
              <button
                onClick={() => handleOpenReportWithDrug()}
                className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold transition-colors cursor-pointer"
              >
                Report Rogue Vendor in Ogbete / Abakpa
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>PharmaVerify SE</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                National Agency for Food and Drug Administration and Control (NAFDAC) MAS integration portal and regulated procurement channel for healthcare facilities across Enugu State and the South East geopolitical zone.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-2.5">Enugu Distribution Hubs</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Enugu Central Medical Store, GRA</li>
                <li>• Emzor Regional Logistics, Emene Industrial Area</li>
                <li>• Fidson Healthcare Zonal Depot, New Haven</li>
                <li>• Juhel Complex, Independence Layout</li>
                <li>• Nsukka Zonal Medical Store, University Rd</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-2.5">Regulatory Standards</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Mobile Authentication Service (MAS) Shortcode 38353</li>
                <li>• Pharmacists Council of Nigeria (PCN) Premises Regulations</li>
                <li>• National Drug Distribution Guidelines (NDDG)</li>
                <li>• WHO Good Storage & Distribution Practices (GSDP)</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-2.5">Regional Emergency Contacts</h5>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enugu NAFDAC Zonal: +234 803 342 1980</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enugu Ministry of Health: +234 802 441 5560</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Federal Secretariat Complex, Independence Layout, Enugu State, Nigeria.
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <span>© 2026 PharmaVerify South East Nigeria • Certified Pharmaceutical Security Gateway</span>
            <span className="text-emerald-400 font-mono">
              Active Regional Zone: {currentLocation.state} ({currentLocation.lga}) • Express Corridor Online
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currentLocation={currentLocation}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        currentLocation={currentLocation}
        prefillDrug={reportPrefill}
      />

      <CertificateModal
        drug={inspectingDrug}
        onClose={() => setInspectingDrug(null)}
      />
    </div>
  );
}
