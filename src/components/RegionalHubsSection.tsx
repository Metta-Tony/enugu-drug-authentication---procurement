import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Award, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Truck,
  CheckCircle2
} from 'lucide-react';
import { DistributionHub, RegionalLocation } from '../types';

interface RegionalHubsSectionProps {
  hubs: DistributionHub[];
  currentLocation: RegionalLocation;
  onSelectHubRegion?: (state: string, lga: string) => void;
}

export const RegionalHubsSection: React.FC<RegionalHubsSectionProps> = ({
  hubs,
  currentLocation,
}) => {
  // Separate Enugu hubs from other South East hubs
  const enuguHubs = hubs.filter(h => h.state === 'Enugu');
  const otherHubs = hubs.filter(h => h.state !== 'Enugu');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 mb-2 inline-block">
              Accredited Distribution Network
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Enugu & South East Pharma Logistics Hubs
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              All wholesale medicines procured through this portal are held and dispatched exclusively through PCN-registered and NAFDAC-licensed storage facilities with continuous cold-chain verification.
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/80 p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Regulatory Chain of Custody</span>
            </div>
            <p className="text-slate-300">
              Zero tolerance for open-market grey imports. All depots inspected quarterly by NAFDAC Zonal Directorate.
            </p>
          </div>
        </div>
      </div>

      {/* Enugu State Dedicated Hubs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <h3 className="text-lg font-bold text-slate-900">
              Enugu State Central & Zonal Depots (Same-Day Express Dispatch)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            5 Registered Regional Hubs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enuguHubs.map((hub) => (
            <div
              key={hub.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm p-5 space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {hub.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {hub.name}
                    </h4>
                  </div>
                </div>

                {hub.coldChainCertified && (
                  <span className="p-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200" title="Certified Cold-Chain 2°C - 8°C Storage">
                    <ThermometerSnowflake className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{hub.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-slate-700 font-medium">Permit: {hub.nafdacPermitNo}</span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">Sup. Pharmacist: {hub.licensedPharmacist}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hub.operationalHours}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{hub.telephone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Truck className="w-3.5 h-3.5" />
                  To {currentLocation.lga}:
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {currentLocation.state === 'Enugu' ? '2 - 6 hrs' : '12 - 24 hrs'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neighboring South East State Nodes */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <h3 className="text-lg font-bold text-slate-900">
              Inter-State South East Supply Corridors (Anambra & Imo)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Cross-Border Regulated Wholesale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {otherHubs.map((hub) => (
            <div
              key={hub.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {hub.state} State • {hub.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {hub.name}
                  </h4>
                </div>
                {hub.coldChainCertified && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Cold Chain
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hub.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono">{hub.nafdacPermitNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hub.telephone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
