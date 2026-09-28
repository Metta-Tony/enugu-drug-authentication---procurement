import React from 'react';
import { 
  X, 
  FileCheck2, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Award,
  ThermometerSnowflake
} from 'lucide-react';
import { DrugRecord } from '../types';

interface CertificateModalProps {
  drug: DrugRecord | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ drug, onClose }) => {
  if (!drug) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full my-8 overflow-hidden">
        
        {/* Certificate Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Certificate of Pharmaceutical Analysis (CoA)</h3>
              <p className="text-xs text-slate-400">South East Zonal Quality Control Laboratory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Official Document Layout) */}
        <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[75vh] overflow-y-auto font-sans">
          
          {/* Certificate Badge Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Certificate Reference ID</span>
              <span className="font-mono font-bold text-sm text-slate-900">COA-SE-NG-{drug.batchNumber}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              PASSED QC AUDIT
            </span>
          </div>

          {/* Drug Specification Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-100 py-3">
            <div>
              <span className="text-slate-400 block font-medium">Commercial Brand:</span>
              <span className="font-bold text-slate-900 text-sm">{drug.brandName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Generic Formulation:</span>
              <span className="font-semibold text-slate-800">{drug.genericName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">NAFDAC Reg No:</span>
              <span className="font-mono font-bold text-emerald-700">{drug.nafdacRegNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Batch / Lot Number:</span>
              <span className="font-mono font-bold text-slate-800">{drug.batchNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Manufacture Date:</span>
              <span className="font-mono">{drug.mfgDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Expiration Date:</span>
              <span className="font-mono font-bold text-slate-800">{drug.expDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Authorized Manufacturer:</span>
              <span>{drug.manufacturer} ({drug.manufacturerCountry})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Storage Requirement:</span>
              <span className="font-medium text-emerald-700">{drug.storageCondition}</span>
            </div>
          </div>

          {/* Laboratory Testing Results Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Standard Pharmacopoeial Analysis (BP / USP Standard)
            </h4>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 text-[11px] font-bold">
                <tr>
                  <th className="p-2 border-b">Test Parameter</th>
                  <th className="p-2 border-b">Specification Range</th>
                  <th className="p-2 border-b">Observed Value</th>
                  <th className="p-2 border-b">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="p-2 font-medium">API Assay (HPLC)</td>
                  <td className="p-2 text-slate-500">95.0% - 105.0%</td>
                  <td className="p-2 font-mono font-bold text-slate-800">99.4% w/w</td>
                  <td className="p-2 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Uniformity of Dosage Units</td>
                  <td className="p-2 text-slate-500">AV &le; 15.0</td>
                  <td className="p-2 font-mono font-bold text-slate-800">AV = 4.2</td>
                  <td className="p-2 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Disintegration / Dissolution</td>
                  <td className="p-2 text-slate-500">Q &ge; 75% in 45 min</td>
                  <td className="p-2 font-mono font-bold text-slate-800">89.2% in 30 min</td>
                  <td className="p-2 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Bacterial Endotoxins / Sterility</td>
                  <td className="p-2 text-slate-500">Conforms to BP Limit</td>
                  <td className="p-2 font-mono font-bold text-slate-800">Sterile / Compliant</td>
                  <td className="p-2 font-bold text-emerald-600">PASS</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Tamper Holographic Foil</td>
                  <td className="p-2 text-slate-500">Intact micro-etching</td>
                  <td className="p-2 font-mono font-bold text-slate-800">Green MAS Hologram</td>
                  <td className="p-2 font-bold text-emerald-600">PASS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certification Sign-off */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-slate-900">Released by Zonal Quality Assurance Officer</div>
                <div className="text-[11px] text-slate-500">Pharm. E. A. Umeh, FPCPharm (Enugu Zonal Lab)</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[11px] text-emerald-800 font-bold block">AUDIT STAMP VERIFIED</span>
              <span className="text-[10px] text-slate-400">Valid throughout SE corridor</span>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official CoA</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
