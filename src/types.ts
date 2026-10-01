export type RegionState = 'Enugu' | 'Anambra' | 'Imo' | 'Abia' | 'Ebonyi';

export interface RegionalLocation {
  state: RegionState;
  lga: string;
  majorHub: string;
  deliveryTimeEstimate: string;
}

export type VerificationStatus = 
  | 'genuine' 
  | 'counterfeit' 
  | 'expired' 
  | 'recalled' 
  | 'unregistered' 
  | 'suspicious';

export interface DrugRecord {
  id: string;
  brandName: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Suspension' | 'Injectable' | 'Syrup' | 'IV Infusion';
  category: 'Antimalarial' | 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Maternal Health' | 'Emergency Care';
  nafdacRegNo: string;
  scratchPin?: string; // 10-12 digit MAS code
  manufacturer: string;
  manufacturerCountry: string;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  status: VerificationStatus;
  statusMessage: string;
  storageCondition: 'Room Temperature (< 30°C)' | 'Cold Chain (2°C - 8°C)' | 'Cool & Dry Place';
  packSize: string;
  unitPriceNGN: number;
  minOrderQty: number;
  availableStock: number;
  supplierName: string;
  supplierHub: string;
  supplierVerified: boolean;
  verifiedInEnuguDepot: boolean;
  description: string;
  activeIngredients: string;
  securityFeatures: string[];
}

export interface VerificationLog {
  id: string;
  timestamp: string;
  codeTested: string;
  testType: 'MAS PIN' | 'NAFDAC Reg No' | 'Batch Scan';
  drugName: string;
  batchNumber: string;
  status: VerificationStatus;
  region: string;
  verifierRole: string;
}

export interface CartItem {
  drug: DrugRecord;
  quantity: number;
}

export interface ProcurementOrder {
  orderId: string;
  timestamp: string;
  institutionName: string;
  institutionType: 'Teaching Hospital' | 'General Hospital' | 'Community Pharmacy' | 'Primary Health Center' | 'Clinic';
  deliveryState: RegionState;
  deliveryLGA: string;
  deliveryAddress: string;
  contactPerson: string;
  contactPhone: string;
  paymentMethod: 'Bank Transfer' | 'Institutional Invoice' | 'Pay on Delivery';
  paymentStatus: 'Pending';
  items: {
    drugId: string;
    brandName: string;
    genericName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    batchNumber: string;
    nafdacRegNo: string;
  }[];
  totalAmountNGN: number;
  orderStatus: 'Confirmed' | 'Dispatched' | 'In Cold-Chain Transit' | 'Delivered';
  tamperSealCode: string;
  estimatedArrival: string;
}

export interface CounterfeitReport {
  id: string;
  drugName: string;
  batchNumber: string;
  nafdacNumber: string;
  suspectedReason: string;
  purchaseLocation: string;
  state: RegionState;
  lga: string;
  vendorName: string;
  datePurchased: string;
  reporterName: string;
  reporterPhone: string;
  status: 'Investigating' | 'Flagged for Recall' | 'Report Submitted to NAFDAC SE';
}

export interface DistributionHub {
  id: string;
  name: string;
  category: 'Government Medical Store' | 'Zonal Pharma Depot' | 'Cold-Chain Logistics' | 'Accredited Wholesaler';
  address: string;
  lga: string;
  state: RegionState;
  licensedPharmacist: string;
  nafdacPermitNo: string;
  telephone: string;
  operationalHours: string;
  coldChainCertified: boolean;
  coordinates?: { lat: number; lng: number };
}
