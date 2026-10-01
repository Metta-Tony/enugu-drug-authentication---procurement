import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ShoppingCart, 
  PhoneCall, 
  Building2, 
  AlertTriangle,
  FileCheck2,
  ChevronDown
} from 'lucide-react';
import { RegionalLocation, RegionState } from '../types';

interface HeaderProps {
  currentLocation: RegionalLocation;
  onLocationChange: (location: RegionalLocation) => void;
  availableLocations: RegionalLocation[];
  activeTab: 'verify' | 'procure' | 'network' | 'alerts';
  setActiveTab: (tab: 'verify' | 'procure' | 'network' | 'alerts') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onLocationChange,
  availableLocations,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenReportModal
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);

  // Group locations by state
  const enuguLocations = availableLocations.filter(loc => loc.state === 'Enugu');
  const otherSELocations = availableLocations.filter(loc => loc.state !== 'Enugu');

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Advisory Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              NAFDAC MAS & PCN Compliant
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-slate-300 font-medium">South East Zonal Pharmaceutical Verification & Logistics Corridor</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              id="header-report-btn"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Counterfeit Drug</span>
            </button>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Enugu Zonal Hotlines: <strong>+234-803-342-1980</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Regional Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-950/40 border border-emerald-400/30">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>PharmaVerify</span>
                    <span className="text-emerald-400 font-normal text-sm px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                      Enugu & South East
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time Anti-Counterfeit Drug Authentication & Hospital Bulk Procurement
                </p>
              </div>
            </div>

            {/* Mobile Cart Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                id="mobile-cart-button"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                aria-label="View procurement requisition"
              >
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Regional Selector & Actions */}
          <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
            
            {/* Region / LGA Selector Dropdown */}
            <div className="relative">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Selected Procurement & Verification Zone:</span>
              </div>
              <button
                id="region-selector-toggle"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 rounded-lg px-3.5 py-2 text-sm text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <div>
                  <span className="font-semibold text-white block">
                    {currentLocation.state}: <span className="text-emerald-300">{currentLocation.lga}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Lead time: {currentLocation.deliveryTimeEstimate} • Hub: {currentLocation.majorHub}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ml-2 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isLocationDropdownOpen && (
                <div className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-slate-950/60 flex items-center justify-between">
                    <span>Enugu State Zones (Priority Direct Hub)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Fast Dispatch</span>
                  </div>
                  {enuguLocations.map((loc, idx) => (
                    <button
                      key={`enugu-${idx}`}
                      id={`loc-option-enugu-${idx}`}
                      onClick={() => {
                        onLocationChange(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800 flex items-start justify-between border-b border-slate-800/50 transition-colors ${
                        currentLocation.lga === loc.lga ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{loc.lga}</div>
                        <div className="text-[11px] text-slate-400">{loc.majorHub}</div>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono font-medium ml-2">
                        {loc.deliveryTimeEstimate}
                      </span>
                    </button>
                  ))}

                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 mt-2">
                    Other South East States (Inter-State Route)
                  </div>
                  {otherSELocations.map((loc, idx) => (
                    <button
                      key={`se-${idx}`}
                      id={`loc-option-se-${idx}`}
                      onClick={() => {
                        onLocationChange(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800 flex items-start justify-between border-b border-slate-800/50 transition-colors ${
                        currentLocation.lga === loc.lga ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{loc.state} — {loc.lga}</div>
                        <div className="text-[11px] text-slate-400">{loc.majorHub}</div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        {loc.deliveryTimeEstimate}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Requisition Button */}
            <button
              id="desktop-cart-button"
              onClick={onOpenCart}
              className="hidden lg:inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-98"
            >
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              <span>Procurement Requisition</span>
              {cartCount > 0 ? (
                <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-mono">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              ) : (
                <span className="text-slate-900/70 text-xs font-normal">(0)</span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto scrollbar-none">
          <button
            id="nav-tab-verify"
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verify'
                ? 'bg-emerald-600 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Drug Authentication (Anti-Counterfeit)</span>
          </button>

          <button
            id="nav-tab-procure"
            onClick={() => setActiveTab('procure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'procure'
                ? 'bg-emerald-600 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. Drug Catalog & Procurement</span>
          </button>

          <button
            id="nav-tab-network"
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'network'
                ? 'bg-emerald-600 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>3. Enugu & South East Depots</span>
          </button>

          <button
            id="nav-tab-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-emerald-600 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>4. NAFDAC SE Recalls & Alerts</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
