import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileWarning, 
  CheckCircle2, 
  ExternalLink, 
  MapPin, 
  Eye, 
  XOctagon,
  PhoneCall
} from 'lucide-react';
import { REGIONAL_ALERTS } from '../data/mockData';

interface AlertsSectionProps {
  onOpenReportModal: () => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ onOpenReportModal }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-rose-950 text-white rounded-2xl p-6 border border-rose-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>NAFDAC South-East Zonal Pharmacovigilance & Recall Center</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Active Regional Counterfeit Alerts & Public Warnings
            </h2>
            <p className="text-rose-100/90 text-sm mt-1 max-w-2xl">
              Real-time notices issued by the Directorate of Inspection and Enforcement for Enugu, Anambra, Imo, Abia, and Ebonyi States.
            </p>
          </div>

          <button
            id="report-from-alerts-btn"
            onClick={onOpenReportModal}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Suspicious Medicine</span>
          </button>
        </div>
      </div>

      {/* Active Bulletins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
              <XOctagon className="w-3.5 h-3.5 text-rose-600" />
              CRITICAL COUNTERFEIT ALERT
            </span>
            <span className="text-xs text-slate-400 font-mono">Bulletin #NAFDAC/SE/2024/09</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Falsified Artemether + Lumefantrine (Batch CF-88902)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified circulating in informal market stalls around Ogbete Main Market (Enugu) and Onitsha Bridgehead line.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-950 space-y-2">
            <div className="font-semibold text-rose-900">Laboratory Assay Findings:</div>
            <p className="leading-relaxed">
              HPLC chemical testing revealed <strong>0.0% active pharmaceutical ingredient (API)</strong>. The tablets are composed of chalk and binding starch. Use in severe malaria carries acute risk of mortality.
            </p>
            <div className="pt-1 text-[11px] text-rose-800">
              <strong>Distinguishing Visual Defects:</strong> The silver scratch foil is thin paper replica with no green holographic NAFDAC logo. Typography on the blister foil is misaligned and easily scratches off with fingernail.
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-rose-700">
              <MapPin className="w-3.5 h-3.5" />
              Target: Enugu & South East Region
            </span>
            <span className="font-semibold text-slate-700">Action: Immediate Quarantine & Seizure</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <FileWarning className="w-3.5 h-3.5 text-amber-600" />
              REGULATORY RECALL ADVISORY
            </span>
            <span className="text-xs text-slate-400 font-mono">MoH/EN/PHARM/VOL.IV</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Substandard Pediatric Cough & Paracetamol Syrups Warning
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Warning against unauthorized uncertified liquid syrups lacking verified cold-chain and solvent safety certificates.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-950 space-y-2">
            <div className="font-semibold text-amber-900">Preventive Measures for Enugu Facilities:</div>
            <p className="leading-relaxed">
              All pediatric hospitals and patent medicine stores in Enugu North, Nsukka, and Awgu are instructed to source syrups strictly through the Enugu Central Medical Store (CMS) or verified primary manufacturer depots.
            </p>
            <div className="pt-1 text-[11px] text-amber-800">
              <strong>Mandatory Protocol:</strong> Reject any syrup formulation delivered without batch Certificate of Analysis (CoA) certifying absence of toxic glycols (Diethylene Glycol / Ethylene Glycol).
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-amber-700">
              <MapPin className="w-3.5 h-3.5" />
              Enugu State Health Directorate
            </span>
            <span className="font-semibold text-slate-700">Mandatory Inspection</span>
          </div>
        </div>
      </div>

      {/* Visual Identification Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>How to Spot Falsified & Counterfeit Medicines in South East Nigeria</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">1</span>
              <span>The NAFDAC Green Scratch PIN</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Genuine medications feature a scratch panel with security micro-text underneath. When scratched, the PIN should match the instant SMS response from 38353 or this web verification gateway.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</span>
              <span>Packaging & Foil Integrity</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Inspect for blurry logos, spelling mistakes in active ingredients (e.g. "Artemeter" instead of "Artemether"), and missing manufacturer physical addresses in Nigeria.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">3</span>
              <span>Pricing Red Flags</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Be alert to medications sold at 50% or more below the regulated wholesale depot price. Genuine ACTs like Coartem or Lonart cannot be legally procured below verified manufacturer cost.
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Hotline Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center border border-rose-500/40">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">NAFDAC South-East Zonal Directorate Enugu Office</div>
            <div className="text-xs text-slate-400">Federal Secretariat Complex, Independence Layout, Enugu</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Emergency Enforcement Line:</span>
          <span className="text-sm font-mono font-bold text-emerald-400">+234-803-342-1980 / 0800-NAFDAC</span>
        </div>
      </div>
    </div>
  );
};
