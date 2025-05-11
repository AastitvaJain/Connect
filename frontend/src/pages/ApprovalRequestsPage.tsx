import React, { useState } from 'react';
import Button from '../components/Button';
import { updateClientToken, getClientFromToken } from '../core/services/ClientService';

// Mocked approval requests (replace with API call in real app)
const mockApprovalRequests = [
  {
    id: 1,
    tokenNumber: '9100001',
    customer: { name: '', email: '', phone: '' },
    oldProperties: [
      { id: 'e5fd0b56-3319-4df2-8520-4a5b62184418', assuredValue: 300003 },
      { id: '6eacbd7e-dfb8-44a9-9018-df06c7948af1' }
    ],
    newProperties: [
      {
        id: '2ad95f3e-724d-4821-9399-1b1d7e7f044b',
        rate: 20797,
        paymentPlan: 'custom',
        customPlan: [
          { label: 'M1', percent: 51 },
          { label: 'M2', percent: 49 }
        ]
      }
    ]
  },
  // Example 1
  {
    id: 2,
    tokenNumber: '9100002',
    customer: { name: '', email: '', phone: '' },
    oldProperties: [
      { id: 'ea3470cb-05fe-4fdf-a61f-2bbd10260fb8', assuredValue: 14100 }
    ],
    newProperties: [
      { id: '2a04e5a4-d21b-4c84-bde3-d6b66e7678e7', rate: 40000 }
    ]
  },
  // Example 2
  {
    id: 3,
    tokenNumber: '9100002',
    customer: { name: '', email: '', phone: '' },
    oldProperties: [
      { id: 'ea3470cb-05fe-4fdf-a61f-2bb8-10260fb8', assuredValue: 14100 }
    ],
    newProperties: [
      {
        id: '2a04e5a4-d21b-4c84-bde3-d6b66e7678e7',
        rate: 40000,
        paymentPlan: 'custom',
        customPlan: [
          { label: '100', percent: 100 }
        ]
      },
      { id: '7eebfc6b-80d0-49b2-b5b2-420a6edc1c05' },
      { id: 'bf476848-d238-4ceb-96bc-5d41f53782a5' }
    ]
  },
  // Example 3 (new)
  {
    id: 4,
    tokenNumber: '9100002',
    customer: { name: '', email: '', phone: '' },
    oldProperties: [
      { id: 'ea3470cb-05fe-4fdf-a61f-2bbd10260fb8', assuredValue: 15100 }
    ],
    newProperties: [
      { id: 'bf476848-d238-4ceb-96bc-5d41f53782a5' }
    ]
  }
];

const ApprovalRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState(mockApprovalRequests);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [approvedPage, setApprovedPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const APPROVED_PAGE_SIZE = 5;
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [successId, setSuccessId] = useState<string | number | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [clientData, setClientData] = useState<any>({});
  const [clientLoading, setClientLoading] = useState<string | number | null>(null);
  // --- Editable state ---
  const [editModeId, setEditModeId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<any>({}); // { [requestId]: { oldProperties: [...], newProperties: [...] } }

  // Fetch client data when expanding a request
  const handleExpand = async (req: any) => {
    setExpandedId(expandedId === req.id ? null : req.id);
    if (!clientData[req.tokenNumber]) {
      setClientLoading(req.id);
      try {
        const data = await getClientFromToken(Number(req.tokenNumber));
        setClientData((prev: any) => ({ ...prev, [req.tokenNumber]: data }));
      } catch (e) {
        alert('Failed to fetch client data');
      } finally {
        setClientLoading(null);
      }
    }
    // Reset edit mode if expanding a different request
    if (expandedId !== req.id) {
      setEditModeId(null);
    }
  };

  // Start editing a request
  const handleEdit = (req: any) => {
    setEditModeId(req.id);
    setEditValues((prev: any) => ({
      ...prev,
      [req.id]: {
        oldProperties: req.oldProperties.map((p: any) => ({ ...p })),
        newProperties: req.newProperties.map((p: any) => ({ ...p })),
      },
    }));
  };

  // Cancel editing (reset to original values)
  const handleReset = (req: any) => {
    setEditValues((prev: any) => ({
      ...prev,
      [req.id]: {
        oldProperties: req.oldProperties.map((p: any) => ({ ...p })),
        newProperties: req.newProperties.map((p: any) => ({ ...p })),
      },
    }));
  };

  // Save edits to main requests state
  const handleSave = (req: any) => {
    setRequests((prev: any[]) =>
      prev.map(r =>
        r.id === req.id
          ? {
              ...r,
              oldProperties: editValues[req.id].oldProperties,
              newProperties: editValues[req.id].newProperties,
            }
          : r
      )
    );
    setEditModeId(null);
  };

  // Handle input change for editable fields
  const handleEditField = (reqId: any, type: 'oldProperties' | 'newProperties', idx: number, field: string, value: any) => {
    setEditValues((prev: any) => {
      const updated = { ...prev };
      updated[reqId] = {
        ...updated[reqId],
        [type]: updated[reqId][type].map((p: any, i: number) =>
          i === idx ? { ...p, [field]: value } : p
        ),
      };
      return updated;
    });
  };

  // Map approval request to updateClientToken payload (use edited values if present)
  const handleApprove = async (req: any) => {
    setLoadingId(req.id);
    setSuccessId(null);
    const useEdit = editValues[req.id];
    const oldProps = useEdit ? useEdit.oldProperties : req.oldProperties;
    const newProps = useEdit ? useEdit.newProperties : req.newProperties;
    const sellRecords = oldProps.map((p: any) => ({
      id: p.id,
      ...(p.assuredValue !== undefined ? { assuredValue: p.assuredValue } : {})
    }));
    const buyRecords = newProps.map((p: any) => ({
      id: p.id,
      ...(p.rate !== undefined ? { rate: p.rate } : {}),
      ...(p.paymentPlan === 'custom' ? { paymentPlan: JSON.stringify(p.customPlan) } : p.paymentPlan ? { paymentPlan: p.paymentPlan } : {})
    }));
    const payload = {
      name: req.customer.name,
      email: req.customer.email,
      phoneNumber: req.customer.phone,
      sellRecords,
      buyRecords
    };
    try {
      await updateClientToken(Number(req.tokenNumber), payload);
      setSuccessId(req.id);
      setRequests(requests => requests.filter(r => r.id !== req.id));
      setApprovedRequests(prev => [{ ...req, approvedAt: new Date().toISOString() }, ...prev]);
      setEditModeId(null);
    } catch (e) {
      alert('Failed to approve request: ' + (e as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  // Helper to compare and highlight changes
  const highlight = (oldVal: any, newVal: any) =>
    oldVal !== newVal ? 'bg-yellow-100 font-bold' : '';

  // Helper to get change summary
  const getChangeSummary = (req: any) => {
    const edit = editValues[req.id];
    if (!edit) return null;
    const changes: string[] = [];
    req.oldProperties.forEach((p: any, i: number) => {
      const edited = edit.oldProperties[i];
      if (Object.keys(p).length === 1 && p.id) return; // skip no-change
      if (p.assuredValue !== edited.assuredValue) {
        changes.push(`Old Property ${i + 1}: Assured Value changed from ${p.assuredValue ?? '-'} to ${edited.assuredValue ?? '-'}`);
      }
    });
    req.newProperties.forEach((p: any, i: number) => {
      const edited = edit.newProperties[i];
      if (Object.keys(p).length === 1 && p.id) return; // skip no-change
      if (p.rate !== edited.rate) {
        changes.push(`New Property ${i + 1}: Rate changed from ${p.rate ?? '-'} to ${edited.rate ?? '-'}`);
      }
    });
    return changes;
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Approval Requests</h1>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'pending' ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('pending')}
        >
          Approval Requests List
        </button>
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'approved' ? 'border-green-500 bg-green-100 text-green-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Requests
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Approval Requests List</h2>
          {requests.length === 0 ? (
            <div className="text-green-600 font-semibold text-center">No pending approval requests.</div>
          ) : (
            <div className="space-y-8">
              {requests.map(req => (
                <div key={req.id} className="border rounded-lg p-4 shadow-sm bg-blue-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700">Token: <b>{req.tokenNumber}</b></div>
                    <Button onClick={() => handleExpand(req)} className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                      {expandedId === req.id ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                  <div className="mb-2 text-sm text-gray-700">Customer: <b>{req.customer.name || '-'}</b> | Email: <b>{req.customer.email || '-'}</b> | Phone: <b>{req.customer.phone || '-'}</b></div>
                  {expandedId === req.id && (
                    <div className="mt-4">
                      {clientLoading === req.id ? (
                        <div className="text-blue-600 font-semibold">Loading client data...</div>
                      ) : clientData[req.tokenNumber] ? (
                        <>
                          {/* --- Summary Row & Calculations --- */}
                          {(() => {
                            // Calculate deltas and warnings
                            let totalAssuredDelta = 0;
                            let totalRateDelta = 0;
                            let warnings: string[] = [];
                            // Old Properties (Sell)
                            req.oldProperties.forEach((p: any) => {
                              const oldRecord = (clientData[req.tokenNumber].sellRecords || []).find((rec: any) => rec.id === p.id) || {};
                              const oldInventory = (clientData[req.tokenNumber].soldInventories || []).find((inv: any) => inv.id === p.id) || {};
                              const oldVal = oldRecord.assuredValue ?? oldInventory.assuredPrice ?? 0;
                              const newVal = p.assuredValue ?? oldVal;
                              const delta = newVal - oldVal;
                              totalAssuredDelta += delta;
                              if (oldVal && Math.abs(delta / oldVal) > 0.05) {
                                warnings.push(`Assured Value for unit ${oldInventory.unitNo || p.id} changed by ${(delta > 0 ? '+' : '') + delta} (${((delta / oldVal) * 100).toFixed(1)}%)`);
                              }
                            });
                            // New Properties (Buy)
                            req.newProperties.forEach((p: any) => {
                              const oldRecord = (clientData[req.tokenNumber].buyRecords || []).find((rec: any) => rec.id === p.id) || {};
                              const oldInventory = (clientData[req.tokenNumber].newInventories || []).find((inv: any) => inv.id === p.id) || {};
                              const oldVal = oldRecord.rate ?? oldInventory.rate ?? 0;
                              const newVal = p.rate ?? oldVal;
                              const delta = newVal - oldVal;
                              totalRateDelta += delta;
                              if (oldVal && Math.abs(delta / oldVal) > 0.05) {
                                warnings.push(`Rate for unit ${oldInventory.unitNo || p.id} changed by ${(delta > 0 ? '+' : '') + delta} (${((delta / oldVal) * 100).toFixed(1)}%)`);
                              }
                            });
                            return (
                              <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200">
                                <div className="font-semibold mb-1 text-yellow-900">Summary of Changes</div>
                                <div className="text-sm text-gray-800">Total Assured Value Change: <span className={totalAssuredDelta === 0 ? '' : totalAssuredDelta > 0 ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>{totalAssuredDelta > 0 ? '+' : ''}{totalAssuredDelta.toLocaleString()}</span></div>
                                <div className="text-sm text-gray-800">Total Rate Change: <span className={totalRateDelta === 0 ? '' : totalRateDelta > 0 ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>{totalRateDelta > 0 ? '+' : ''}{totalRateDelta.toLocaleString()}</span></div>
                                {warnings.length > 0 && (
                                  <div className="mt-2 text-sm text-red-700 font-semibold">
                                    <div className="mb-1">Warnings:</div>
                                    <ul className="list-disc ml-5">
                                      {warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          {/* --- End Summary Row --- */}
                          <h4 className="font-semibold mb-2 text-blue-900">Old vs New Property Details</h4>
                          {/* Old Properties (Sell) */}
                          <div className="mb-4">
                            <b>Old Properties:</b>
                            {((editModeId === req.id ? editValues[req.id]?.oldProperties : req.oldProperties) || []).map((p: any, idx: number) => {
                              const isNoChange = Object.keys(p).length === 1 && p.id;
                              const oldRecord = (clientData[req.tokenNumber].sellRecords || []).find((rec: any) => rec.id === p.id) || {};
                              const oldInventory = (clientData[req.tokenNumber].soldInventories || []).find((inv: any) => inv.id === p.id) || {};
                              const oldVal = oldRecord.assuredValue ?? oldInventory.assuredPrice ?? 0;
                              const newVal = isNoChange ? oldVal : (p.assuredValue ?? oldVal);
                              const delta = isNoChange ? 0 : (newVal - oldVal);
                              const percent = oldVal ? ((delta / oldVal) * 100).toFixed(1) : '0.0';
                              return (
                                <table key={p.id} className="min-w-full text-xs border mb-2">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="p-1 border">Field</th>
                                      <th className="p-1 border">Current</th>
                                      <th className="p-1 border">Requested</th>
                                      <th className="p-1 border">Δ</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="p-1 border">Project Name</td>
                                      <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                      <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Unit No</td>
                                      <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                      <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Built-up Area</td>
                                      <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                      <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Assured Value</td>
                                      <td className="p-1 border">{oldVal.toLocaleString()}</td>
                                      <td className={`p-1 border ${highlight(oldVal, newVal)}`}>{isNoChange || editModeId !== req.id ? newVal.toLocaleString() : (
                                        <input
                                          type="number"
                                          className="w-24 border rounded px-1 py-0.5"
                                          value={p.assuredValue ?? ''}
                                          onChange={e => handleEditField(req.id, 'oldProperties', idx, 'assuredValue', e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                      )}</td>
                                      <td className={`p-1 border ${delta === 0 ? '' : delta > 0 ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>{isNoChange ? '-' : (delta === 0 ? '-' : `${delta > 0 ? '+' : ''}${delta.toLocaleString()} (${percent}%)`)}</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Buyer Name</td>
                                      <td className="p-1 border">{oldInventory.buyerName || '-'}</td>
                                      <td className="p-1 border">{oldInventory.buyerName || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                  </tbody>
                                </table>
                              );
                            })}
                          </div>
                          {/* New Properties (Buy) */}
                          <div className="mb-4">
                            <b>New Properties:</b>
                            {((editModeId === req.id ? editValues[req.id]?.newProperties : req.newProperties) || []).map((p: any, idx: number) => {
                              const isNoChange = Object.keys(p).length === 1 && p.id;
                              const oldRecord = (clientData[req.tokenNumber].buyRecords || []).find((rec: any) => rec.id === p.id) || {};
                              const oldInventory = (clientData[req.tokenNumber].newInventories || []).find((inv: any) => inv.id === p.id) || {};
                              const oldVal = oldRecord.rate ?? oldInventory.rate ?? 0;
                              const newVal = isNoChange ? oldVal : (p.rate ?? oldVal);
                              const delta = isNoChange ? 0 : (newVal - oldVal);
                              const percent = oldVal ? ((delta / oldVal) * 100).toFixed(1) : '0.0';
                              return (
                                <table key={p.id} className="min-w-full text-xs border mb-2">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="p-1 border">Field</th>
                                      <th className="p-1 border">Current</th>
                                      <th className="p-1 border">Requested</th>
                                      <th className="p-1 border">Δ</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="p-1 border">Project Name</td>
                                      <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                      <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Unit No</td>
                                      <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                      <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Built-up Area</td>
                                      <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                      <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Rate</td>
                                      <td className="p-1 border">{oldVal.toLocaleString()}</td>
                                      <td className={`p-1 border ${highlight(oldVal, newVal)}`}>{isNoChange || editModeId !== req.id ? newVal.toLocaleString() : (
                                        <input
                                          type="number"
                                          className="w-24 border rounded px-1 py-0.5"
                                          value={p.rate ?? ''}
                                          onChange={e => handleEditField(req.id, 'newProperties', idx, 'rate', e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                      )}</td>
                                      <td className={`p-1 border ${delta === 0 ? '' : delta > 0 ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>{isNoChange ? '-' : (delta === 0 ? '-' : `${delta > 0 ? '+' : ''}${delta.toLocaleString()} (${percent}%)`)}</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1 border">Payment Plan</td>
                                      <td className="p-1 border">{oldRecord.paymentPlan ? (oldRecord.paymentPlan.length > 30 ? <span title={oldRecord.paymentPlan}>{oldRecord.paymentPlan.slice(0, 30) + '...'}</span> : oldRecord.paymentPlan) : oldInventory.paymentPlan ? (oldInventory.paymentPlan.length > 30 ? <span title={oldInventory.paymentPlan}>{oldInventory.paymentPlan.slice(0, 30) + '...'}</span> : oldInventory.paymentPlan) : '-'}</td>
                                      <td className="p-1 border">{oldRecord.paymentPlan ? (oldRecord.paymentPlan.length > 30 ? <span title={oldRecord.paymentPlan}>{oldRecord.paymentPlan.slice(0, 30) + '...'}</span> : oldRecord.paymentPlan) : oldInventory.paymentPlan ? (oldInventory.paymentPlan.length > 30 ? <span title={oldInventory.paymentPlan}>{oldInventory.paymentPlan.slice(0, 30) + '...'}</span> : oldInventory.paymentPlan) : '-'}</td>
                                      <td className="p-1 border">-</td>
                                    </tr>
                                  </tbody>
                                </table>
                              );
                            })}
                          </div>
                          {/* --- Edit/Save/Reset Controls --- */}
                          <div className="flex gap-2 mb-2">
                            {editModeId === req.id ? (
                              <>
                                <Button onClick={() => handleSave(req)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded">Save All Changes</Button>
                                <Button onClick={() => handleReset(req)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-1 rounded">Reset</Button>
                                <Button onClick={() => setEditModeId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-1 rounded">Cancel</Button>
                              </>
                            ) : (
                              <Button onClick={() => handleEdit(req)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-1 rounded">Edit</Button>
                            )}
                          </div>
                          {/* --- Change Summary --- */}
                          {editModeId === req.id && (
                            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <div className="font-semibold text-yellow-900 mb-1">Summary of Changes:</div>
                              {(() => {
                                const changes = getChangeSummary(req);
                                return changes && changes.length > 0 ? (
                                  <ul className="list-disc ml-5 text-sm text-yellow-900">
                                    {changes.map((c, i) => <li key={i}>{c}</li>)}
                                  </ul>
                                ) : (
                                  <div className="text-sm text-gray-500">No changes made.</div>
                                );
                              })()}
                            </div>
                          )}
                          {/* --- Payload Preview --- */}
                          <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded">
                            <div className="font-semibold text-gray-700 mb-1">Payload to be sent:</div>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify({
                                name: req.customer.name,
                                email: req.customer.email,
                                phoneNumber: req.customer.phone,
                                sellRecords: (editModeId === req.id ? editValues[req.id]?.oldProperties : req.oldProperties).map((p: any) => ({ id: p.id, ...(p.assuredValue !== undefined ? { assuredValue: p.assuredValue } : {}) })),
                                buyRecords: (editModeId === req.id ? editValues[req.id]?.newProperties : req.newProperties).map((p: any) => ({ id: p.id, ...(p.rate !== undefined ? { rate: p.rate } : {}), ...(p.paymentPlan === 'custom' ? { paymentPlan: JSON.stringify(p.customPlan) } : p.paymentPlan ? { paymentPlan: p.paymentPlan } : {}) })),
                              }, null, 2)}
                            </pre>
                          </div>
                        </>
                      ) : (
                        <div className="text-red-600 font-semibold">No client data found.</div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleApprove(req)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                      disabled={loadingId === req.id}
                    >
                      {loadingId === req.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      onClick={() => setRequests(requests => requests.filter(r => r.id !== req.id))}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
                      disabled={loadingId === req.id}
                    >
                      Reject
                    </Button>
                    {successId === req.id && <span className="text-green-700 font-semibold ml-4">Approved!</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">Approved Requests <span className="text-green-600 text-base">({approvedRequests.length})</span></h2>
            <Button onClick={() => setShowApproved(v => !v)} className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
              {showApproved ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showApproved && (
            approvedRequests.length === 0 ? (
              <div className="text-gray-400 font-semibold text-center">No approved requests yet.</div>
            ) : (
              <>
                <div className="space-y-8">
                  {approvedRequests.slice((approvedPage-1)*APPROVED_PAGE_SIZE, approvedPage*APPROVED_PAGE_SIZE).map(req => (
                    <div key={req.id} className="border rounded-lg p-4 shadow-sm bg-green-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-700">Token: <b>{req.tokenNumber}</b></div>
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded text-xs font-bold">Approved</span>
                      </div>
                      <div className="mb-2 text-sm text-gray-700">Customer: <b>{req.customer.name || '-'}</b> | Email: <b>{req.customer.email || '-'}</b> | Phone: <b>{req.customer.phone || '-'}</b></div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-green-900">Old vs New Property Details</h4>
                        {/* Old Properties (Sell) */}
                        <div className="mb-4">
                          <b>Old Properties:</b>
                          {req.oldProperties.map((p: any) => {
                            const oldRecord = (clientData[req.tokenNumber]?.sellRecords || []).find((rec: any) => rec.id === p.id) || {};
                            const oldInventory = (clientData[req.tokenNumber]?.soldInventories || []).find((inv: any) => inv.id === p.id) || {};
                            return (
                              <table key={p.id} className="min-w-full text-xs border mb-2">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-1 border">Field</th>
                                    <th className="p-1 border">Current</th>
                                    <th className="p-1 border">Requested</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="p-1 border">Project Name</td>
                                    <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                    <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Unit No</td>
                                    <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                    <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Built-up Area</td>
                                    <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                    <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Assured Value</td>
                                    <td className="p-1 border">{oldRecord.assuredValue ?? oldInventory.assuredPrice ?? '-'}</td>
                                    <td className="p-1 border">{p.assuredValue ?? '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Buyer Name</td>
                                    <td className="p-1 border">{oldInventory.buyerName || '-'}</td>
                                    <td className="p-1 border">{oldInventory.buyerName || '-'}</td>
                                  </tr>
                                </tbody>
                              </table>
                            );
                          })}
                        </div>
                        {/* New Properties (Buy) */}
                        <div className="mb-4">
                          <b>New Properties:</b>
                          {req.newProperties.map((p: any) => {
                            const oldRecord = (clientData[req.tokenNumber]?.buyRecords || []).find((rec: any) => rec.id === p.id) || {};
                            const oldInventory = (clientData[req.tokenNumber]?.newInventories || []).find((inv: any) => inv.id === p.id) || {};
                            return (
                              <table key={p.id} className="min-w-full text-xs border mb-2">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-1 border">Field</th>
                                    <th className="p-1 border">Current</th>
                                    <th className="p-1 border">Requested</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="p-1 border">Project Name</td>
                                    <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                    <td className="p-1 border">{oldInventory.projectName || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Unit No</td>
                                    <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                    <td className="p-1 border">{oldInventory.unitNo || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Built-up Area</td>
                                    <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                    <td className="p-1 border">{oldInventory.builtUpArea || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Rate</td>
                                    <td className="p-1 border">{oldRecord.rate ?? oldInventory.rate ?? '-'}</td>
                                    <td className="p-1 border">{p.rate ?? '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 border">Payment Plan</td>
                                    <td className="p-1 border">{oldRecord.paymentPlan ? (oldRecord.paymentPlan.length > 30 ? <span title={oldRecord.paymentPlan}>{oldRecord.paymentPlan.slice(0, 30) + '...'}</span> : oldRecord.paymentPlan) : oldInventory.paymentPlan ? (oldInventory.paymentPlan.length > 30 ? <span title={oldInventory.paymentPlan}>{oldInventory.paymentPlan.slice(0, 30) + '...'}</span> : oldInventory.paymentPlan) : '-'}</td>
                                    <td className="p-1 border">{p.paymentPlan === 'custom' ? JSON.stringify(p.customPlan) : p.paymentPlan || '-'}</td>
                                  </tr>
                                </tbody>
                              </table>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    onClick={() => setApprovedPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={approvedPage === 1}
                  >
                    Prev
                  </Button>
                  <span className="text-sm">Page {approvedPage} of {Math.ceil(approvedRequests.length / APPROVED_PAGE_SIZE)}</span>
                  <Button
                    onClick={() => setApprovedPage(p => Math.min(Math.ceil(approvedRequests.length / APPROVED_PAGE_SIZE), p + 1))}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={approvedPage === Math.ceil(approvedRequests.length / APPROVED_PAGE_SIZE) || approvedRequests.length === 0}
                  >
                    Next
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovalRequestsPage; 