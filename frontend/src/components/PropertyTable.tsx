import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyTableProps {
  properties: Property[];
  onSelectProperties: (selectedIds: number[]) => void;
  selectedPropertyIds?: number[];
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onSelectProperties, selectedPropertyIds = [] }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    if (selectedPropertyIds.includes(id)) return; // Prevent toggling already selected
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(properties.filter(p => !selectedPropertyIds.includes(p.id)).map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleConfirmSelection = () => {
    onSelectProperties(selectedIds);
  };

  // Separate already selected and available properties
  const alreadySelected = properties.filter(p => selectedPropertyIds.includes(p.id));
  const available = properties.filter(p => !selectedPropertyIds.includes(p.id));
  const sortedProperties = [...alreadySelected, ...available].sort((a, b) => {
    if (typeof a.srNo === 'string' || typeof b.srNo === 'string') {
      return String(a.srNo).localeCompare(String(b.srNo));
    }
    return (a.srNo as number) - (b.srNo as number);
  });

  return (
    <div>
      <div className="mb-2 text-xs text-gray-600 font-medium">
        * Area and rates: sq. yards for plots, sq. ft. for others
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === available.length && available.length > 0}
                />
              </th>
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
            {sortedProperties.length > 0 ? (
              sortedProperties.map(property => {
                const isAlreadySelected = selectedPropertyIds.includes(property.id);
                return (
                  <tr key={property.id} className={isAlreadySelected ? 'bg-green-100' : selectedIds.includes(property.id) ? 'bg-blue-50' : ''}>
                    <td className="p-2 border text-center">
                      <input 
                        type="checkbox" 
                        checked={isAlreadySelected || selectedIds.includes(property.id)}
                        disabled={isAlreadySelected}
                        onChange={() => handleSelect(property.id)}
                      />
                    </td>
                    <td className="p-2 border">{property.projectName}</td>
                    <td className="p-2 border">{property.unitNo}</td>
                    <td className="p-2 border">{property.customerName}</td>
                    <td className="p-2 border">{property.superBuiltUpArea}</td>
                    <td className="p-2 border">{property.rate.toLocaleString()}</td>
                    <td className="p-2 border">{property.totalConsiderationInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-2 border">{property.sellAtPremiumPrice?.toLocaleString() ?? '-'}</td>
                    <td className="p-2 border">{property.netProfitInCr?.toFixed(2) ?? '-'}</td>
                    <td className="p-2 border">{property.netReceivedInCr?.toFixed(2) ?? '-'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">No properties found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {properties.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleConfirmSelection}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-md font-medium ${
              selectedIds.length > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Select {selectedIds.length} {selectedIds.length === 1 ? 'Property' : 'Properties'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyTable;