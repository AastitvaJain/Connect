import React, { useState } from 'react';
import Button from '../components/Button';
import PropertyTable from '../components/PropertyTable';
import CostSheet from '../components/CostSheet';
import { Property, PaymentPlan } from '../types';
import { newPropertyData } from '../data/newPropertyData';
// import { searchNewProperties, sendRateApprovalRequest, generateToken, getRateApprovalStatus } from '../data/api';

const paymentPlanOptions = [
  { value: '', label: 'Choose a plan' },
  { value: 'res1', label: 'Residential Option 1 (30:30:30:10)' },
  { value: 'res2', label: 'Residential Option 2 (10:90)' },
  { value: 'comm', label: 'Commercial (45:55)' },
];

const NewCustomerTransactionPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [unitNoSearch, setUnitNoSearch] = useState('');
  const [filteredInventory, setFilteredInventory] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [propertyPaymentPlans, setPropertyPaymentPlans] = useState<{ [propertyId: number]: PaymentPlan }>({});
  const [showCostSheet, setShowCostSheet] = useState(false);
  const [rateEdits, setRateEdits] = useState<{ [id: number]: number }>({});
  const [approvalSent, setApprovalSent] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [approvalRequestId, setApprovalRequestId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [chequeUTR, setChequeUTR] = useState('');
  const [selectedCP, setSelectedCP] = useState('');
  const [cpName, setCPName] = useState('');
  const [cpContact, setCPContact] = useState('');
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);
  const [resumeToken, setResumeToken] = useState('');

  const projectOptions = Array.from(new Set(newPropertyData.map(p => p.projectName)));
  const unitOptions = projectSearch ? newPropertyData.filter(p => p.projectName === projectSearch).map(p => p.unitNo) : [];

  const handleSearch = async () => {
    // const results = await searchNewProperties({ projectName: projectSearch, unitNo: unitNoSearch });
    setFilteredInventory([]);
  };

  const handleAddProperty = (property: Property) => {
    if (!selectedProperties.some(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const handleRemoveProperty = (id: number) => {
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
    // const token = await generateToken(selectedProperties);
    setTokenNumber(null);
    window.alert(`Token generation logic not implemented yet.`);
  };

  const isPaymentDetailsFilled = amountPaid && paymentMode && chequeUTR && selectedCP && cpName && cpContact;

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
              onClick={() => {
                if (!resumeToken) {
                  window.alert('Please enter a token number to resume.');
                  return;
                }
                // TODO: Implement logic to fetch and populate form data by token number
                window.alert('Resume logic not implemented yet. Token: ' + resumeToken);
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
      <div className="flex justify-end items-center gap-4 mb-6">
        <Button onClick={handleGenerateToken} className="bg-yellow-500 hover:bg-yellow-600 text-base font-semibold rounded px-6 py-2 text-gray-900" disabled={!!tokenNumber}>Generate Token</Button>
        {tokenNumber && (
          <div className="text-lg font-semibold text-blue-800">Token Number: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{tokenNumber}</span></div>
        )}
      </div>
      {/* Property Search & Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={projectSearch}
            onChange={e => {
              setProjectSearch(e.target.value);
              setUnitNoSearch('');
            }}
          >
            <option value="">All Projects</option>
            {projectOptions.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit No</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={unitNoSearch}
            onChange={e => setUnitNoSearch(e.target.value)}
            disabled={!projectSearch}
          >
            <option value="">All Units</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex justify-end items-end gap-2">
          <Button onClick={handleSearch} className="px-6 text-base font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
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
            {filteredInventory.map((property) => (
              <tr key={property.id} className="hover:bg-blue-50 transition-colors">
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
        {filteredInventory.length === 0 && (
          <div className="text-center text-gray-500 py-8">No properties found.</div>
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
                        onClick={() => handleRemoveProperty(property.id)}
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
              disabled={selectedProperties.some(p => !propertyPaymentPlans[p.id])}
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
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={rateEdits[p.id] !== undefined ? rateEdits[p.id] : p.rate}
                            min={0}
                            onChange={e => {
                              const val = parseInt(e.target.value, 10);
                              setRateEdits(r => ({ ...r, [p.id]: isNaN(val) ? 0 : val }));
                            }}
                            disabled={approvalSent}
                          />
                        </div>
                      ) },
                      { label: 'TCV', get: (p: Property) => ((p.superBuiltUpArea * (rateEdits[p.id] !== undefined ? rateEdits[p.id] : p.rate)).toLocaleString()) },
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
                {(Object.keys(rateEdits).length > 0 && !approvalSent) && (
                  <div className="flex justify-end mt-4">
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded shadow"
                      onClick={async () => {
                        const rateChanges = Object.entries(rateEdits)
                          .filter(([id, newRate]) => {
                            const prop = selectedProperties.find(p => p.id === Number(id));
                            return prop && newRate !== prop.rate;
                          })
                          .map(([id, newRate]) => ({
                            propertyId: Number(id),
                            oldRate: selectedProperties.find(p => p.id === Number(id))?.rate,
                            newRate,
                          }));
                        const payload = {
                          newCustomer: { name, phone, email },
                          properties: selectedProperties,
                          rateChanges,
                          paymentPlans: propertyPaymentPlans,
                          timestamp: Date.now(),
                        };
                        // const resp = await sendRateApprovalRequest(payload);
                        setApprovalSent(true);
                        setApprovalRequestId(null);
                        setApprovalStatus(null);
                        setApprovalMessage('All rate change requests have been sent for approval.');
                      }}
                    >
                      Send All Rate Changes for Approval
                    </Button>
                  </div>
                )}
                {/* Approval Status and Summary */}
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
                          const prop = selectedProperties.find(p => p.id === Number(id));
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
                          const prop = selectedProperties.find(p => p.id === Number(Object.keys(rateEdits)[i]));
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
                  newProperty={{ ...property, rate: rateEdits[property.id] !== undefined ? rateEdits[property.id] : property.rate }}
                  paymentPlan={propertyPaymentPlans[property.id]}
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
          <div className="flex justify-end gap-4 mb-6">
            <Button onClick={handleGenerateToken} className="bg-yellow-500 hover:bg-yellow-600 text-base font-semibold rounded px-6 py-2 text-gray-900" disabled={!!tokenNumber}>Generate Token</Button>
            <Button onClick={() => alert('Printing quote...')} className="bg-blue-500 hover:bg-blue-600 text-base font-semibold rounded px-6 py-2 text-white" disabled={!tokenNumber}>Print Quote Only</Button>
          </div>
          {tokenNumber && (
            <div className="text-center mb-4 text-lg font-semibold text-blue-800">Token Number: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{tokenNumber}</span></div>
          )}
          {/* Payment Details Section */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label htmlFor="selectedCP" className="block text-sm font-medium text-gray-700 mb-1">CP</label>
                <input
                  type="text"
                  id="selectedCP"
                  placeholder="Dropdown search"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={selectedCP}
                  onChange={(e) => setSelectedCP(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="cpName" className="block text-sm font-medium text-gray-700 mb-1">CP Name</label>
                <input
                  type="text"
                  id="cpName"
                  placeholder="Free text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={cpName}
                  onChange={(e) => setCPName(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="cpContact" className="block text-sm font-medium text-gray-700 mb-1">CP Contact</label>
              <input
                type="text"
                id="cpContact"
                placeholder="Free text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={cpContact}
                onChange={(e) => setCPContact(e.target.value)}
              />
            </div>
          </div>
          {/* Submit and Print Button (after payment details) */}
          <div className="flex justify-end">
            <Button
              onClick={() => alert('Transaction submitted successfully')}
              className={`bg-green-600 hover:bg-green-700 text-base font-semibold rounded px-6 py-2 text-white ${!isPaymentDetailsFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isPaymentDetailsFilled}
            >
              Submit and Print
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewCustomerTransactionPage; 