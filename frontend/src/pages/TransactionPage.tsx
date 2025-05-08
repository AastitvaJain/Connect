import React, { useState, useRef } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import Button from '../components/Button';
import PropertyTable from '../components/PropertyTable';
import CostSheet from '../components/CostSheet';
import { Property, PaymentPlan } from '../types';
import { propertyData } from '../data/propertyData';
// import { getPropertiesByToken, searchNewProperties, sendRateApprovalRequest, getRateApprovalStatus, generateToken } from '../data/api';
import { newPropertyData } from '../data/newPropertyData';
import NewCustomerTransactionPage from './NewCustomerTransactionPage';
import { useReactToPrint } from 'react-to-print';

const TransactionPage: React.FC = () => {
  const { selectedProperties } = usePropertyContext();
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [tokenNumber, setTokenNumber] = useState('');
  const [oldProperties, setOldProperties] = useState<Property[]>(selectedProperties.length > 0 ? selectedProperties : []);
  const [newProject, setNewProject] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('standard');
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [chequeUTR, setChequeUTR] = useState('');
  const [selectedCP, setSelectedCP] = useState('');
  const [cpName, setCPName] = useState('');
  const [cpContact, setCPContact] = useState('');
  const [showCostSheet, setShowCostSheet] = useState(false);
  const [newProjectSearch, setNewProjectSearch] = useState('');
  const [newUnitNoSearch, setNewUnitNoSearch] = useState('');
  const [filteredInventory, setFilteredInventory] = useState<Property[]>([]);
  const [propertyPaymentPlans, setPropertyPaymentPlans] = useState<{ [propertyId: number]: PaymentPlan }>({});
  const [hasSearchedToken, setHasSearchedToken] = useState(false);

  // For dropdowns
  const projectOptions = Array.from(new Set(newPropertyData.map(p => p.projectName)));
  const [unitOptions, setUnitOptions] = useState<string[]>([]);

  // Add state for editable rates and approval requests
  const [editedOldRates, setEditedOldRates] = useState<{ [id: number]: number }>({});
  const [editedOldAssured, setEditedOldAssured] = useState<{ [id: number]: number }>({});
  const [editedNewRates, setEditedNewRates] = useState<{ [id: number]: number }>({});
  const [rateApprovalSent, setRateApprovalSent] = useState(false);
  const [rateApprovalMessage, setRateApprovalMessage] = useState<string>('');
  const [rateApprovalRequestId, setRateApprovalRequestId] = useState<string | null>(null);
  const [rateApprovalStatus, setRateApprovalStatus] = useState<string | null>(null);

  // New Customer state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerProperties, setNewCustomerProperties] = useState<Property[]>([]);
  const [newCustomerPaymentPlans, setNewCustomerPaymentPlans] = useState<{ [propertyId: number]: PaymentPlan }>({});
  const [showNewCustomerCostSheet, setShowNewCustomerCostSheet] = useState(false);

  // Helper for Old Unit Details table
  const oldFields = [
    { label: 'Project Name', get: (p: Property) => p.projectName },
    { label: 'Unit No.', get: (p: Property) => p.unitNo },
    { label: 'Area*', get: (p: Property) => p.superBuiltUpArea.toLocaleString() },
    { label: 'Rate', get: (p: Property) => p.rate.toLocaleString() },
    { label: 'Total Consideration(With Tax)”', get: (p: Property) => (p.superBuiltUpArea * p.rate).toLocaleString() },
    { label: 'Sell @ premium price', get: (p: Property) => (editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue).toLocaleString() },
    { label: 'Net Received(With Tax)', get: (p: Property) => p.netReceived.toLocaleString() },
    { label: 'Net Profit', get: (p: Property) => (((editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue) - p.rate) * p.superBuiltUpArea).toLocaleString() },
    { label: 'Buyback Value', get: (p: Property) => Math.round((editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue) * p.superBuiltUpArea).toLocaleString() },
  ];
  const paymentPlanOptions = [
    { value: '', label: 'Choose a plan' },
    { value: 'res1', label: 'Residential Option 1 (30:30:30:10)' },
    { value: 'res2', label: 'Residential Option 2 (10:90)' },
    { value: 'comm', label: 'Commercial (45:55)' },
  ];
  const newFields = [
    { label: 'Project Name', get: (p: Property) => p.projectName },
    { label: 'Unit No.', get: (p: Property) => p.unitNo },
    { label: 'Area*', get: (p: Property) => p.superBuiltUpArea.toLocaleString() },
    { label: 'Rate', get: (p: Property) => (editedNewRates[p.id] !== undefined ? editedNewRates[p.id] : p.rate).toLocaleString() },
    { label: 'Total Consideration(Without Tax)', get: (p: Property) => (p.superBuiltUpArea * (editedNewRates[p.id] !== undefined ? editedNewRates[p.id] : p.rate)).toLocaleString() },
    { label: 'Payment Plan', get: (p: Property) => propertyPaymentPlans[p.id] ? (paymentPlanOptions.find(opt => opt.value === propertyPaymentPlans[p.id])?.label || propertyPaymentPlans[p.id]) : '-' },
  ];

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } }',
  });

  const handleTokenSearch = async () => {
    setHasSearchedToken(true);
    if (!tokenNumber) {
      setOldProperties([]);
      return;
    }
    // const found = await getPropertiesByToken(tokenNumber);
    if (/* found && found.length > 0 */ false) {
      setOldProperties(/* found */ []);
    } else {
      setOldProperties([]);
      alert('Token not found');
    }
  };

  const handleAddNewProperty = () => {
    if (!newProject || !unitNo) {
      alert('Please select a project and unit number');
      return;
    }

    const newProperty: Property = {
      id: Date.now(),
      srNo: newProperties.length + 1,
      projectName: newProject,
      projectType: 'Residential',
      unitNo,
      customerName: oldProperties[0]?.customerName || '',
      superBuiltUpArea: 1665,
      rate: 10000,
      totalConsideration: 16650000,
      netReceived: 0,
      assuredValue: 0
    };

    setNewProperties([...newProperties, newProperty]);
    
    setNewProject('');
    setUnitNo('');
  };

  const handleRemoveNewProperty = (id: number) => {
    setNewProperties(newProperties.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    alert('Transaction submitted successfully');
  };

  const handlePrintQuote = () => {
    alert('Printing quote...');
  };

  const handleSearch = async () => {
    // const results = await searchNewProperties({ projectName: projectSearch, unitNo: unitNoSearch });
    setNewProperties([]);
  };

  // Update unit options when project changes
  React.useEffect(() => {
    if (newProjectSearch) {
      setUnitOptions(newPropertyData.filter(p => p.projectName === newProjectSearch).map(p => p.unitNo));
    } else {
      setUnitOptions([]);
    }
  }, [newProjectSearch]);

  // Reset filter when search fields are cleared
  React.useEffect(() => {
    if (!newProjectSearch && !newUnitNoSearch) {
      setFilteredInventory([]);
    }
  }, [newProjectSearch, newUnitNoSearch]);

  const printQuoteOnly = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // To restore event listeners and state
  };

  // 1. Add a utility to get unique customer names
  const uniqueCustomerNames = Array.from(new Set(oldProperties.map(p => p.customerName)));

  const handleGenerateToken = async () => {
    if (!newCustomerName || !newCustomerPhone || !newCustomerEmail) {
      window.alert('Please fill Name, Phone number, and Email before generating a token.');
      return;
    }
    if (oldProperties.length === 0) {
      window.alert('Please select at least one property to generate a token.');
      return;
    }
    // const token = await generateToken(oldProperties);
    setTokenNumber(/* token */ '');
    window.alert(`Token generated: ${/* token */ ''}`);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'existing' ? 'border-yellow-400 bg-yellow-100 text-yellow-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('existing')}
        >
          Existing Customer
        </button>
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'new' ? 'border-yellow-400 bg-yellow-100 text-yellow-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('new')}
        >
          New Customer
        </button>
      </div>
      {/* Existing Customer Flow */}
      {activeTab === 'existing' && (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* 1. Token Search Section */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6">
        <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">1. Search Existing Customer by Token</h2>
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-grow">
            <label htmlFor="tokenNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Token Number
            </label>
            <input
              type="text"
              id="tokenNumber"
              placeholder="Enter numbers only"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={tokenNumber}
              onChange={(e) => setTokenNumber(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <Button onClick={handleTokenSearch} className="px-4 text-base font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
          <Button
            type="button"
            onClick={() => {
              setTokenNumber('');
              setOldProperties([]);
              setHasSearchedToken(false);
            }}
            className="px-4 text-base font-semibold rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Clear
          </Button>
        </div>
        {oldProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
            <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {oldProperties.length > 1 && (
                    <th className="p-1 border text-center w-10 text-gray-500 text-xs" title="Deselect property">Selected</th>
                  )}
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Customer Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate* [all inc]</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration(With Tax) in Cr.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Sell @ premium price*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Net Profit (Cr.)</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Net Received(With Tax) in Cr.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {oldProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-blue-50 transition-colors">
                    {oldProperties.length > 1 && (
                      <td className="p-1 border text-center align-middle bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={true}
                          aria-label="Deselect property"
                          title="Deselect property"
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                          onChange={() => setOldProperties(oldProperties.filter(p => p.id !== property.id))}
                        />
                      </td>
                    )}
                    <td className="p-1 border align-middle">{property.projectName}</td>
                    <td className="p-1 border align-middle">{property.unitNo}</td>
                    <td className="p-1 border align-middle">{property.customerName}</td>
                    <td className="p-1 border align-middle">{property.superBuiltUpArea}</td>
                    <td className="p-1 border align-middle">{property.rate.toLocaleString()}</td>
                    <td className="p-1 border align-middle">{property.totalConsiderationInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-1 border align-middle">{property.sellAtPremiumPrice?.toLocaleString() ?? '-'}</td>
                    <td className="p-1 border align-middle">{property.netProfitInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-1 border align-middle">{property.netReceivedInCr?.toFixed(2) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          hasSearchedToken ? (
            <div className="text-center text-gray-500 py-8">No properties found for this token.</div>
          ) : null
        )}
      </div>

      {/* 2. New Property Search & Selection Section */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6">
        <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">2. Search and Select New Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="newProjectSearch" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <select
              id="newProjectSearch"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={newProjectSearch}
              onChange={e => {
                setNewProjectSearch(e.target.value);
                setNewUnitNoSearch('');
              }}
            >
              <option value="">All Projects</option>
              {projectOptions.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newUnitNoSearch" className="block text-sm font-medium text-gray-700 mb-1">Unit No</label>
            <select
              id="newUnitNoSearch"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={newUnitNoSearch}
              onChange={e => setNewUnitNoSearch(e.target.value)}
              disabled={!newProjectSearch}
            >
              <option value="">All Units</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
              <div className="md:col-span-2 flex justify-end items-end gap-2">
            <Button onClick={handleSearch} className="px-6 text-base font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                <Button
                  type="button"
                  onClick={() => {
                    setNewProjectSearch('');
                    setNewUnitNoSearch('');
                    setFilteredInventory([]);
                  }}
                  className="px-6 text-base font-semibold rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Reset
                </Button>
          </div>
        </div>
        {/* Inventory Table */}
        <div className="overflow-x-auto mb-6">
          <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
          <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="p-1 border text-center"></th>
                <th className="p-1 border text-left font-medium">Sr. No.</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Type</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate (inc. all)</th>
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration (With Tax)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {filteredInventory.map((property) => {
                const isSelected = newProperties.some(p => p.id === property.id);
                return (
                  <tr key={property.id} className="hover:bg-green-50">
                    <td className="p-1 border text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isSelected}
                        onChange={() => {
                          if (!isSelected) setNewProperties([...newProperties, property]);
                        }}
                      />
                    </td>
                    <td className="p-1 border">{property.srNo}</td>
                    <td className="p-1 border">{property.projectName}</td>
                    <td className="p-1 border">{property.projectType}</td>
                    <td className="p-1 border">{property.unitNo}</td>
                    <td className="p-1 border">{property.superBuiltUpArea}</td>
                    <td className="p-1 border">{property.rate.toLocaleString()}</td>
                    <td className="p-1 border">{property.totalConsideration.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="text-center text-gray-500 py-8">No properties found.</div>
          )}
        </div>
        {/* Selected New Properties Section */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg border border-green-200 p-4">
          <h3 className="text-base font-bold mb-2 text-green-900 tracking-wide border-b border-green-100 pb-2 bg-green-50 rounded-t px-2">Selected New Properties</h3>
          {newProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-1 border text-left font-medium">Sr. No.</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Type</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate (inc. all)</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration (With Tax)</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Payment Plan</th>
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-100">
                  {newProperties.map((property) => (
                    <tr key={property.id} className="bg-green-50 hover:bg-green-100">
                      <td className="p-1 border">{property.srNo}</td>
                      <td className="p-1 border">{property.projectName}</td>
                      <td className="p-1 border">{property.projectType}</td>
                      <td className="p-1 border">{property.unitNo}</td>
                      <td className="p-1 border">{property.superBuiltUpArea}</td>
                      <td className="p-1 border">{property.rate.toLocaleString()}</td>
                      <td className="p-1 border">{property.totalConsideration.toLocaleString()}</td>
                      <td className="p-1 border">
                        <select
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
                          value={propertyPaymentPlans[property.id] || ''}
                          onChange={e => setPropertyPaymentPlans(prev => ({ ...prev, [property.id]: e.target.value as PaymentPlan }))}
                        >
                          {paymentPlanOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1 border">
                        <button
                          onClick={() => setNewProperties(newProperties.filter(p => p.id !== property.id))}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No new properties selected.</div>
          )}
        </div>
      </div>

      {/* 3. Compute Cost Sheet Section */}
      {(oldProperties.length > 0 && newProperties.length > 0) && (
        <div ref={printRef} className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col items-center">
          <style>{`
            @media print {
              body { font-size: 10px !important; margin: 0.5cm; }
              .print-header h1 { font-size: 14px !important; }
              .print-header .text-lg { font-size: 11px !important; }
              .cost-sheet-print-title { font-size: 12px !important; font-weight: bold; }
              .avoid-break-inside { break-inside: avoid !important; page-break-inside: avoid !important; }
              .force-page-break { page-break-before: always !important; break-before: page !important; }
            }
          `}</style>
          {/* Print-only header */}
          <div className="hidden print:block w-full mb-6 text-center print-header">
            <h1 className="mb-2">Sales Print out format (Quote Only) - Draft</h1>
            <div className="text-lg font-medium mb-1">Token number: {tokenNumber || '-'}</div>
            <div className="text-lg font-medium mb-4">Customer name: {uniqueCustomerNames.join(', ') || '-'}</div>
          </div>
          {!showCostSheet ? (
            <Button
              onClick={() => setShowCostSheet(true)}
              className="bg-blue-600 hover:bg-blue-700 mb-4 text-lg px-8 py-3 text-white font-bold rounded"
              disabled={newProperties.some(p => !propertyPaymentPlans[p.id])}
            >
              Compute Cost Sheet
            </Button>
          ) : (
            <div className="w-full">
              {/* All cost sheets stacked below */}
              {newProperties.length > 0 && (
                <h4 className="text-base font-bold mb-2 text-blue-900 tracking-wide border-b border-blue-100 pb-1 bg-blue-50 rounded-t cost-sheet-print-title">
                  <span className="print:hidden">3. </span>Cost Sheet
                </h4>
              )}
              {oldProperties.length > 0 && (
                <div className="mb-4 bg-white rounded-lg shadow border border-gray-200 p-3 avoid-break-inside">
                  <h4 className="text-base font-bold mb-2 text-blue-900 tracking-wide border-b border-blue-100 pb-1 bg-blue-50 rounded-t">Old Unit Details</h4>
                  <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
                  <table className="min-w-full rounded overflow-hidden text-sm avoid-break-inside">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-1 border text-left font-medium">Field</th>
                        {oldProperties.map((p, idx) => (
                          <th key={p.id} className="p-1 border text-left font-medium">Prop {idx + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      {oldFields.map(field => (
                        <tr key={field.label}>
                          <td className="p-1 border font-semibold text-blue-800 bg-blue-50 whitespace-nowrap">{field.label}</td>
                          {oldProperties.map(p => (
                                <td key={p.id} className="p-1 border text-gray-700 whitespace-nowrap">
                                  {field.label === 'Sell @ premium price' ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue}
                                        onChange={e => {
                                          const val = parseInt(e.target.value, 10);
                                          setEditedOldAssured(r => {
                                            if (isNaN(val)) {
                                              const { [p.id]: _, ...rest } = r;
                                              return rest;
                                            }
                                            return { ...r, [p.id]: val };
                                          });
                                        }}
                                        onBlur={e => {
                                          const val = parseInt(e.target.value, 10);
                                          if (isNaN(val) || val < p.assuredValue) {
                                            alert('Change cannot be done: Assured Value can only be increased.');
                                            setEditedOldAssured(r => ({ ...r, [p.id]: p.assuredValue }));
                                          }
                                        }}
                                        disabled={rateApprovalSent}
                                      />
                                    </div>
                                  ) : (
                                    field.get(p)
                                  )}
                                </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Buy back price */}
                  <div className="mt-4 text-base font-semibold text-blue-900">
                    Total Buyback Value: {
                      Math.round(
                        oldProperties
                          .reduce((sum, p) => sum + ((editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue) * p.superBuiltUpArea), 0)
                      ).toLocaleString()
                    }
                  </div>
                </div>
              )}
              {/* New Unit Details Table with payment plan dropdowns */}
              {newProperties.length > 0 && (
                <div className="mb-4 bg-white rounded-lg shadow border border-green-200 p-3 avoid-break-inside">
                  <h4 className="text-base font-bold mb-2 text-green-900 tracking-wide border-b border-green-100 pb-1 bg-green-50 rounded-t">New Unit Details</h4>
                  <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
                  <table className="min-w-full rounded overflow-hidden text-sm avoid-break-inside">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="p-1 border text-left font-medium">Field</th>
                        {newProperties.map((p, idx) => (
                              <th key={p.id} className="p-1 border text-left font-medium">Prop {idx + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-100">
                      {newFields.map(field => (
                        <tr key={field.label}>
                          <td className="p-1 border font-semibold text-green-800 bg-green-50 whitespace-nowrap">{field.label}</td>
                          {newProperties.map(p => (
                                <td key={p.id} className="p-1 border text-gray-700 whitespace-nowrap">
                                  {field.label === 'Rate' ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={editedNewRates[p.id] !== undefined ? editedNewRates[p.id] : p.rate}
                                        min={0}
                                        onChange={e => {
                                          const val = parseInt(e.target.value, 10);
                                          setEditedNewRates(r => {
                                            if (isNaN(val)) {
                                              const { [p.id]: _, ...rest } = r;
                                              return rest;
                                            }
                                            return { ...r, [p.id]: val };
                                          });
                                        }}
                                        onBlur={e => {
                                          const val = parseInt(e.target.value, 10);
                                          if (isNaN(val) || val > p.rate) {
                                            alert('Change cannot be done: Rate can only be reduced.');
                                            setEditedNewRates(r => ({ ...r, [p.id]: p.rate }));
                                          }
                                        }}
                                        disabled={rateApprovalSent}
                                      />
                                    </div>
                                  ) : (
                                    field.get(p)
                                  )}
                                </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Mini section for Total New TCV and Upgrade Ratio */}
                  <div className="flex flex-col items-start mt-4 gap-2">
                    <div className="text-base font-semibold text-green-900">
                      Total New TCV: {
                        Math.round(
                          newProperties.reduce((sum, p) => sum + (editedNewRates[p.id] !== undefined ? editedNewRates[p.id] : p.rate) * p.superBuiltUpArea, 0)
                        ).toLocaleString()
                      }
                    </div>
                    <div className="text-base font-semibold text-blue-900 flex items-center gap-2">
                      <div className="relative group inline-block">
                        <span className="underline decoration-dotted cursor-help">
                          Upgrade Ratio
                        </span>
                        <div className="absolute left-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1 whitespace-nowrap">
                          Upgrade Ratio = Total New TCV / Total Buyback Value
                        </div>
                      </div>:
                      {(() => {
                        const totalNewTCV = newProperties.reduce((sum, p) => sum + (editedNewRates[p.id] !== undefined ? editedNewRates[p.id] : p.rate) * p.superBuiltUpArea, 0);
                        const totalBuyback = oldProperties.reduce((sum, p) => sum + ((editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue) * p.superBuiltUpArea), 0);
                        return totalBuyback > 0 ? (totalNewTCV / totalBuyback).toFixed(2) : '-';
                      })()}
                    </div>
                  </div>
                </div>
              )}
                  {/* Show summary of rate changes before approval */}
                  {(Object.keys(editedOldAssured).length > 0 || Object.keys(editedNewRates).length > 0) && !rateApprovalSent && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-semibold text-yellow-800 mb-2">Review Rate Changes</h5>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(editedOldAssured).map(([id, newAssured]) => {
                          const prop = oldProperties.find(p => p.id === Number(id));
                          if (!prop || newAssured === prop.assuredValue) return null;
                          return (
                            <li key={id} className="flex gap-4 items-center">
                              <span className="text-gray-700">Old Property <b>{prop.unitNo}</b>:</span>
                              <span className="text-gray-500">Old Assured Value: <s>{prop.assuredValue.toLocaleString()}</s></span>
                              <span className="text-blue-700 font-semibold">New Assured Value: {newAssured.toLocaleString()}</span>
                              <span className="text-xs text-yellow-700 font-semibold ml-2">(Assured Value Change)</span>
                            </li>
                          );
                        })}
                        {Object.entries(editedNewRates).map(([id, newRate]) => {
                          const prop = newProperties.find(p => p.id === Number(id));
                          if (!prop || newRate === prop.rate) return null;
                          return (
                            <li key={id} className="flex gap-4 items-center">
                              <span className="text-gray-700">New Property <b>{prop.unitNo}</b>:</span>
                              <span className="text-gray-500">Old Rate: <s>{prop.rate.toLocaleString()}</s></span>
                              <span className="text-blue-700 font-semibold">New Rate: {newRate.toLocaleString()}</span>
                            </li>
                          );
                        })}
                        {Object.values(editedOldAssured).filter((newAssured, i) => {
                          const prop = oldProperties.find(p => p.id === Number(Object.keys(editedOldAssured)[i]));
                          return prop && newAssured !== prop.assuredValue;
                        }).length === 0 &&
                        Object.values(editedNewRates).filter((newRate, i) => {
                          const prop = newProperties.find(p => p.id === Number(Object.keys(editedNewRates)[i]));
                          return prop && newRate !== prop.rate;
                        }).length === 0 && (
                          <li className="text-gray-500">No actual changes to review.</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Send all rate changes for approval button */}
                  {(Object.keys(editedOldAssured).length > 0 || Object.keys(editedNewRates).length > 0) && !rateApprovalSent && (
                    <div className="flex justify-end mb-6 gap-4 items-center">
                      <Button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow"
                        onClick={() => {
                          setEditedOldAssured({});
                          setEditedNewRates({});
                        }}
                      >
                        Reset Changes
                      </Button>
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded shadow"
                        onClick={async () => {
                          // Prepare payload
                          const oldAssuredChanges = Object.entries(editedOldAssured)
                            .filter(([id, newAssured]) => {
                              const prop = oldProperties.find(p => p.id === Number(id));
                              return prop && newAssured !== prop.assuredValue;
                            })
                            .map(([id, newAssured]) => ({
                              propertyId: Number(id),
                              oldAssured: oldProperties.find(p => p.id === Number(id))?.assuredValue,
                              newAssured,
                            }));
                          const newRateChanges = Object.entries(editedNewRates)
                            .filter(([id, newRate]) => {
                              const prop = newProperties.find(p => p.id === Number(id));
                              return prop && newRate !== prop.rate;
                            })
                            .map(([id, newRate]) => ({
                              propertyId: Number(id),
                              oldRate: newProperties.find(p => p.id === Number(id))?.rate,
                              newRate,
                            }));
                          const payload = {
                            oldAssuredChanges,
                            newRateChanges,
                            tokenNumber,
                            timestamp: Date.now(),
                          };
                          // const resp = await sendRateApprovalRequest(payload);
                          setRateApprovalSent(true);
                          setRateApprovalRequestId(/* resp.requestId */ null);
                          setRateApprovalStatus(/* resp.status */ null);
                          setRateApprovalMessage('All rate change requests have been sent for approval.');
                        }}
                      >
                        Send All Rate Changes for Approval
                      </Button>
                    </div>
                  )}
                  {/* Approval status and refresh */}
                  {rateApprovalSent && rateApprovalRequestId && (
                    <div className="mb-6 flex flex-col items-center gap-2">
                      <div className="text-base font-semibold text-blue-900">
                        Approval Status: <span className="font-bold text-yellow-700">{rateApprovalStatus === 'in_review' ? 'In Review' : rateApprovalStatus}</span>
                      </div>
                      <Button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-1 rounded shadow text-sm"
                        onClick={async () => {
                          // const resp = await getRateApprovalStatus(rateApprovalRequestId);
                          setRateApprovalStatus(/* resp.status */ null);
                        }}
                      >
                        Refresh Status
                      </Button>
                    </div>
                  )}
                  {rateApprovalMessage && (
                    <div className="mb-6 text-green-700 font-medium text-center">
                      {rateApprovalMessage}
                      {/* Show summary of what was sent for approval */}
                      {rateApprovalSent && (rateApprovalRequestId || rateApprovalStatus) && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-xl mx-auto">
                          <h5 className="font-semibold text-yellow-800 mb-2 text-center">Changes Sent for Approval</h5>
                          <ul className="space-y-1 text-sm">
                            {/* Old Assured Value Changes */}
                            {Object.entries(editedOldAssured).map(([id, newAssured]) => {
                              const prop = oldProperties.find(p => p.id === Number(id));
                              if (!prop || newAssured === prop.assuredValue) return null;
                              return (
                                <li key={id} className="flex gap-4 items-center">
                                  <span className="text-gray-700">Old Property <b>{prop.unitNo}</b>:</span>
                                  <span className="text-gray-500">Old Assured Value: <s>{prop.assuredValue.toLocaleString()}</s></span>
                                  <span className="text-blue-700 font-semibold">New Assured Value: {newAssured.toLocaleString()}</span>
                                  <span className="text-xs text-yellow-700 font-semibold ml-2">(Assured Value Change)</span>
                                </li>
                              );
                            })}
                            {/* New Property Rate Changes */}
                            {Object.entries(editedNewRates).map(([id, newRate]) => {
                              const prop = newProperties.find(p => p.id === Number(id));
                              if (!prop || newRate === prop.rate) return null;
                              return (
                                <li key={id} className="flex gap-4 items-center">
                                  <span className="text-gray-700">New Property <b>{prop.unitNo}</b>:</span>
                                  <span className="text-gray-500">Old Rate: <s>{prop.rate.toLocaleString()}</s></span>
                                  <span className="text-blue-700 font-semibold">New Rate: {newRate.toLocaleString()}</span>
                                </li>
                              );
                            })}
                            {/* If no changes, show a message */}
                            {Object.values(editedOldAssured).filter((newAssured, i) => {
                              const prop = oldProperties.find(p => p.id === Number(Object.keys(editedOldAssured)[i]));
                              return prop && newAssured !== prop.assuredValue;
                            }).length === 0 &&
                            Object.values(editedNewRates).filter((newRate, i) => {
                              const prop = newProperties.find(p => p.id === Number(Object.keys(editedNewRates)[i]));
                              return prop && newRate !== prop.rate;
                            }).length === 0 && (
                              <li className="text-gray-500">No actual changes were sent.</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {newProperties.map((property) => {
                    // Use edited assured values for calculations
                    const editedOlds = oldProperties.map(p => ({
                      ...p,
                      assuredValue: editedOldAssured[p.id] !== undefined ? editedOldAssured[p.id] : p.assuredValue,
                    }));
                    const editedNew = {
                      ...property,
                      rate: editedNewRates[property.id] !== undefined ? editedNewRates[property.id] : property.rate,
                    };
                    // Recalculate total paid and premium with edited assured values
                    const totalPaidAmount = editedOlds.reduce((sum, p) => sum + (p.netReceived || 0), 0);
                    const totalPremium = editedOlds.reduce((sum, p) => sum + ((p.assuredValue && p.rate) ? (p.assuredValue - p.rate) * p.superBuiltUpArea : 0), 0);
                    return (
                <CostSheet
                  key={property.id}
                        oldProperties={editedOlds}
                        newProperty={editedNew}
                  paymentPlan={propertyPaymentPlans[property.id]}
                        totalPaidAmount={totalPaidAmount}
                        totalPremium={totalPremium}
                  numNewProperties={newProperties.length}
                />
                    );
                  })}
            </div>
          )}
        </div>
      )}

      {/* 4. Printing and Payment Section (only after cost sheet is computed) */}
      {showCostSheet && (oldProperties.length > 0 && newProperties.length > 0) && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6">
          <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">4. Print & Payment Details</h2>
          <div className="mb-6">
            <h3 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="text"
                  id="amountPaid"
                  placeholder="Numeric Only"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div>
                <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment mode
                </label>
                <select
                  id="paymentMode"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="cheque">Cheque</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="chequeUTR" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                id="chequeUTR"
                placeholder="Free text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={chequeUTR}
                onChange={(e) => setChequeUTR(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Print Quote Only
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-base font-semibold rounded px-6 py-2 text-white">Submit and Print</Button>
          </div>
            </div>
          )}
        </div>
      )}

      {/* New Customer Flow */}
      {activeTab === 'new' && (
        <NewCustomerTransactionPage />
      )}
    </div>
  );
};

export default TransactionPage;