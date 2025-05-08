import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyContext } from '../context/PropertyContext';
import PropertyTable from '../components/PropertyTable';
import Button from '../components/Button';
import { propertyData } from '../data/propertyData';
import { Property } from '../types';
import { useReactToPrint } from 'react-to-print';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedProperties } = usePropertyContext();
  const [projectName, setProjectName] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [searchResults, setSearchResults] = useState(propertyData);
  const [hasSearched, setHasSearched] = useState(false);
  const [tokenNumber, setTokenNumber] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [interestedProperty, setInterestedProperty] = useState('');
  const [selectedPropertiesLocal, setSelectedPropertiesLocal] = useState<Property[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const [printToken, setPrintToken] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter properties based on search criteria
    const filteredResults = propertyData.filter(property => {
      const matchesProject = projectName ? property.projectName.toLowerCase().includes(projectName.toLowerCase()) : true;
      const matchesUnit = unitNo ? property.unitNo.toLowerCase().includes(unitNo.toLowerCase()) : true;
      const matchesCustomer = customerName ? property.customerName.toLowerCase().includes(customerName.toLowerCase()) : true;
      
      return matchesProject && matchesUnit && matchesCustomer;
    });
    
    setSearchResults(filteredResults);
    setHasSearched(true);
  };

  const handleGenerateToken = () => {
    // Generate a random token number
    const newToken = Math.floor(10000 + Math.random() * 90000).toString();
    setTokenNumber(newToken);
  };

  const handleUpdateLeadStatus = () => {
    // In a real app, this would update the lead status in the backend
    alert(`Lead status updated to: ${leadStatus}`);
  };

  const handleSelectProperties = (selectedIds: number[]) => {
    // Add newly selected properties to the selectedProperties list, avoiding duplicates
    const newlySelected = propertyData.filter(property => selectedIds.includes(property.id));
    setSelectedPropertiesLocal((prev: Property[]) => {
      const all = [...prev];
      newlySelected.forEach(prop => {
        if (!all.some(p => p.id === prop.id)) {
          all.push(prop);
        }
      });
      return all;
    });
  };

  const handleRemoveSelected = (id: number) => {
    setSelectedPropertiesLocal((prev: Property[]) => prev.filter((p: Property) => p.id !== id));
  };

  const handleProceed = () => {
    setSelectedProperties(selectedPropertiesLocal);
    navigate('/transaction');
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } }',
  });

  const uniqueCustomerNames = Array.from(new Set(selectedPropertiesLocal.map(p => p.customerName)));

  const handleGenerateTokenAndPrint = () => {
    if (selectedPropertiesLocal.length === 0) {
      window.alert('Please select at least one property to generate a token.');
      return;
    }
    const newToken = Math.floor(10000 + Math.random() * 90000).toString();
    setPrintToken(newToken);
    setTokenNumber(newToken);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Customer details</h1>
      
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <select
              id="projectName"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            >
              <option value="">Select Project</option>
              <option value="M3M CAPITAL PHASE 1">M3M CAPITAL PHASE 1</option>
              <option value="M3M CROWN PHASE 1">M3M CROWN PHASE 1</option>
              <option value="M3M GOLF HILLS PHASE 2">M3M GOLF HILLS PHASE 2</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700 mb-1">
              Unit No
            </label>
            <select
              id="unitNo"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="MC TW-02-2103">MC TW-02-2103</option>
              <option value="MC TW-02-1903">MC TW-02-1903</option>
              <option value="MC TW-01-0504">MC TW-01-0504</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              placeholder="Min 3 characters for search"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              minLength={3}
            />
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <Button type="submit" className="flex-1">Search</Button>
          <Button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => {
              setProjectName('');
              setUnitNo('');
              setCustomerName('');
              setSearchResults(propertyData);
              setHasSearched(false);
            }}
          >
            Clear
          </Button>
        </div>
      </form>
      
      {hasSearched && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          {/* Combine selected properties and search results, removing duplicates */}
          <PropertyTable 
            properties={[
              ...selectedPropertiesLocal,
              ...searchResults.filter(
                p => !selectedPropertiesLocal.some(sel => sel.id === p.id)
              ),
            ]}
            onSelectProperties={handleSelectProperties}
            selectedPropertyIds={selectedPropertiesLocal.map(p => p.id)}
          />
        </div>
      )}
      
      {selectedPropertiesLocal.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div ref={printRef}>
            <style>{`
              @media print {
                body { font-size: 10px !important; margin: 0.5cm; }
                .print-header h1 { font-size: 14px !important; }
                .print-header .text-lg { font-size: 11px !important; }
              }
            `}</style>
            {/* Print-only header */}
            <div className="hidden print:block w-full mb-6 text-center print-header">
              <h1 className="mb-2">Customer existing property details</h1>
              <div className="text-lg font-medium mb-1">Token number: {printToken || tokenNumber || '-'}</div>
              <div className="text-lg font-medium mb-4">Customer name: {uniqueCustomerNames.join(', ') || '-'}</div>
            </div>
            <h2 className="text-lg font-medium mb-4">Selected Properties</h2>
            <table className="min-w-full border border-gray-200 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Customer Name</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate* [all inc]</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration(With Tax) in Cr.</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Sell @ premium price*</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Net Profit (Cr.)</th>
                  <th className="p-2 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Net Received(With Tax) in Cr.</th>
                </tr>
              </thead>
              <tbody>
                {selectedPropertiesLocal.map(property => (
                  <tr key={property.id}>
                    <td className="p-2 border">{property.projectName}</td>
                    <td className="p-2 border">{property.unitNo}</td>
                    <td className="p-2 border">{property.customerName}</td>
                    <td className="p-2 border">{property.superBuiltUpArea}</td>
                    <td className="p-2 border">{property.rate?.toLocaleString()}</td>
                    <td className="p-2 border">{property.totalConsiderationInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-2 border">{property.sellAtPremiumPrice?.toLocaleString() ?? '-'}</td>
                    <td className="p-2 border">{property.netProfitInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-2 border">{property.netReceivedInCr?.toFixed(2) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Token Number - {printToken || tokenNumber || ""}</h2>
          <Button onClick={handleGenerateTokenAndPrint} disabled={selectedPropertiesLocal.length === 0}>Generate Token Number and Print</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="leadStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Lead Status <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(mandatory)</span>
            </label>
            <select
              id="leadStatus"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Cold">Cold - Will not buy new property</option>
              <option value="Hot">Hot - Interested in new property</option>
              <option value="Medium">Medium - Might buy new property</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="interestedProperty" className="block text-sm font-medium text-gray-700 mb-1">
              Interested property (if any) <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(mandatory)</span>
            </label>
            <select
              id="interestedProperty"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={interestedProperty}
              onChange={(e) => setInterestedProperty(e.target.value)}
            >
              <option value="">Select Property</option>
              <option value="N/A">N/A</option>
              <option value="M3M CAPITAL PHASE 1">M3M CAPITAL PHASE 1</option>
              <option value="M3M CROWN PHASE 1">M3M CROWN PHASE 1</option>
              <option value="M3M GOLF HILLS PHASE 2">M3M GOLF HILLS PHASE 2</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={handleUpdateLeadStatus}>Update lead status</Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;