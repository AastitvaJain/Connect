import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import CostSheet from '../components/CostSheet';
import { Property, PaymentPlan } from '../types';
import { newPropertyData } from '../data/newPropertyData';
import { generateTokenForNewCustomer, getClientFromToken } from '../core/services/ClientService';
import { getNewProjectNames, getChannelPartners } from '../core/services/ConfigService';
import { getNewProjectNamesApi } from '../core/api/configApi';
import AutocompleteDropdown from '../components/AutocompleteDropdown';
import { fetchNewInventory } from '../core/services/InventoryService';
import Select from 'react-select';
import { useReactToPrint } from 'react-to-print';
import PrintQuoteDetails from '../components/PrintQuoteDetails';
import Modal from '../components/Modal';
// import { searchNewProperties, sendRateApprovalRequest, generateToken, getRateApprovalStatus } from '../data/api';

const paymentPlanOptions = [
  { value: '', label: 'Choose a plan' },
  { value: 'res1', label: 'Residential Option 1 (30:30:30:10)' },
  { value: 'res2', label: 'Residential Option 2 (10:90)' },
  { value: 'comm', label: 'Commercial (45:55)' },
  { value: 'custom', label: 'Custom (Define your own plan)' },
];

const NewCustomerTransactionPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [unitNoSearch, setUnitNoSearch] = useState('');
  const [filteredInventory, setFilteredInventory] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [propertyPaymentPlans, setPropertyPaymentPlans] = useState<{ [propertyId: string]: string }>({});
  const [customPlansByPropertyId, setCustomPlansByPropertyId] = useState<{ [propertyId: string]: { label: string; percent: number }[] }>({});
  const [showCostSheet, setShowCostSheet] = useState(false);
  const [rateEdits, setRateEdits] = useState<{ [id: string]: number }>({});
  const [approvalSent, setApprovalSent] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [approvalRequestId, setApprovalRequestId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [chequeUTR, setChequeUTR] = useState('');
  const [selectedCPId, setSelectedCPId] = useState('');
  const [channelPartners, setChannelPartners] = useState<{ id: string; name: string }[]>([]);
  const [customCPName, setCustomCPName] = useState('');
  const [customCPNumber, setCustomCPNumber] = useState('');
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);
  const [resumeToken, setResumeToken] = useState('');
  const [projectOptions, setProjectOptions] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrintQuoteOnly = useReactToPrint({
    contentRef: printRef,
    pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } }',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);
  const [customMilestones, setCustomMilestones] = useState([{ label: '', percent: 0 }]);
  const [customPlanPropertyId, setCustomPlanPropertyId] = useState<string | null>(null);
  const [showApprovalReview, setShowApprovalReview] = useState(false);
  const [approvalPayload, setApprovalPayload] = useState<any>(null);

  const unitOptions = projectSearch ? newPropertyData.filter(p => p.projectName === projectSearch).map(p => p.unitNo) : [];

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const projects = await getNewProjectNamesApi();
        setProjectOptions(projects.map((p: any) => p.projectName));
      } catch (error) {
        setProjectOptions([]);
      }
    };
    fetchProjectNames();
  }, []);

  useEffect(() => {
    const partners = getChannelPartners();
    setChannelPartners(partners || []);
  }, []);

  const handleSearch = async () => {
    if (!projectSearch) {
      setFilteredInventory([]);
      setTotalPages(1);
      setTotalCount(0);
      return;
    }
    try {
      const result = await fetchNewInventory(
        page,
        pageSize,
        projectSearch,
        unitNoSearch
      );
      setFilteredInventory(
        (result.items || []).map((item: any, idx: number) => ({
          id: item.id,
          srNo: (page - 1) * pageSize + idx + 1,
          projectName: item.projectName,
          projectType: item.projectType,
          unitNo: item.unitNo,
          customerName: '',
          superBuiltUpArea: item.builtUpArea,
          rate: item.rate,
          totalConsideration: item.totalConsideration,
          netReceived: 0,
          assuredValue: 0,
          totalConsiderationInCr: undefined,
          sellAtPremiumPrice: undefined,
          netProfitInCr: undefined,
          netReceivedInCr: undefined,
          bookingAmount: item.bookingAmount,
          newOffer: item.newOffer,
        }))
      );
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      setFilteredInventory([]);
      setTotalPages(1);
      setTotalCount(0);
      window.alert('Error fetching inventory.');
    }
  };

  const handleAddProperty = (property: Property) => {
    if (!selectedProperties.some(p => p.id === property.id)) {
      setSelectedProperties([
        ...selectedProperties,
        { ...property, bookingAmount: property.bookingAmount ?? 0, newOffer: property.newOffer }
      ]);
      // Set default payment plan based on projectType (case-insensitive)
      const defaultPlan = property.projectType && /commercial/i.test(property.projectType) ? 'comm' : 'res1';
      setPropertyPaymentPlans(prev => ({
        ...prev,
        [String(property.id)]: defaultPlan,
      }));
    }
  };

  const handleRemoveProperty = (id: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== id));
    setPropertyPaymentPlans(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleGenerateToken = async () => {
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!phone) missingFields.push('Phone number');
    if (!email) missingFields.push('Email');
    if (missingFields.length > 0) {
      window.alert('Please fill the following fields before generating a token: ' + missingFields.join(', '));
      return;
    }
    try {
      const response = await generateTokenForNewCustomer(name, email, phone);
      if (response?.token) {
        setTokenNumber(response.token.toString());
        window.alert('Token generated: ' + response.token);
      } else {
        window.alert('Token generated, but no token number returned.');
      }
    } catch (error) {
      window.alert('Error generating token.');
    }
  };

  const cpOptions = [
    ...channelPartners.map(cp => ({ value: cp.id, label: cp.name })),
    { value: 'custom', label: 'Other (Custom)' }
  ];

  const isPaymentDetailsFilled = amountPaid && paymentMode && chequeUTR && ((selectedCPId && selectedCPId !== 'custom') || (customCPName && customCPNumber));

  const getCustomerNames = () => {
    // Try to get unique customer name from form fields or selectedProperties
    if (name) return [name];
    const names = Array.from(new Set(selectedProperties.map(p => p.customerName).filter(Boolean)));
    return names.length > 0 ? names : ['-'];
  };

  // Prepare cost sheet data for print (mimic TransactionPage logic)
  const costSheetData = selectedProperties.map((property) => {
    const editedNew = {
      ...property,
      rate: rateEdits[String(property.id)] !== undefined ? rateEdits[String(property.id)] : property.rate,
    };
    const planKey = propertyPaymentPlans[String(property.id)];
    const paymentPlan: PaymentPlan = planKey === 'custom' ? customPlansByPropertyId[String(property.id)] : planKey as PaymentPlan;
    return {
      oldProperties: [],
      newProperty: editedNew,
      paymentPlan,
      totalPaidAmount: 0,
      totalPremium: 0,
      numNewProperties: selectedProperties.length,
    };
  });

  useEffect(() => {
    if (projectSearch) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [page]);

  // Returns the effective rate for a property: offer > edited > original
  const getEffectiveRate = (property: Property) => {
    if (property.newOffer !== undefined && property.newOffer > 0) {
      return property.rate - property.newOffer;
    }
    if (rateEdits[String(property.id)] !== undefined) {
      return rateEdits[String(property.id)];
    }
    return property.rate;
  };

  // Helper to calculate total percent
  const customTotalPercent = customMilestones.reduce((sum, m) => sum + Number(m.percent), 0);
  const customPlanWarning = customTotalPercent !== 100;
  const canSubmitCustomPlan = customMilestones.length > 0 && !customPlanWarning && customMilestones.every(m => m.label && m.percent > 0);

  // Handler for payment plan change
  const handlePaymentPlanChange = (propertyId: string, value: string) => {
    if (value === 'custom') {
      setCustomPlanPropertyId(propertyId);
      setCustomMilestones([{ label: '', percent: 0 }]);
      setShowCustomPlanModal(true);
    } else {
      setPropertyPaymentPlans((prev) => ({ ...prev, [propertyId]: value }));
    }
  };

  // Handler for custom milestone change
  const handleCustomMilestoneChange = (idx: number, field: 'label' | 'percent', value: string) => {
    setCustomMilestones((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: field === 'percent' ? Number(value) : value } : m));
  };

  // Add milestone
  const handleAddMilestone = () => {
    if (customMilestones.length < 10) {
      setCustomMilestones((prev) => [...prev, { label: '', percent: 0 }]);
    }
  };
  // Remove milestone
  const handleRemoveMilestone = (idx: number) => {
    setCustomMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit custom plan
  const handleSubmitCustomPlan = () => {
    if (customPlanPropertyId && canSubmitCustomPlan) {
      setCustomPlansByPropertyId((prev) => ({ ...prev, [customPlanPropertyId]: customMilestones.map(m => ({ label: m.label, percent: Number(m.percent) })) }));
      setPropertyPaymentPlans((prev) => ({ ...prev, [customPlanPropertyId]: 'custom' }));
      setShowCustomPlanModal(false);
      setCustomPlanPropertyId(null);
    }
  };

  // Utility to check if there are any changes to send for approval (rate edits or custom plans)
  const hasApprovalChanges =
    Object.keys(rateEdits).some(id => Number(rateEdits[id]) !== Number(selectedProperties.find(p => String(p.id) === id)?.rate)) ||
    selectedProperties.some(p => propertyPaymentPlans[String(p.id)] === 'custom');

  // Build approval payload
  const buildApprovalPayload = () => {
    return {
      tokenNumber,
      newCustomer: { name, phone, email },
      properties: selectedProperties.map(p => {
        const obj: any = { id: p.id };
        // Only include rate if changed
        const editedRate = rateEdits[String(p.id)];
        if (editedRate !== undefined && editedRate !== p.rate) {
          obj.rate = editedRate;
        }
        if (propertyPaymentPlans[String(p.id)] === 'custom') {
          obj.paymentPlan = 'custom';
          obj.customPlan = customPlansByPropertyId[String(p.id)];
        }
        return obj;
      }),
    };
  };

  // Handle send for approval
  const handleSendForApproval = () => {
    setApprovalPayload(buildApprovalPayload());
    setShowApprovalReview(true);
  };
  const handleConfirmSendForApproval = () => {
    setApprovalSent(true);
    setShowApprovalReview(false);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-lg border border-yellow-100 p-6">
      <h2 className="text-base font-bold mb-4 text-yellow-900 tracking-wide border-b border-yellow-100 pb-2 bg-yellow-50 rounded-t px-2">New Customer</h2>
      {/* Resume Previous Application Section */}
      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label htmlFor="resumeToken" className="block text-sm font-bold text-blue-900 mb-1">
            Resume Previous Application <span className='font-normal text-gray-500'>(Optional)</span>
          </label>
          <div className="flex flex-row gap-4 items-center">
            <input
              type="text"
              id="resumeToken"
              placeholder="Enter Token Number (if you already have one)"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              value={resumeToken}
              onChange={e => setResumeToken(e.target.value.replace(/\D/g, ''))}
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded h-full"
              style={{ minHeight: '42px' }}
              onClick={async () => {
                if (!resumeToken) {
                  window.alert('Please enter a token number to resume.');
                  return;
                }
                try {
                  const client = await getClientFromToken(Number(resumeToken));
                  if (client) {
                    setName(client.name || '');
                    setEmail(client.email || '');
                    setPhone(client.phoneNumber || '');
                    setTokenNumber(client.id || resumeToken);
                    // Optionally handle sellRecords, buyRecords, etc. here
                  } else {
                    window.alert('No client data found for this token.');
                  }
                } catch (error) {
                  window.alert('Failed to fetch client details for token: ' + resumeToken);
                }
              }}
            >
              Resume
            </Button>
          </div>
          <div className="text-xs text-blue-700 mt-1">
            Use this option <b>only if you already have a token</b> and want to resume a previous application. Otherwise, start a new application below.
          </div>
        </div>
      </div>
      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full p-2 border border-gray-300 rounded-md" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </div>
      {/* Generate Token and Token Number Display (moved here) */}
      <div className="flex flex-col items-end gap-2 mb-6">
        <Button onClick={handleGenerateToken} className="bg-yellow-500 hover:bg-yellow-600 text-base font-semibold rounded px-6 py-2 text-gray-900" disabled={!!tokenNumber}>Generate Token</Button>
        {tokenNumber && (
          <div className="text-lg font-semibold text-blue-800 mt-2">Token Number: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{tokenNumber}</span></div>
        )}
      </div>
      {/* Property Search & Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <AutocompleteDropdown
            options={projectOptions.map(p => ({ projectName: p }))}
            value={projectSearch}
            onChange={val => {
              setProjectSearch(val);
              setUnitNoSearch('');
            }}
            placeholder="Select or type project name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit No</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={unitNoSearch}
            onChange={e => setUnitNoSearch(e.target.value)}
            placeholder="Enter unit number"
            disabled={!projectSearch}
          />
        </div>
        <div className="md:col-span-2 flex justify-end items-end gap-2">
          <Button onClick={() => { setPage(1); setTimeout(() => handleSearch(), 0); }} className="px-6 text-base font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
          <Button
            type="button"
            onClick={() => {
              setProjectSearch('');
              setUnitNoSearch('');
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
        <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-1 border text-center"></th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Type</th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate (inc. all)</th>
              <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration (Without Tax)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {filteredInventory.map((property) => {
              const isSelected = selectedProperties.some(p => p.id === property.id);
              return (
                <tr key={property.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-1 border text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isSelected}
                      onChange={() => {
                        if (!isSelected) handleAddProperty(property);
                      }}
                    />
                  </td>
                  <td className="p-1 border align-middle">{property.projectName}</td>
                  <td className="p-1 border align-middle">{property.projectType}</td>
                  <td className="p-1 border align-middle">{property.unitNo}</td>
                  <td className="p-1 border align-middle">{property.superBuiltUpArea}</td>
                  <td className="p-1 border align-middle">{property.rate.toLocaleString()}</td>
                  <td className="p-1 border align-middle">{property.totalConsideration?.toLocaleString() ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <div className="text-center text-gray-500 py-8">No properties found.</div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-4 gap-2">
            <div className="text-sm text-gray-600 mb-2 text-center">
              {totalCount > 0 && (
                <>
                  Showing <b>{(page - 1) * pageSize + 1}</b>-
                  <b>{Math.min(page * pageSize, totalCount)}</b> of <b>{totalCount}</b> results
                </>
              )}
            </div>
            <div className="flex items-center gap-4 justify-center">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => { if (page > 1) { setPage(page - 1); } }}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-base text-gray-700">Page <b>{page}</b> of <b>{totalPages}</b></span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => { if (page < totalPages) { setPage(page + 1); } }}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Selected Properties Section */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg border border-green-200 p-4 mb-6">
        <h3 className="text-base font-bold mb-2 text-green-900 tracking-wide border-b border-green-100 pb-2 bg-green-50 rounded-t px-2">Selected Properties</h3>
        {selectedProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-1 border text-left font-medium">Sr. No.</th>
                  <th className="p-1 border text-left font-medium">Project Name</th>
                  <th className="p-1 border text-left font-medium">Project Type</th>
                  <th className="p-1 border text-left font-medium">Unit No.</th>
                  <th className="p-1 border text-left font-medium">Area*</th>
                  <th className="p-1 border text-left font-medium">Rate (inc. all)</th>
                  <th className="p-1 border text-left font-medium">Total Consideration (With Tax)</th>
                  <th className="p-1 border text-left font-medium">Payment Plan</th>
                  <th className="p-1 border text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {selectedProperties.map(property => (
                  <tr key={property.id} className="bg-green-50 hover:bg-green-100">
                    <td className="p-1 border">{property.srNo}</td>
                    <td className="p-1 border">{property.projectName}</td>
                    <td className="p-1 border">{property.projectType}</td>
                    <td className="p-1 border">{property.unitNo}</td>
                    <td className="p-1 border">{property.superBuiltUpArea}</td>
                    <td className="p-1 border">{property.rate.toLocaleString()}</td>
                    <td className="p-1 border">{property.totalConsideration.toLocaleString()}</td>
                    <td className="p-1 border">
                      <Select
                        value={paymentPlanOptions.find(opt => opt.value === propertyPaymentPlans[String(property.id)]) || paymentPlanOptions[0]}
                        onChange={option => option && handlePaymentPlanChange(String(property.id), option.value)}
                        options={paymentPlanOptions}
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        styles={{
                          container: (base) => ({ ...base, width: '100%' }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (base) => ({ ...base, minHeight: 32, fontSize: 14 }),
                        }}
                      />
                    </td>
                    <td className="p-1 border">
                      <button
                        onClick={() => handleRemoveProperty(String(property.id))}
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
          <div className="text-center text-gray-500 py-8">No properties selected.</div>
        )}
      </div>
      {/* Cost Sheet Section */}
      {selectedProperties.length > 0 && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col items-center">
          {!showCostSheet ? (
            <Button
              onClick={() => setShowCostSheet(true)}
              className="bg-blue-600 hover:bg-blue-700 mb-4 text-lg px-8 py-3 text-white font-bold rounded"
              disabled={selectedProperties.some(p => !propertyPaymentPlans[String(p.id)])}
            >
              Compute Cost Sheet
            </Button>
          ) : (
            <div className="w-full">
              <h4 className="text-base font-bold mb-2 text-blue-900 tracking-wide border-b border-blue-100 pb-1 bg-blue-50 rounded-t">Cost Sheet</h4>
              {/* New Property Details Table */}
              <div className="mb-4 bg-white rounded-lg shadow border border-green-200 p-3 w-full">
                <h4 className="text-base font-bold mb-2 text-green-900 tracking-wide border-b border-green-100 pb-1 bg-green-50 rounded-t">New Property Details</h4>
                <table className="min-w-full rounded overflow-hidden text-sm">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="p-1 border text-left font-medium">Field</th>
                      {selectedProperties.map((p, idx) => (
                        <th key={p.id} className="p-1 border text-left font-medium">Prop {idx + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-100">
                    {[
                      { label: 'Project Name', get: (p: Property) => p.projectName },
                      { label: 'Unit No.', get: (p: Property) => p.unitNo },
                      { label: 'Area', get: (p: Property) => p.superBuiltUpArea.toLocaleString() },
                      { label: 'Rate', get: (p: Property) => (
                        <div className="flex flex-col items-start gap-1">
                          <input
                            type="number"
                            className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={rateEdits[String(p.id)] !== undefined ? rateEdits[String(p.id)] : p.rate}
                            min={0}
                            onChange={e => {
                              const val = parseInt(e.target.value, 10);
                              setRateEdits(r => ({ ...r, [String(p.id)]: isNaN(val) ? 0 : val }));
                            }}
                            disabled={approvalSent}
                          />
                          {/* Show the offer badge below the input, only if newOffer > 0 */}
                          {(p.newOffer || 0) > 0 && (
                            <span style={{
                              marginTop: 2,
                              background: '#d1fae5',
                              color: '#065f46',
                              borderRadius: 4,
                              padding: '1px 6px',
                              fontSize: '0.85em',
                              fontWeight: 600,
                              border: '1px solid #6ee7b7',
                              display: 'inline-block'
                            }}>
                              <span className="mr-1">⭐</span>Offer: {(p.newOffer ?? 0).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      ) },
                      { label: 'TCV', get: (p: Property) => (p.superBuiltUpArea * getEffectiveRate(p)).toLocaleString() },
                    ].map(field => (
                      <tr key={field.label}>
                        <td className="p-1 border font-semibold text-green-800 bg-green-50 whitespace-nowrap">{field.label}</td>
                        {selectedProperties.map(p => (
                          <td key={p.id} className="p-1 border text-gray-700 whitespace-nowrap">{field.get(p)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Approval Button and Status */}
                {approvalSent && (
                  <div className="mt-4">
                    <div className="text-base font-semibold text-blue-900 mb-2">
                      Approval Status: <span className="font-bold text-yellow-700">{approvalStatus === 'in_review' ? 'In Review' : approvalStatus}</span>
                    </div>
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-1 rounded shadow text-sm mb-2"
                      onClick={async () => {
                        if (approvalRequestId) {
                          // const resp = await getRateApprovalStatus(approvalRequestId);
                          setApprovalStatus(null);
                        }
                      }}
                    >
                      Refresh Status
                    </Button>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-xl mx-auto mt-2">
                      <h5 className="font-semibold text-yellow-800 mb-2 text-center">Changes Sent for Approval</h5>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(rateEdits).map(([id, newRate]) => {
                          const prop = selectedProperties.find(p => p.id === id);
                          if (!prop || newRate === prop.rate) return null;
                          return (
                            <li key={id} className="flex gap-4 items-center">
                              <span className="text-gray-700">Property <b>{prop.unitNo}</b>:</span>
                              <span className="text-gray-500">Old Rate: <s>{prop.rate.toLocaleString()}</s></span>
                              <span className="text-blue-700 font-semibold">New Rate: {newRate.toLocaleString()}</span>
                              <span className="text-xs text-yellow-700 font-semibold ml-2">(Rate Change)</span>
                            </li>
                          );
                        })}
                        {Object.values(rateEdits).filter((newRate, i) => {
                          const prop = selectedProperties.find(p => p.id === Object.keys(rateEdits)[i]);
                          return prop && newRate !== prop.rate;
                        }).length === 0 && (
                          <li className="text-gray-500">No actual changes were sent.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              {/* Cost Sheet(s) */}
              {selectedProperties.map((property, idx) => (
                <CostSheet
                  key={property.id}
                  oldProperties={[]}
                  newProperty={{ ...property, rate: rateEdits[String(property.id)] !== undefined ? rateEdits[String(property.id)] : property.rate }}
                  paymentPlan={propertyPaymentPlans[String(property.id)] === 'custom' ? customPlansByPropertyId[String(property.id)] : propertyPaymentPlans[String(property.id)] as PaymentPlan}
                  totalPaidAmount={0}
                  totalPremium={0}
                  numNewProperties={selectedProperties.length}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* Print/Generate Token Buttons */}
      {showCostSheet && selectedProperties.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {hasApprovalChanges && (
                <>
                  <Button
                    onClick={() => {
                      setRateEdits({});
                      setCustomPlansByPropertyId({});
                      setPropertyPaymentPlans(prev => {
                        const copy = { ...prev };
                        selectedProperties.forEach(p => {
                          if (copy[String(p.id)] === 'custom') {
                            copy[String(p.id)] = p.projectType && /commercial/i.test(p.projectType) ? 'comm' : 'res1';
                          }
                        });
                        return copy;
                      });
                      setApprovalSent(false);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow"
                  >
                    Reset Changes
                  </Button>
                  <Button
                    onClick={handleSendForApproval}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded shadow"
                    disabled={approvalSent}
                  >
                    Send for Approval
                  </Button>
                </>
              )}
            </div>
            <div>
              <Button
                onClick={handlePrintQuoteOnly}
                className="bg-blue-500 hover:bg-blue-600 text-base font-semibold rounded px-6 py-2 text-white"
                disabled={hasApprovalChanges && !approvalSent || !tokenNumber}
              >
                Print Quote Only
              </Button>
            </div>
          </div>
          {/* Banner if not approved */}
          {!approvalSent && hasApprovalChanges && (
            <div className="mb-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-2 text-center">
              You must send your changes for approval before printing the quote.
            </div>
          )}
          {/* Approval Review Modal */}
          <Modal open={showApprovalReview} onClose={() => setShowApprovalReview(false)}>
            <div className="p-6 max-w-2xl mx-auto">
              <h2 className="text-lg font-bold mb-4">Review Changes Before Sending for Approval</h2>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Properties</h3>
                <table className="min-w-full text-sm border mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 border">Unit No.</th>
                      <th className="p-1 border">Rate</th>
                      <th className="p-1 border">Custom Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalPayload?.properties.map((p: any, idx: number) => (
                      <tr key={p.id}>
                        <td className="p-1 border">{selectedProperties.find(np => np.id === p.id)?.unitNo}</td>
                        <td className="p-1 border">{p.rate !== undefined ? p.rate : selectedProperties.find(np => np.id === p.id)?.rate}</td>
                        <td className="p-1 border text-xs">{p.customPlan ? p.customPlan.map((m: any) => `${m.label} (${m.percent}%)`).join(', ') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Show the raw payload as formatted JSON for transparency */}
              <div className="bg-gray-100 rounded p-3 mt-4 text-xs overflow-x-auto">
                <div className="font-semibold mb-1 text-gray-700">Payload to be sent:</div>
                <pre className="whitespace-pre-wrap break-all text-gray-800">{JSON.stringify(approvalPayload, null, 2)}</pre>
              </div>
              <div className="flex gap-4 justify-end mt-4">
                <Button onClick={handleConfirmSendForApproval} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">Confirm & Send</Button>
                <Button onClick={() => setShowApprovalReview(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded">Cancel</Button>
              </div>
            </div>
          </Modal>
          {/* Payment Details Section and Cost Sheet for printing (existing UI) */}
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6">
            <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">Payment Details</h2>
            <div className="mb-6">
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
                <div className="md:col-span-2">
                  <label htmlFor="chequeUTR" className="block text-sm font-medium text-gray-700 mb-1">
                    Cheque #/UTR #/Reference #
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
                <div className="md:col-span-2">
                  <label htmlFor="channelPartner" className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Partner
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Channel Partner (select from list)</label>
                      <Select
                        id="channelPartner"
                        className="w-full"
                        options={cpOptions}
                        value={cpOptions.find(opt => opt.value === selectedCPId) || null}
                        onChange={(option: any) => {
                          setSelectedCPId(option ? option.value : '');
                          if (option) {
                            setCustomCPName('');
                            setCustomCPNumber('');
                          }
                        }}
                        isClearable
                        placeholder="Select Channel Partner"
                        isDisabled={!!customCPName || !!customCPNumber}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OR Enter Custom Channel Partner</label>
                      <input
                        type="text"
                        className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                        value={customCPName}
                        onChange={e => {
                          setCustomCPName(e.target.value);
                          if (e.target.value) setSelectedCPId('');
                        }}
                        placeholder="Channel Partner Name"
                        disabled={!!selectedCPId}
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={customCPNumber}
                        onChange={e => {
                          setCustomCPNumber(e.target.value);
                          if (e.target.value) setSelectedCPId('');
                        }}
                        placeholder="Channel Partner Contact"
                        disabled={!!selectedCPId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => alert('Transaction submitted successfully')}
                className={`bg-green-600 hover:bg-green-700 text-base font-semibold rounded px-6 py-2 text-white ${!isPaymentDetailsFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isPaymentDetailsFilled}
              >
                Submit and Print
              </Button>
            </div>
          </div>
        </>
      )}
      {/* Custom Plan Modal */}
      <Modal open={showCustomPlanModal} onClose={() => setShowCustomPlanModal(false)}>
        <div className="p-6 max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-4">Define Custom Payment Plan</h2>
          <div className="space-y-2">
            {customMilestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Milestone ${idx + 1} Name`}
                  className="border p-1 rounded w-1/2"
                  value={milestone.label}
                  onChange={e => handleCustomMilestoneChange(idx, 'label', e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="%"
                  className="border p-1 rounded w-20"
                  value={milestone.percent}
                  onChange={e => handleCustomMilestoneChange(idx, 'percent', e.target.value)}
                />
                {customMilestones.length > 1 && (
                  <button type="button" className="text-red-500" onClick={() => handleRemoveMilestone(idx)}>&times;</button>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                className="text-blue-600 underline text-sm"
                onClick={handleAddMilestone}
                disabled={customMilestones.length >= 10}
              >
                + Add Milestone
              </button>
              <span className={customPlanWarning ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>
                Total: {customTotalPercent}%
              </span>
            </div>
            {customPlanWarning && (
              <div className="text-red-600 text-sm mt-1">Total payment % must be exactly 100%.</div>
            )}
            <button
              type="button"
              className={`mt-4 w-full py-2 rounded ${canSubmitCustomPlan ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={handleSubmitCustomPlan}
              disabled={!canSubmitCustomPlan}
            >
              Save Custom Plan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewCustomerTransactionPage; 