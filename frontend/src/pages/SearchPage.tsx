import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyContext } from '../context/PropertyContext';
import PropertyTable from '../components/PropertyTable';
import Button from '../components/Button';
import { propertyData } from '../data/propertyData';
import { Property } from '../types';
import { useReactToPrint } from 'react-to-print';
import { generateTokenForExistingCustomer } from '../core/services/ClientService';
import { fetchSoldInventory } from '../core/services/InventoryService';
import { getSoldProjectNames } from '../core/services/ConfigService';
import AutocompleteDropdown from '../components/AutocompleteDropdown';
import type { SoldInventoryDto } from '../core/models/InventoryDto';
import PrintCustomerDetails from './PrintCustomerDetails';

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
  const [projectOptions, setProjectOptions] = useState<{ projectName: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const soldInventoriesResponse = await fetchSoldInventory(
        page,
        10,
        projectName || undefined,
        unitNo || undefined,
        customerName || undefined
      );
      // Handle if response is wrapped in 'soldInventories'
      const inv = (soldInventoriesResponse && typeof soldInventoriesResponse === 'object' && 'soldInventories' in soldInventoriesResponse)
        ? (soldInventoriesResponse as any).soldInventories
        : soldInventoriesResponse;
      console.log('API raw response:', soldInventoriesResponse);
      console.log('Used inventory object:', inv);
      console.log('Items:', inv.items);
      const soldInventories: SoldInventoryDto[] = inv.items;
      const totalPagesFromResponse = inv.totalPages || 1;
      const totalCount = inv.totalCount || 0;
      const mapped = soldInventories.map((item: any, idx: number) => ({
        id: item.id || idx + 1,
        srNo: ((page - 1) * 10 + idx + 1).toString(),
        projectName: item.projectName,
        projectType: item.projectType,
        unitNo: item.unitNo,
        customerName: item.buyerName,
        superBuiltUpArea: item.builtUpArea,
        rate: item.rate,
        totalConsideration: item.totalConsideration,
        netReceived: item.netReceived,
        assuredValue: item.assuredPrice,
        sellAtPremiumPrice: item.assuredPrice,
        totalConsiderationInCr: item.totalConsideration ? item.totalConsideration / 10000000 : undefined,
        netProfitInCr: item.netProfitInCr !== undefined ? item.netProfitInCr : ((item.assuredPrice - item.rate) * item.builtUpArea) / 10000000,
        netReceivedInCr: item.netReceived ? item.netReceived / 10000000 : undefined,
        bookingAmount: item.bookingAmount ?? 0,
      }));
      console.log('Mapped for table:', mapped);
      setSearchResults(mapped);
      setTotalPages(totalPagesFromResponse);
      setTotalCount(totalCount);
      setHasSearched(true);
    } catch (error) {
      window.alert('Error fetching inventory.');
      setSearchResults([]);
      setTotalPages(1);
      setTotalCount(0);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    setPage(1);
    handleSearch(e);
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

  const handleProceed = () => {
    setSelectedProperties(selectedPropertiesLocal);
    navigate('/transaction');
  };

  const handleCustomPrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } }',
  });

  const uniqueCustomerNames = Array.from(new Set(selectedPropertiesLocal.map(p => p.customerName)));

  const handleGenerateTokenAndPrint = async () => {
    if (selectedPropertiesLocal.length === 0) {
      window.alert('Please select at least one property to generate a token.');
      return;
    }
    // Map selectedPropertiesLocal to SoldInventoryDto[]
    const soldUnits = selectedPropertiesLocal.map((property) => ({
      id: property.id.toString(),
      projectName: property.projectName,
      projectType: property.projectType,
      unitNo: property.unitNo,
      builtUpArea: property.superBuiltUpArea,
      rate: property.rate,
      totalConsideration: property.totalConsideration,
      buyerName: property.customerName,
      netReceived: property.netReceived,
      assuredPrice: property.assuredValue,
    }));
    try {
      const response = await generateTokenForExistingCustomer(soldUnits);
      if (response?.token) {
        setPrintToken(response.token.toString());
        setTokenNumber(response.token.toString());
        window.alert('Token generated: ' + response.token);
      } else {
        window.alert('Token generated, but no token number returned.');
      }
      setTimeout(() => {
        handleCustomPrint();
      }, 0);
    } catch (error) {
      window.alert('Error generating token.');
    }
  };

  function isValidSearchCombination() {
    const hasProject = !!projectName;
    const hasUnit = !!unitNo;
    const hasName = !!customerName;
    // Only Project Name (no unit, no name) is NOT allowed
    if (hasProject && !hasUnit && !hasName) return false;
    // Only Customer Name
    if (!hasProject && !hasUnit && hasName) return true;
    // Only Unit No
    if (!hasProject && hasUnit && !hasName) return true;
    // Project Name + Unit No (no name)
    if (hasProject && hasUnit && !hasName) return true;
    // Project Name + Customer Name (no unit)
    if (hasProject && !hasUnit && hasName) return true;
    // All three fields
    if (hasProject && hasUnit && hasName) return true;
    // Any other combination is not allowed
    return false;
  }

  // TODO: Replace with service call for project names if available

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Customer details</h1>
        <Button onClick={() => navigate('/transaction')} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow">
          Go to Counter 2
        </Button>
      </div>
      
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <AutocompleteDropdown
              options={projectOptions}
              value={projectName || ''}
              onChange={setProjectName}
              placeholder="Select or type project name"
              onFocus={async () => {
                try {
                  const data = await getSoldProjectNames();
                  // Ensure data is always [{ projectName }]
                  const options = Array.isArray(data) && typeof data[0] === 'string'
                    ? data.map((projectName: string) => ({ projectName }))
                    : data;
                  setProjectOptions(options);
                  localStorage.setItem('soldProjectNames', JSON.stringify(options));
                } catch {
                  const cached = localStorage.getItem('soldProjectNames');
                  if (cached) {
                    const parsed = JSON.parse(cached);
                    const options = Array.isArray(parsed) && typeof parsed[0] === 'string'
                      ? parsed.map((projectName: string) => ({ projectName }))
                      : parsed;
                    setProjectOptions(options);
                  }
                }
              }}
            />
          </div>
          
          <div>
            <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700 mb-1">
              Unit No
            </label>
            <input
              type="text"
              id="unitNo"
              placeholder="Enter unit number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
            />
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
          <span
            className="flex-1"
          >
            <Button
              type="submit"
              className={`w-full ${!isValidSearchCombination() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
              disabled={!isValidSearchCombination()}
            >
              Search
            </Button>
          </span>
          <Button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => {
              setProjectName('');
              setUnitNo('');
              setCustomerName('');
              setSearchResults(propertyData);
              setHasSearched(false);
              setTokenNumber('');
              setLeadStatus('');
              setInterestedProperty('');
              setSelectedPropertiesLocal([]);
              setPrintToken('');
              setPage(1);
              setCustomerEmail('');
              setCustomerPhone('');
            }}
          >
            Clear
          </Button>
        </div>
      </form>
      
      {hasSearched && (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
          <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">Searched Properties</h2>
          <div className="mb-2 text-xs text-gray-500 italic">* Area and rates: sq. yards for plots, sq. ft. for others</div>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-1 border text-center">
                    <input
                      type="checkbox"
                      onChange={e => {
                        if (e.target.checked) {
                          const allIds = [
                            ...selectedPropertiesLocal.map(p => p.id),
                            ...searchResults
                              .filter(p => !selectedPropertiesLocal.some(sel => sel.id === p.id))
                              .map(p => p.id)
                          ];
                          setSelectedPropertiesLocal(searchResults.filter(p => allIds.includes(p.id)));
                        } else {
                          setSelectedPropertiesLocal([]);
                        }
                      }}
                      checked={
                        searchResults.length > 0 &&
                        searchResults.every(p => selectedPropertiesLocal.some(sel => sel.id === p.id))
                      }
                    />
                  </th>
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
                {[
                  ...selectedPropertiesLocal,
                  ...searchResults.filter(
                    p => !selectedPropertiesLocal.some(sel => sel.id === p.id)
                  ),
                ].map(property => {
                  const isSelected = selectedPropertiesLocal.some(p => p.id === property.id);
                  return (
                    <tr key={property.id} className={isSelected ? 'bg-green-100' : ''}>
                      <td className="p-1 border text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedPropertiesLocal(prev =>
                                prev.some(p => p.id === property.id)
                                  ? prev
                                  : [...prev, property]
                              );
                            } else {
                              setSelectedPropertiesLocal(prev =>
                                prev.filter(p => p.id !== property.id)
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="p-1 border align-middle">{property.projectName}</td>
                      <td className="p-1 border align-middle">{property.unitNo}</td>
                      <td className="p-1 border align-middle">{property.customerName}</td>
                      <td className="p-1 border align-middle">{property.superBuiltUpArea !== undefined && property.superBuiltUpArea !== null ? Math.round(property.superBuiltUpArea).toLocaleString() : '-'}</td>
                      <td className="p-1 border align-middle">{property.rate !== undefined && property.rate !== null ? Math.round(property.rate).toLocaleString() : '-'}</td>
                      <td className="p-1 border align-middle">{property.totalConsiderationInCr?.toFixed(2) ?? '-'}</td>
                      <td className="p-1 border align-middle">{property.sellAtPremiumPrice?.toLocaleString() ?? '-'}</td>
                      <td className="p-1 border align-middle">{property.netProfitInCr !== undefined && property.netProfitInCr !== null ? property.netProfitInCr.toFixed(2) : '-'}</td>
                      <td className="p-1 border align-middle">{property.netReceivedInCr?.toFixed(2) ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                  onClick={() => { if (page > 1) { setPage(page - 1); setHasSearched(false); setTimeout(() => handleSearch(new Event('submit') as any), 0); } }}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-base text-gray-700">Page <b>{page}</b> of <b>{totalPages}</b></span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => { if (page < totalPages) { setPage(page + 1); setHasSearched(false); setTimeout(() => handleSearch(new Event('submit') as any), 0); } }}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Selected Properties Section */}
      {selectedPropertiesLocal.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg border border-green-100 p-6 mb-6">
          <h2 className="text-base font-bold mb-4 text-green-900 tracking-wide border-b border-green-100 pb-2 bg-green-50 rounded-t px-2">Selected Properties</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-1 border text-center">#</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Project Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Unit No.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Customer Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Area*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Rate* [all inc]</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Total Consideration(With Tax) in Cr.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Sell @ premium price*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Net Profit (Cr.)</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-green-50 text-sm">Net Received(With Tax) in Cr.</th>
                  <th className="p-1 border text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {selectedPropertiesLocal.map((property, idx) => (
                  <tr key={property.id}>
                    <td className="p-1 border text-center">{idx + 1}</td>
                    <td className="p-1 border align-middle">{property.projectName}</td>
                    <td className="p-1 border align-middle">{property.unitNo}</td>
                    <td className="p-1 border align-middle">{property.customerName}</td>
                    <td className="p-1 border align-middle">{property.superBuiltUpArea !== undefined && property.superBuiltUpArea !== null ? Math.round(property.superBuiltUpArea).toLocaleString() : '-'}</td>
                    <td className="p-1 border align-middle">{property.rate !== undefined && property.rate !== null ? Math.round(property.rate).toLocaleString() : '-'}</td>
                    <td className="p-1 border align-middle">{property.totalConsiderationInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-1 border align-middle">{property.sellAtPremiumPrice?.toLocaleString() ?? '-'}</td>
                    <td className="p-1 border align-middle">{property.netProfitInCr !== undefined && property.netProfitInCr !== null ? property.netProfitInCr.toFixed(2) : '-'}</td>
                    <td className="p-1 border align-middle">{property.netReceivedInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-1 border">
                      <button
                        onClick={() => setSelectedPropertiesLocal(prev => prev.filter(p => p.id !== property.id))}
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
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {(printToken || tokenNumber) && (
          <div className="mb-4 text-lg font-semibold text-blue-700">
            Token Number: {printToken || tokenNumber}
          </div>
        )}
        <div className="mb-4 flex gap-4">
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
            <AutocompleteDropdown
              options={projectOptions}
              value={interestedProperty || ''}
              onChange={setInterestedProperty}
              placeholder="Select or type property name"
              onFocus={async () => {
                try {
                  const data = await getSoldProjectNames();
                  // Ensure data is always [{ projectName }]
                  const options = Array.isArray(data) && typeof data[0] === 'string'
                    ? data.map((projectName: string) => ({ projectName }))
                    : data;
                  setProjectOptions(options);
                  localStorage.setItem('soldProjectNames', JSON.stringify(options));
                } catch {
                  const cached = localStorage.getItem('soldProjectNames');
                  if (cached) {
                    const parsed = JSON.parse(cached);
                    const options = Array.isArray(parsed) && typeof parsed[0] === 'string'
                      ? parsed.map((projectName: string) => ({ projectName }))
                      : parsed;
                    setProjectOptions(options);
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={handleUpdateLeadStatus}>Update lead status</Button>
        </div>
      </div>

      <div className="print-only">
        <PrintCustomerDetails
          ref={printRef}
          customerNames={uniqueCustomerNames}
          token={printToken || tokenNumber}
          properties={selectedPropertiesLocal}
        />
      </div>
    </div>
  );
};

export default SearchPage;