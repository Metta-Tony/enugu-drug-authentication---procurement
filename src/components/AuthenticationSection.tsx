import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Search, 
  QrCode, 
  FileText, 
  Printer, 
  History, 
  Building2, 
  Calendar, 
  Layers, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { DrugRecord, VerificationLog, VerificationStatus, RegionalLocation } from '../types';

interface AuthenticationSectionProps {
  drugs: DrugRecord[];
  currentLocation: RegionalLocation;
  onReportDrug: (drug?: Partial<DrugRecord>) => void;
  verificationLogs: VerificationLog[];
  onAddVerificationLog: (log: VerificationLog) => void;
}

export const AuthenticationSection: React.FC<AuthenticationSectionProps> = ({
  drugs,
  currentLocation,
  onReportDrug,
  verificationLogs,
  onAddVerificationLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pin' | 'nafdac' | 'batch'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [nafdacInput, setNafdacInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedRevealed, setScratchedRevealed] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: VerificationStatus;
    drug?: DrugRecord;
    checkedCode: string;
    checkType: 'MAS PIN' | 'NAFDAC Reg No' | 'Batch Scan';
    timestamp: string;
    notes: string;
  } | null>(null);

  // Helper to handle PIN check
  const handleVerifyPin = (codeToVerify?: string) => {
    const rawPin = (codeToVerify || pinInput).trim();
    if (!rawPin) return;

    // Search in database
    const normalizedInput = rawPin.replace(/[\s-]/g, '');
    const foundDrug = drugs.find(d => {
      if (!d.scratchPin) return false;
      return d.scratchPin.replace(/[\s-]/g, '') === normalizedInput;
    });

    let status: VerificationStatus = 'unregistered';
    let notes = '';

    if (foundDrug) {
      status = foundDrug.status;
      notes = foundDrug.statusMessage;
    } else {
      status = 'unregistered';
      notes = 'CRITICAL WARNING: The scratch PIN provided does not exist in the National Mobile Authentication Service (MAS) gateway. This medication may be counterfeit or unregistered.';
    }

    const result = {
      status,
      drug: foundDrug,
      checkedCode: rawPin,
      checkType: 'MAS PIN' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      notes
    };

    setVerificationResult(result);

    // Record log
    onAddVerificationLog({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      codeTested: rawPin,
      testType: 'MAS PIN',
      drugName: foundDrug ? foundDrug.brandName : 'Unknown / Unregistered Compound',
      batchNumber: foundDrug ? foundDrug.batchNumber : 'N/A',
      status,
      region: `${currentLocation.state} (${currentLocation.lga})`,
      verifierRole: 'Facility Pharmacist / Field Verifier'
    });
  };

  // Helper to handle NAFDAC Registration Number check
  const handleVerifyNafdac = (nafdacCode?: string) => {
    const rawCode = (nafdacCode || nafdacInput).trim();
    if (!rawCode) return;

    const normalized = rawCode.toLowerCase().replace(/[\s-]/g, '');
    const foundDrug = drugs.find(d => 
      d.nafdacRegNo.toLowerCase().replace(/[\s-]/g, '').includes(normalized) ||
      normalized.includes(d.nafdacRegNo.toLowerCase().replace(/[\s-]/g, ''))
    );

    let status: VerificationStatus = 'unregistered';
    let notes = '';

    if (foundDrug) {
      status = foundDrug.status;
      notes = foundDrug.statusMessage;
    } else {
      status = 'unregistered';
      notes = 'NAFDAC Number not found in the official registry database. Exercise high caution and report to the Enugu State Drug Directorate.';
    }

    const result = {
      status,
      drug: foundDrug,
      checkedCode: rawCode,
      checkType: 'NAFDAC Reg No' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      notes
    };

    setVerificationResult(result);

    onAddVerificationLog({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      codeTested: rawCode,
      testType: 'NAFDAC Reg No',
      drugName: foundDrug ? foundDrug.brandName : 'Unknown Registry Query',
      batchNumber: foundDrug ? foundDrug.batchNumber : 'N/A',
      status,
      region: `${currentLocation.state} (${currentLocation.lga})`,
      verifierRole: 'Regulatory Auditor'
    });
  };

  // Helper to handle Batch Scan check
  const handleVerifyBatch = (batchCode?: string) => {
    const rawBatch = (batchCode || batchInput).trim();
    if (!rawBatch) return;

    const normalized = rawBatch.toUpperCase().replace(/[\s-]/g, '');
    const foundDrug = drugs.find(d => 
      d.batchNumber.toUpperCase().replace(/[\s-]/g, '') === normalized
    );

    let status: VerificationStatus = 'unregistered';
    let notes = '';

    if (foundDrug) {
      status = foundDrug.status;
      notes = foundDrug.statusMessage;
    } else {
      status = 'suspicious';
      notes = 'Batch number not logged in the South-East Zonal distribution database. Trace of origin required.';
    }

    const result = {
      status,
      drug: foundDrug,
      checkedCode: rawBatch,
      checkType: 'Batch Scan' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      notes
    };

    setVerificationResult(result);

    onAddVerificationLog({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      codeTested: rawBatch,
      testType: 'Batch Scan',
      drugName: foundDrug ? foundDrug.brandName : 'Batch Not Found',
      batchNumber: rawBatch,
      status,
      region: `${currentLocation.state} (${currentLocation.lga})`,
      verifierRole: 'Hospital Receiving Staff'
    });
  };

  // Preset demo test buttons
  const loadPreset = (type: 'genuine' | 'counterfeit' | 'expired' | 'oxytocin') => {
    if (type === 'genuine') {
      const target = drugs.find(d => d.id === 'drug-001')!;
      setPinInput(target.scratchPin || '4892-1082-9931');
      setActiveSubTab('pin');
      setScratchedRevealed(true);
      handleVerifyPin(target.scratchPin);
    } else if (type === 'counterfeit') {
      const target = drugs.find(d => d.id === 'drug-008')!;
      setPinInput(target.scratchPin || '9999-0000-1111');
      setActiveSubTab('pin');
      setScratchedRevealed(true);
      handleVerifyPin(target.scratchPin);
    } else if (type === 'expired') {
      const target = drugs.find(d => d.id === 'drug-009')!;
      setPinInput(target.scratchPin || '1234-5678-9012');
      setActiveSubTab('pin');
      setScratchedRevealed(true);
      handleVerifyPin(target.scratchPin);
    } else if (type === 'oxytocin') {
      const target = drugs.find(d => d.id === 'drug-004')!;
      setPinInput(target.scratchPin || '9012-3344-1188');
      setActiveSubTab('pin');
      setScratchedRevealed(true);
      handleVerifyPin(target.scratchPin);
    }
  };

  const handleSimulateScratch = () => {
    setIsScratching(true);
    setTimeout(() => {
      setIsScratching(false);
      setScratchedRevealed(true);
      const samplePin = '4892-1082-9931';
      setPinInput(samplePin);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Gateway to NAFDAC Mobile Authentication Service (MAS)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Verify Pharmaceutical Authenticity in Seconds
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every year, counterfeit antimalarials and antibiotics enter the South East market through informal supply chains. 
              Use this official portal to authenticate scratch codes, confirm NAFDAC numbers, and cross-reference active batch recall bulletins across Enugu State and neighboring zones.
            </p>
          </div>

          {/* Quick Demo Test Presets */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[280px]">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Test Scenarios:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="preset-btn-genuine"
                onClick={() => loadPreset('genuine')}
                className="text-left px-2.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 text-xs font-medium transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Coartem (Genuine)</span>
                </div>
                <div className="text-[10px] text-slate-400">Novartis - Passed</div>
              </button>

              <button
                id="preset-btn-counterfeit"
                onClick={() => loadPreset('counterfeit')}
                className="text-left px-2.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 text-xs font-medium transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Amalar (Fake Alert)</span>
                </div>
                <div className="text-[10px] text-slate-400">Flagged in Ogbete</div>
              </button>

              <button
                id="preset-btn-expired"
                onClick={() => loadPreset('expired')}
                className="text-left px-2.5 py-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/80 text-amber-300 text-xs font-medium transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Ampiclox (Expired)</span>
                </div>
                <div className="text-[10px] text-slate-400">Past Shelf Life</div>
              </button>

              <button
                id="preset-btn-coldchain"
                onClick={() => loadPreset('oxytocin')}
                className="text-left px-2.5 py-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 border border-teal-800/80 text-teal-300 text-xs font-medium transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  <span>Oxytocin (Cold Chain)</span>
                </div>
                <div className="text-[10px] text-slate-400">Enugu Central Store</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Workspace & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Verification Methods (Tabs) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Sub Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
              <button
                id="subtab-pin"
                onClick={() => setActiveSubTab('pin')}
                className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'pin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>1. MAS Scratch PIN</span>
              </button>

              <button
                id="subtab-nafdac"
                onClick={() => setActiveSubTab('nafdac')}
                className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'nafdac'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>2. NAFDAC Reg Number</span>
              </button>

              <button
                id="subtab-batch"
                onClick={() => setActiveSubTab('batch')}
                className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'batch'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>3. Batch & Lot Scan</span>
              </button>
            </div>

            {/* Sub Tab 1: MAS Scratch PIN */}
            {activeSubTab === 'pin' && (
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="mas-pin-input" className="block text-sm font-bold text-slate-900 mb-1">
                    Enter 10 or 12-Digit MAS Scratch PIN
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    Scratch the silver panel on the back of your tablet blister or medicine packet to reveal the unique authentication PIN.
                  </p>
                  
                  <div className="relative flex items-center">
                    <input
                      id="mas-pin-input"
                      type="text"
                      placeholder="e.g. 4892-1082-9931"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyPin();
                      }}
                      className="w-full text-lg font-mono px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-300"
                    />
                    <button
                      id="submit-verify-pin-btn"
                      onClick={() => handleVerifyPin()}
                      disabled={!pinInput.trim()}
                      className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>

                {/* Simulated Scratch Card Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Virtual Scratch Panel Simulator
                    </span>
                    <span className="text-[11px] text-slate-500">Click to scratch & reveal demo PIN</span>
                  </div>

                  <div 
                    onClick={handleSimulateScratch}
                    className="cursor-pointer group relative overflow-hidden h-14 rounded-lg bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center transition-all hover:border-emerald-500 select-none shadow-inner"
                  >
                    {isScratching ? (
                      <span className="text-xs font-semibold text-slate-700 animate-pulse flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                        Scratching protective silver foil...
                      </span>
                    ) : scratchedRevealed ? (
                      <div className="text-center">
                        <span className="text-xs text-slate-500 block">REVEALED PIN:</span>
                        <span className="text-base font-mono font-bold tracking-widest text-emerald-900">
                          4892-1082-9931
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-bold group-hover:text-emerald-800">
                        <span>✦ SCRATCH HERE TO REVEAL 12-DIGIT MAS CODE ✦</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Standard protocol: Also verifiable via SMS by sending code to shortcode <strong>38353</strong> (Toll-Free across MTN, Airtel, Glo in Nigeria).
                  </p>
                </div>
              </div>
            )}

            {/* Sub Tab 2: NAFDAC Reg Number */}
            {activeSubTab === 'nafdac' && (
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="nafdac-reg-input" className="block text-sm font-bold text-slate-900 mb-1">
                    NAFDAC Registration Number (NRN)
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    Check if the registration number printed on the package (e.g., 04-8921, A4-4320, 04-1845) is licensed and approved for legal distribution in Nigeria.
                  </p>
                  
                  <div className="relative flex items-center">
                    <input
                      id="nafdac-reg-input"
                      type="text"
                      placeholder="e.g. 04-8921 or 04-1845"
                      value={nafdacInput}
                      onChange={(e) => setNafdacInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyNafdac();
                      }}
                      className="w-full text-base font-mono px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-300"
                    />
                    <button
                      id="submit-verify-nafdac-btn"
                      onClick={() => handleVerifyNafdac()}
                      disabled={!nafdacInput.trim()}
                      className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Search Registry
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    How to identify genuine NAFDAC numbers:
                  </div>
                  <p>
                    A genuine NAFDAC number contains 2 digits or a letter prefix (e.g. 04-, A4-, B4-) followed by a 4 or 5 digit registration sequence.
                  </p>
                </div>
              </div>
            )}

            {/* Sub Tab 3: Batch Recall & Lot Scan */}
            {activeSubTab === 'batch' && (
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="batch-number-input" className="block text-sm font-bold text-slate-900 mb-1">
                    Manufacturer Batch / Lot Number
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    Cross-reference the batch number printed on the packaging against active recall notices in the South East zone.
                  </p>
                  
                  <div className="relative flex items-center">
                    <input
                      id="batch-number-input"
                      type="text"
                      placeholder="e.g. F2094B, AG7819, CF-88902"
                      value={batchInput}
                      onChange={(e) => setBatchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyBatch();
                      }}
                      className="w-full text-base font-mono px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-300"
                    />
                    <button
                      id="submit-verify-batch-btn"
                      onClick={() => handleVerifyBatch()}
                      disabled={!batchInput.trim()}
                      className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Check Batch
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-500">Common test batches:</span>
                  <button 
                    onClick={() => { setBatchInput('F2094B'); handleVerifyBatch('F2094B'); }}
                    className="underline text-emerald-700 hover:text-emerald-900 font-mono"
                  >
                    F2094B (Genuine Coartem)
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => { setBatchInput('CF-88902'); handleVerifyBatch('CF-88902'); }}
                    className="underline text-rose-700 hover:text-rose-900 font-mono"
                  >
                    CF-88902 (Counterfeit Alert)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide & Safety Guidelines */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Guidelines for South East Pharmacies & Clinics
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Always check the tamper-evident holographic seal before dispensing to patients.</li>
              <li>Discard or quarantine any antimalarial where the scratch foil peels off too easily or reveals faded numbers.</li>
              <li>Cold-chain items (Oxytocin, Insulin, Hepatitis Vaccines) must be received with unbroken cold-box temperature indicators at Enugu depots.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Verification Outcome Display */}
        <div className="lg:col-span-6 space-y-6">
          {verificationResult ? (
            <div className={`rounded-2xl border-2 shadow-lg overflow-hidden transition-all ${
              verificationResult.status === 'genuine'
                ? 'bg-emerald-50/70 border-emerald-500'
                : verificationResult.status === 'counterfeit'
                ? 'bg-rose-50 border-rose-600 animate-pulse-subtle'
                : verificationResult.status === 'expired'
                ? 'bg-amber-50 border-amber-500'
                : 'bg-purple-50 border-purple-500'
            }`}>
              {/* Outcome Header Banner */}
              <div className={`px-6 py-4 flex items-center justify-between text-white ${
                verificationResult.status === 'genuine'
                  ? 'bg-emerald-700'
                  : verificationResult.status === 'counterfeit'
                  ? 'bg-rose-700'
                  : verificationResult.status === 'expired'
                  ? 'bg-amber-700'
                  : 'bg-purple-700'
              }`}>
                <div className="flex items-center gap-3">
                  {verificationResult.status === 'genuine' && <CheckCircle2 className="w-8 h-8 text-white" />}
                  {verificationResult.status === 'counterfeit' && <XCircle className="w-8 h-8 text-white animate-bounce" />}
                  {verificationResult.status === 'expired' && <AlertTriangle className="w-8 h-8 text-white" />}
                  {verificationResult.status === 'recalled' && <AlertTriangle className="w-8 h-8 text-white" />}
                  {verificationResult.status === 'unregistered' && <ShieldAlert className="w-8 h-8 text-white" />}

                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block">
                      Verification Certificate Result
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      {verificationResult.status === 'genuine' && 'AUTHENTIC & SAFE'}
                      {verificationResult.status === 'counterfeit' && 'CRITICAL: COUNTERFEIT DETECTED'}
                      {verificationResult.status === 'expired' && 'PRODUCT EXPIRED'}
                      {verificationResult.status === 'recalled' && 'RECALLED BATCH NOTICE'}
                      {verificationResult.status === 'unregistered' && 'UNREGISTERED COMPOUND'}
                    </h3>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] opacity-80 block">Verified At</span>
                  <span className="text-xs font-mono font-bold">{verificationResult.timestamp}</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-6 space-y-5">
                {/* Result Message Box */}
                <div className={`p-4 rounded-xl border text-sm font-medium ${
                  verificationResult.status === 'genuine'
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : verificationResult.status === 'counterfeit'
                    ? 'bg-white border-rose-300 text-rose-950 font-semibold'
                    : 'bg-white border-amber-200 text-amber-950'
                }`}>
                  {verificationResult.notes}
                </div>

                {/* Drug Details if matched */}
                {verificationResult.drug ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {verificationResult.drug.brandName}
                        </h4>
                        <p className="text-xs text-slate-600">
                          Generic: <span className="font-semibold text-slate-800">{verificationResult.drug.genericName}</span> ({verificationResult.drug.dosage})
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {verificationResult.drug.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">NAFDAC Reg No</span>
                        <span className="font-mono font-bold text-slate-800">{verificationResult.drug.nafdacRegNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">Batch / Lot #</span>
                        <span className="font-mono font-bold text-slate-800">{verificationResult.drug.batchNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">Expiry Date</span>
                        <span className={`font-mono font-bold ${verificationResult.status === 'expired' ? 'text-rose-600' : 'text-slate-800'}`}>
                          {verificationResult.drug.expDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">Manufacturer</span>
                        <span className="font-semibold text-slate-800">{verificationResult.drug.manufacturer}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">Origin</span>
                        <span className="font-medium text-slate-800">{verificationResult.drug.manufacturerCountry}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-medium">Storage Standard</span>
                        <span className="font-medium text-emerald-700">{verificationResult.drug.storageCondition}</span>
                      </div>
                    </div>

                    {/* Active Ingredients & Security Features */}
                    <div className="border-t border-slate-100 pt-3 text-xs space-y-2">
                      <div>
                        <span className="text-slate-400 font-medium">Active Ingredients (Assay): </span>
                        <span className="text-slate-800">{verificationResult.drug.activeIngredients}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Verified Security Markers: </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {verificationResult.drug.securityFeatures.map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                              ✓ {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-rose-200 text-xs text-rose-900">
                    <p className="font-semibold mb-1">Unregistered Drug Record</p>
                    <p>No matching pharmaceutical record was found in the authorized NAFDAC database for code: <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">{verificationResult.checkedCode}</code>.</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {verificationResult.status === 'counterfeit' || verificationResult.status === 'unregistered' || verificationResult.status === 'expired' ? (
                    <button
                      id="report-unregistered-drug-btn"
                      onClick={() => onReportDrug(verificationResult.drug || { brandName: 'Unknown Product', batchNumber: verificationResult.checkedCode })}
                      className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Submit Incident Report to NAFDAC SE</span>
                    </button>
                  ) : (
                    <button
                      id="print-certificate-btn"
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Verification Certificate</span>
                    </button>
                  )}

                  <button
                    id="clear-result-btn"
                    onClick={() => setVerificationResult(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium transition-colors"
                  >
                    Check Another Drug
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standby Card when no verification performed yet */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Awaiting Verification Query
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Enter a 12-digit scratch PIN, NAFDAC Registration Number, or batch lot on the left to review laboratory certification and distribution custody.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200/80 max-w-md mx-auto">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  System Verification Capabilities:
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>100% checks against NAFDAC Green Registry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Direct tracking to Enugu Central Medical Store & Emene Depot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>South East Zonal counterfeit alert database linkage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Recent Verification Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  Recent Regional Verification Activity
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">Live Activity Feed</span>
            </div>

            <div className="space-y-2.5">
              {verificationLogs.slice(0, 4).map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {log.status === 'genuine' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    ) : log.status === 'counterfeit' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">{log.drugName}</div>
                      <div className="text-[11px] text-slate-500">{log.region} • {log.verifierRole}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'genuine' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'counterfeit'
                        ? 'bg-rose-100 text-rose-800 font-black'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
