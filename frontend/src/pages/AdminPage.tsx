import React, { useState, useEffect } from 'react';
import { fetchProjectOffers, saveProjectOffers } from '../core/services/AdminService';
import type { ProjectOffer } from '../core/models/ProjectOffers';
import ApprovalRequestsPage from './ApprovalRequestsPage';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approval' | 'offers'>('approval');
  const [offers, setOffers] = useState<ProjectOffer[]>([]);
  const [originalOffers, setOriginalOffers] = useState<ProjectOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'offers') {
      setOffersLoading(true);
      setOffersError(null);
      fetchProjectOffers()
        .then((offersData) => {
          setOffers(offersData || []);
          setOriginalOffers(offersData || []);
        })
        .catch(() => {
          setOffersError('Failed to fetch offers.');
        })
        .finally(() => {
          setOffersLoading(false);
        });
    }
  }, [activeTab]);

  // Split offers into old and new
  const oldOffers = offers.filter(o => o.id.startsWith('E'));
  const newOffers = offers.filter(o => o.id.startsWith('N'));

  // Helper to update offerAmount in state
  const handleOfferChange = (id: string, value: number) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, offerAmount: value } : o));
  };

  // Compute changed offers
  const changedOffers = offers.filter(o => {
    const orig = originalOffers.find(oo => oo.id === o.id);
    return orig && orig.offerAmount !== o.offerAmount;
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
      <div className="flex gap-4 mb-8 justify-center">
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'approval' ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('approval')}
        >
          Approval Requests
        </button>
        <button
          className={`px-6 py-2 rounded-t font-bold text-lg border-b-4 ${activeTab === 'offers' ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-transparent bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('offers')}
        >
          Update Offers
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
        {activeTab === 'approval' && (
          <ApprovalRequestsPage />
        )}
        {activeTab === 'offers' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Update Offers</h2>
            {offersLoading ? (
              <div className="text-gray-500">Loading offers...</div>
            ) : offersError ? (
              <div className="text-red-500">{offersError}</div>
            ) : (
              <>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <h3 className="font-bold mb-2 text-blue-700">Old Projects</h3>
                    <table className="min-w-full border rounded bg-blue-50">
                      <thead>
                        <tr>
                          <th className="p-2 border-b text-left">Property</th>
                          <th className="p-2 border-b text-left">Incremental increase buyback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oldOffers.length === 0 ? (
                          <tr><td colSpan={2} className="text-gray-400 p-2">No old projects found.</td></tr>
                        ) : (
                          oldOffers.map((offer) => (
                            <tr key={offer.id}>
                              <td className="p-2 border-b">{offer.name}</td>
                              <td className="p-2 border-b">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={offer.offerAmount}
                                  onChange={e => handleOfferChange(offer.id, Number(e.target.value))}
                                  placeholder="Enter value"
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2 text-green-700">New Projects</h3>
                    <table className="min-w-full border rounded bg-green-50">
                      <thead>
                        <tr>
                          <th className="p-2 border-b text-left">Property</th>
                          <th className="p-2 border-b text-left">Incremental drop in Sales price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOffers.length === 0 ? (
                          <tr><td colSpan={2} className="text-gray-400 p-2">No new projects found.</td></tr>
                        ) : (
                          newOffers.map((offer) => (
                            <tr key={offer.id}>
                              <td className="p-2 border-b">{offer.name}</td>
                              <td className="p-2 border-b">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={offer.offerAmount}
                                  onChange={e => handleOfferChange(offer.id, Number(e.target.value))}
                                  placeholder="Enter value"
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Changed Offers Summary */}
                {changedOffers.length > 0 && !showConfirm && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2 text-center">Changed Offers</h3>
                    <table className="min-w-full border rounded bg-yellow-50 mb-4">
                      <thead>
                        <tr>
                          <th className="p-2 border-b text-left">Property</th>
                          <th className="p-2 border-b text-left">New Offer Amount</th>
                          <th className="p-2 border-b text-left">Previous Offer Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changedOffers.map(offer => {
                          const orig = originalOffers.find(oo => oo.id === offer.id);
                          return (
                            <tr key={offer.id}>
                              <td className="p-2 border-b">{offer.name}</td>
                              <td className="p-2 border-b">{offer.offerAmount}</td>
                              <td className="p-2 border-b">{orig ? orig.offerAmount : ''}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-center mt-8">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded shadow disabled:opacity-50"
                    disabled={offersLoading || saving || changedOffers.length === 0}
                    onClick={() => setShowConfirm(true)}
                  >
                    Submit
                  </button>
                </div>
                {/* Confirmation Dialog */}
                {showConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Confirm Changes</h3>
                      <p className="mb-4">Are you sure you want to update the following offers?</p>
                      <table className="min-w-full border rounded bg-yellow-50 mb-4">
                        <thead>
                          <tr>
                            <th className="p-2 border-b text-left">Property</th>
                            <th className="p-2 border-b text-left">New Offer Amount</th>
                            <th className="p-2 border-b text-left">Previous Offer Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {changedOffers.map(offer => {
                            const orig = originalOffers.find(oo => oo.id === offer.id);
                            return (
                              <tr key={offer.id}>
                                <td className="p-2 border-b">{offer.name}</td>
                                <td className="p-2 border-b">{offer.offerAmount}</td>
                                <td className="p-2 border-b">{orig ? orig.offerAmount : ''}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                          onClick={() => setShowConfirm(false)}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          disabled={saving}
                          onClick={async () => {
                            setSaving(true);
                            try {
                              await saveProjectOffers({ projectOffers: changedOffers } as any);
                              setOriginalOffers(offers);
                              setShowConfirm(false);
                              alert('Offers updated successfully!');
                            } catch (err) {
                              alert('Failed to save offers.');
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          Confirm & Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 