import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Printer, 
  FileCheck2, 
  Clock, 
  Plus, 
  Minus,
  AlertCircle
} from 'lucide-react';
import { CartItem, RegionalLocation, ProcurementOrder } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentLocation: RegionalLocation;
  onUpdateQuantity: (drugId: string, delta: number) => void;
  onRemoveItem: (drugId: string) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  currentLocation,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<'review' | 'confirmed'>('review');
  const [institutionName, setInstitutionName] = useState('ESUT Teaching Hospital Parklane');
  const [institutionType, setInstitutionType] = useState<'Teaching Hospital' | 'General Hospital' | 'Community Pharmacy' | 'Primary Health Center' | 'Clinic'>('Teaching Hospital');
  const [customAddress, setCustomAddress] = useState('Parklane Road, GRA, Enugu North LGA, Enugu State');
  const [contactName, setContactName] = useState('Pharm. K. C. Nwankwo');
  const [contactPhone, setContactPhone] = useState('+234 803 555 1290');
  const [pcnLicense, setPcnLicense] = useState('PCN/RN/09214');
  const [paymentMethod, setPaymentMethod] = useState<ProcurementOrder['paymentMethod']>('Bank Transfer');
  const [confirmedOrder, setConfirmedOrder] = useState<ProcurementOrder | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.drug.unitPriceNGN * item.quantity), 0);
  const totalPacks = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const popularEnuguFacilities = [
    { name: 'ESUT Teaching Hospital Parklane', address: 'Parklane Road, GRA, Enugu North LGA', type: 'Teaching Hospital' as const },
    { name: 'UNTH Ituku-Ozalla Main Campus', address: 'Enugu-Port Harcourt Expressway, Ituku-Ozalla', type: 'Teaching Hospital' as const },
    { name: 'Bishop Shanahan Specialist Hospital', address: 'University Road, Nsukka Central, Enugu State', type: 'General Hospital' as const },
    { name: 'National Orthopaedic Hospital Enugu', address: 'Abakaliki Road, Trans-Ekulu, Enugu East', type: 'Teaching Hospital' as const },
    { name: 'Mother of Christ Hospital', address: 'Ogui Road, Enugu Urban, Enugu North', type: 'General Hospital' as const },
    { name: 'Oji River General Hospital', address: 'Old Enugu-Onitsha Road, Oji River LGA', type: 'General Hospital' as const },
    { name: 'New Haven Community Pharmacy', address: 'Chime Avenue, New Haven, Enugu', type: 'Community Pharmacy' as const }
  ];

  const handleSelectFacility = (fac: typeof popularEnuguFacilities[0]) => {
    setInstitutionName(fac.name);
    setCustomAddress(fac.address);
    setInstitutionType(fac.type);
  };

  const handleConfirmRequisition = () => {
    const sealCode = `SE-SEAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: ProcurementOrder = {
      orderId: `EN-ORD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      institutionName,
      institutionType,
      deliveryState: currentLocation.state,
      deliveryLGA: currentLocation.lga,
      deliveryAddress: customAddress,
      contactPerson: `${contactName} (${pcnLicense})`,
      contactPhone,
      paymentMethod,
      paymentStatus: 'Pending',
      items: cart.map(i => ({
        drugId: i.drug.id,
        brandName: i.drug.brandName,
        genericName: i.drug.genericName,
        quantity: i.quantity,
        unitPrice: i.drug.unitPriceNGN,
        totalPrice: i.drug.unitPriceNGN * i.quantity,
        batchNumber: i.drug.batchNumber,
        nafdacRegNo: i.drug.nafdacRegNo
      })),
      totalAmountNGN: totalAmount,
      orderStatus: 'Confirmed',
      tamperSealCode: sealCode,
      estimatedArrival: `${currentLocation.deliveryTimeEstimate} (Same-Day Express Dispatch)`
    };

    setConfirmedOrder(newOrder);
    setStep('confirmed');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">
                {step === 'review' ? 'Institutional Wholesale Procurement Requisition' : 'Verified Purchase Order & Dispatch Note'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 'review' ? `Regional Target: ${currentLocation.state} (${currentLocation.lga})` : 'Dispatched with Anti-Tamper Security Seal'}
              </p>
            </div>
          </div>
          <button
            id="close-cart-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'review' ? (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">Your procurement requisition is empty</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse the catalog in Section 2 to add NAFDAC-verified pharmaceutical packs to your order.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Browse Drug Catalog
                </button>
              </div>
            ) : (
              <>
                {/* Requisition Item Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Selected Medicines ({cart.length} line items, {totalPacks} total packs)
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {cart.map((item) => (
                      <div key={item.drug.id} className="p-3.5 bg-white flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-sm">{item.drug.brandName}</div>
                          <div className="text-slate-500">{item.drug.genericName} • NAFDAC: {item.drug.nafdacRegNo}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Batch: {item.drug.batchNumber} • Depot: {item.drug.supplierName}</div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.drug.id, -5)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center font-mono font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.drug.id, 5)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-mono font-bold text-slate-900 block">
                            {formatNaira(item.drug.unitPriceNGN * item.quantity)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatNaira(item.drug.unitPriceNGN)} / pack
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.drug.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Facility Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Receiving Healthcare Facility in Enugu / South East
                    </span>
                  </div>

                  {/* Preset Quick Selectors */}
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                      Quick select accredited facility in Enugu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularEnuguFacilities.map((fac, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectFacility(fac)}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                            institutionName === fac.name
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {fac.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Facility Name
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Institution Type
                      </label>
                      <select
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Teaching Hospital">Teaching Hospital</option>
                        <option value="General Hospital">General Hospital</option>
                        <option value="Community Pharmacy">Licensed Community Pharmacy</option>
                        <option value="Primary Health Center">Primary Health Center (PHC)</option>
                        <option value="Clinic">Specialist Private Clinic</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Physical Delivery Address
                      </label>
                      <input
                        type="text"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Receiving Pharmacist Name
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        PCN License / Hospital Reg #
                      </label>
                      <input
                        type="text"
                        value={pcnLicense}
                        onChange={(e) => setPcnLicense(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Method</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Choose how your facility will settle this requisition.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { value: 'Bank Transfer', detail: 'Settle by bank transfer' },
                      { value: 'Institutional Invoice', detail: 'Bill to your institution' },
                      { value: 'Pay on Delivery', detail: 'Settle when delivered' }
                    ] as const).map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === option.value
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          value={option.value}
                          checked={paymentMethod === option.value}
                          onChange={() => setPaymentMethod(option.value)}
                          className="mt-0.5 accent-emerald-600"
                        />
                        <span>
                          <span className="block text-xs font-semibold text-slate-800">{option.value}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">{option.detail}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">Payment is not collected here. Your selected method will be included with the requisition for supplier follow-up.</p>
                </div>

                {/* Total & Confirmation */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">{formatNaira(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Zonal Dispatch to {currentLocation.lga} ({currentLocation.deliveryTimeEstimate})
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">Complimentary Regulatory Dispatch</span>
                  </div>
                  <div className="flex justify-between items-center text-base border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-900">Total Procurement Requisition</span>
                    <span className="font-mono font-black text-xl text-emerald-700">{formatNaira(totalAmount)}</span>
                  </div>

                  <button
                    id="submit-procurement-requisition-btn"
                    onClick={handleConfirmRequisition}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Authorize & Issue Official Dispatch Order</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Confirmation & Dispatch Certificate View */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {confirmedOrder && (
              <div className="space-y-5">
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">
                    Procurement Order Authorized & Confirmed
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Order Ref: <span className="font-mono font-bold">{confirmedOrder.orderId}</span> • Dispatched through Enugu Central Pharma Network
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-300 font-mono text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Tamper-Evident Seal Code: {confirmedOrder.tamperSealCode}
                    </span>
                  </div>
                </div>

                {/* Printable Manifest */}
                <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-3 bg-white">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-slate-400 block font-medium">Consignee</span>
                      <strong className="text-slate-900 text-sm">{confirmedOrder.institutionName}</strong>
                      <div className="text-slate-500">{confirmedOrder.deliveryAddress}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block font-medium">Officer in Charge</span>
                      <strong className="text-slate-900">{confirmedOrder.contactPerson}</strong>
                      <div className="text-slate-500">{confirmedOrder.contactPhone}</div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Manifest of Authenticated Drugs:</span>
                    <ul className="space-y-1">
                      {confirmedOrder.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between py-1 border-b border-slate-50">
                          <span>{item.quantity}x {item.brandName} ({item.genericName}) — Batch: {item.batchNumber}</span>
                          <span className="font-mono font-bold text-slate-800">{formatNaira(item.totalPrice)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 font-bold text-sm text-slate-900">
                    <span>Total Consignment Value</span>
                    <span className="font-mono text-emerald-700">{formatNaira(confirmedOrder.totalAmountNGN)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Payment</span>
                    <span className="text-right font-semibold text-slate-800">
                      {confirmedOrder.paymentMethod} · {confirmedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Dispatch Waybill</span>
                  </button>

                  <button
                    onClick={() => {
                      setStep('review');
                      onClose();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    Return to Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
