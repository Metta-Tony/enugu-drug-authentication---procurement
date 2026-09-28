import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Building2,
  PhoneCall
} from 'lucide-react';
import { DrugRecord, RegionalLocation, RegionState } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: RegionalLocation;
  prefillDrug?: Partial<DrugRecord>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  prefillDrug
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [drugName, setDrugName] = useState(prefillDrug?.brandName || '');
  const [batchNumber, setBatchNumber] = useState(prefillDrug?.batchNumber || '');
  const [nafdacNo, setNafdacNo] = useState(prefillDrug?.nafdacRegNo || '');
  const [vendorName, setVendorName] = useState('Stall #42, Ogbete Main Market, Enugu');
  const [selectedState, setSelectedState] = useState<RegionState>(currentLocation.state);
  const [selectedLga, setSelectedLga] = useState(currentLocation.lga);
  const [reason, setReason] = useState('Failed scratch PIN test / Falsified packaging & missing holographic seal');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reportCaseId, setReportCaseId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = `NAFDAC-SE-REP-${Math.floor(10000 + Math.random() * 90000)}`;
    setReportCaseId(caseId);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-lg w-full my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="text-base font-bold">Report Suspicious or Counterfeit Drug</h3>
              <p className="text-xs text-rose-200">NAFDAC South-East Enforcement Directorate</p>
            </div>
          </div>
          <button
            id="close-report-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Incident Successfully Lodged</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your report has been securely transmitted to the NAFDAC Zonal Enforcement Unit (Enugu Office, Federal Secretariat Complex). An inspection team will be dispatched if multiple flags occur at this location.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block text-xs">
              <span className="text-slate-400 block">Incident Case Tracking ID:</span>
              <strong className="font-mono text-emerald-700 text-sm">{reportCaseId}</strong>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
              Information provided here helps protect patients across Enugu and the South East. Whistleblower identity is treated with strict confidentiality under Nigerian pharmacovigilance laws.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Suspected Drug Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Falsified Coartem, Amalar, Fake Augmentin..."
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  placeholder="e.g. CF-88902"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NAFDAC Number on Pack</label>
                <input
                  type="text"
                  placeholder="e.g. 04-9981"
                  value={nafdacNo}
                  onChange={(e) => setNafdacNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">State in South East *</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as RegionState)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                >
                  <option value="Enugu">Enugu State</option>
                  <option value="Anambra">Anambra State</option>
                  <option value="Imo">Imo State</option>
                  <option value="Abia">Abia State</option>
                  <option value="Ebonyi">Ebonyi State</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City / LGA Zone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enugu North / Ogbete / Nsukka"
                  value={selectedLga}
                  onChange={(e) => setSelectedLga(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Purchase Stall, Vendor, or Pharmacy Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Line 3 Stall 14, Ogbete Market / Chemist near Abakpa Junction"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Reason for Suspicion *</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                  placeholder="Failed scratch PIN, suspicious foil, adverse clinical effect, etc."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reporter Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Keep blank for anonymous report"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+234..."
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                Submit Alert to NAFDAC SE
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
