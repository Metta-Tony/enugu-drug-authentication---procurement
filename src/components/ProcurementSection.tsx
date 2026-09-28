import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ThermometerSnowflake, 
  MapPin, 
  FileCheck, 
  Clock, 
  Package, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { DrugRecord, RegionalLocation, CartItem } from '../types';

interface ProcurementSectionProps {
  drugs: DrugRecord[];
  currentLocation: RegionalLocation;
  cart: CartItem[];
  onAddToCart: (drug: DrugRecord, quantity: number) => void;
  onOpenCart: () => void;
  onInspectDrug: (drug: DrugRecord) => void;
}

export const ProcurementSection: React.FC<ProcurementSectionProps> = ({
  drugs,
  currentLocation,
  cart,
  onAddToCart,
  onOpenCart,
  onInspectDrug,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyColdChain, setOnlyColdChain] = useState(false);
  const [onlyEnuguStock, setOnlyEnuguStock] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Filter only genuine / purchasable drugs for procurement (exclude counterfeit alerts from orderable list)
  const procurableDrugs = drugs.filter(d => d.status === 'genuine');

  // Filter based on criteria
  const filteredDrugs = procurableDrugs.filter(drug => {
    const matchesSearch = 
      drug.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.activeIngredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.nafdacRegNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || drug.category === selectedCategory;
    const matchesColdChain = !onlyColdChain || drug.storageCondition.includes('Cold Chain');
    const matchesEnuguStock = !onlyEnuguStock || drug.verifiedInEnuguDepot;

    return matchesSearch && matchesCategory && matchesColdChain && matchesEnuguStock;
  });

  const categories = ['All', 'Antimalarial', 'Antibiotic', 'Maternal Health', 'Emergency Care', 'Antidiabetic', 'Cardiovascular'];

  const handleQtyChange = (drugId: string, minQty: number, delta: number) => {
    const current = quantities[drugId] || minQty;
    const next = Math.max(minQty, current + delta);
    setQuantities(prev => ({ ...prev, [drugId]: next }));
  };

  const getDrugQty = (drug: DrugRecord) => {
    return quantities[drug.id] || drug.minOrderQty;
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Institutional Procurement Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Truck className="w-4 h-4" />
              <span>Direct Regulated Supply Chain • South East Zonal Hub</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Institutional Drug Procurement & Wholesale Requisition
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Procure directly from accredited pharmaceutical depots, Central Medical Stores, and licensed manufacturers in Enugu. All consignments are guaranteed 100% NAFDAC-certified with cold-chain provenance.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Delivery Zone:</span>
              <strong className="text-white">{currentLocation.state} ({currentLocation.lga})</strong>
            </div>
            <div className="text-slate-400">
              Estimated Delivery Speed: <strong className="text-emerald-400">{currentLocation.deliveryTimeEstimate}</strong>
            </div>
            <div className="text-slate-400">
              Hub Node: <span className="text-slate-200">{currentLocation.majorHub}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="procurement-search-input"
              type="text"
              placeholder="Search by brand name (e.g. Coartem), generic (Artemether), or NAFDAC #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm outline-none transition-all"
            />
          </div>

          {/* Quick Toggle Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button
              id="filter-cold-chain-btn"
              onClick={() => setOnlyColdChain(!onlyColdChain)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer ${
                onlyColdChain 
                  ? 'bg-teal-50 border-teal-500 text-teal-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-600" />
              <span>Cold Chain (2°C-8°C)</span>
            </button>

            <button
              id="filter-enugu-depot-btn"
              onClick={() => setOnlyEnuguStock(!onlyEnuguStock)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer ${
                onlyEnuguStock 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enugu Depot Instant Stock</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrugs.map((drug) => {
          const qty = getDrugQty(drug);
          const itemTotal = drug.unitPriceNGN * qty;
          const isColdChain = drug.storageCondition.includes('Cold Chain');

          return (
            <div
              key={drug.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    NAFDAC: {drug.nafdacRegNo}
                  </span>

                  {isColdChain ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 flex items-center gap-1">
                      <ThermometerSnowflake className="w-3 h-3 text-teal-600" />
                      Cold Chain 2-8°C
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {drug.category}
                    </span>
                  )}
                </div>

                {/* Title & Generic Name */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                    {drug.brandName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {drug.genericName} • {drug.dosage}
                  </p>
                </div>

                {/* Formulation & Pack details */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pack Presentation:</span>
                    <span className="font-semibold text-slate-800">{drug.packSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Batch / Expiry:</span>
                    <span className="font-mono text-slate-800">{drug.batchNumber} (Exp: {drug.expDate})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distributor Depot:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[170px]" title={drug.supplierName}>
                      {drug.supplierName}
                    </span>
                  </div>
                </div>

                {/* Stock & Origin */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {drug.availableStock.toLocaleString()} packs in stock
                  </span>
                  <span>MOQ: {drug.minOrderQty} packs</span>
                </div>
              </div>

              {/* Card Footer: Price & Quantity Controls */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Unit Price</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {formatNaira(drug.unitPriceNGN)}
                    </span>
                  </div>

                  {/* Quantity Incrementor */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-1">
                    <button
                      id={`qty-minus-${drug.id}`}
                      onClick={() => handleQtyChange(drug.id, drug.minOrderQty, -5)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-xs text-slate-900">
                      {qty}
                    </span>
                    <button
                      id={`qty-plus-${drug.id}`}
                      onClick={() => handleQtyChange(drug.id, drug.minOrderQty, 5)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id={`inspect-drug-btn-${drug.id}`}
                    onClick={() => onInspectDrug(drug)}
                    className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="View Certificate of Analysis"
                  >
                    <FileCheck className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    id={`add-to-cart-btn-${drug.id}`}
                    onClick={() => onAddToCart(drug, qty)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add {qty} packs ({formatNaira(itemTotal)})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrugs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No matching medicines found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or clear your category and cold chain filters.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setOnlyColdChain(false); setOnlyEnuguStock(false); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
