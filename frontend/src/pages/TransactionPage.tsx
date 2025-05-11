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
import { fetchNewInventory } from '../core/services/InventoryService';
import { getClientFromToken, updatePayment } from '../core/services/ClientService';
import { getChannelPartners } from '../core/services/ConfigService';
import Select from 'react-select';
import AutocompleteDropdown from '../components/AutocompleteDropdown';
import PrintQuoteDetails from '../components/PrintQuoteDetails';
import { getNewProjectNamesApi } from '../core/api/configApi';
import Modal from '../components/Modal';
// Removed the import of 'react-select' as it causes a lint error and is not used in the code

const TransactionPage: React.FC = () => {
  const { selectedProperties } = usePropertyContext();
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [tokenNumber, setTokenNumber] = useState('');
  const [allOldProperties, setAllOldProperties] = useState<Property[]>([]);
  const [selectedOldProperties, setSelectedOldProperties] = useState<Property[]>([]);
  const [newProject, setNewProject] = useState('');
  const [unitNo, setUnitNo] = useState('');
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
  const [propertyPaymentPlans, setPropertyPaymentPlans] = useState<{ [propertyId: string]: string }>({});
  const [customPlansByPropertyId, setCustomPlansByPropertyId] = useState<{ [propertyId: string]: { label: string; percent: number }[] }>({});
  const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);
  const [customMilestones, setCustomMilestones] = useState([{ label: '', percent: 0 }]);
  const [customPlanPropertyId, setCustomPlanPropertyId] = useState<string | null>(null);
  const [hasSearchedToken, setHasSearchedToken] = useState(false);

  // For dropdowns
  const [projectOptions, setProjectOptions] = useState<string[]>([]);
  const [unitOptions, setUnitOptions] = useState<string[]>([]);

  // Add state for editable rates and approval requests
  const [editedOldAssured, setEditedOldAssured] = useState<Record<string, number>>({});
  const [editedNewRates, setEditedNewRates] = useState<Record<string, number>>({});
  const [rateApprovalSent, setRateApprovalSent] = useState(false);
  const [rateApprovalMessage, setRateApprovalMessage] = useState<string>('');
  const [rateApprovalRequestId, setRateApprovalRequestId] = useState<string | null>(null);
  const [rateApprovalStatus, setRateApprovalStatus] = useState<string | null>(null);
  const [isApprovalSent, setIsApprovalSent] = useState(false);

  // New Customer state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerProperties, setNewCustomerProperties] = useState<Property[]>([]);
  const [newCustomerPaymentPlans, setNewCustomerPaymentPlans] = useState<{ [propertyId: string]: PaymentPlan }>({});
  const [showNewCustomerCostSheet, setShowNewCustomerCostSheet] = useState(false);

  // Helper for Old Unit Details table
  const oldFields = [
    { label: 'Project Name', get: (p: Property) => p.projectName },
    { label: 'Unit No.', get: (p: Property) => p.unitNo },
    { label: 'Area*', get: (p: Property) => p.superBuiltUpArea.toLocaleString('en-IN') },
    { label: 'Rate', get: (p: Property) => Math.round(p.rate).toLocaleString('en-IN') },
    { label: 'Total Consideration(With Tax)', get: (p: Property) => Math.round(p.superBuiltUpArea * p.rate).toLocaleString('en-IN') },
    { label: 'Sell @ premium price', get: (p: Property) => getEffectiveAssuredValue(p).toLocaleString('en-IN') },
    { label: 'Net Received(With Tax)', get: (p: Property) => Math.round(p.netReceived).toLocaleString('en-IN') },
    { label: 'Net Profit', get: (p: Property) => Math.round((getEffectiveAssuredValue(p) - p.rate) * p.superBuiltUpArea).toLocaleString('en-IN') },
    { label: 'Buyback Value', get: (p: Property) => Math.round(getEffectiveAssuredValue(p) * p.superBuiltUpArea).toLocaleString('en-IN') },
  ];
  const paymentPlanOptions = [
    { value: '', label: 'Choose a plan' },
    { value: 'res1', label: 'Residential Option 1 (30:30:30:10)' },
    { value: 'res2', label: 'Residential Option 2 (10:90)' },
    { value: 'comm', label: 'Commercial (45:55)' },
    { value: 'custom', label: 'Custom (Define your own plan)' },
  ];
  const newFields = [
    { label: 'Project Name', get: (p: Property) => p.projectName },
    { label: 'Unit No.', get: (p: Property) => p.unitNo },
    { label: 'Area*', get: (p: Property) => p.superBuiltUpArea.toLocaleString('en-IN') },
    { label: 'Rate', get: (p: Property) => getEffectiveRate(p).toLocaleString('en-IN') },
    { label: 'Total Consideration(Without Tax)', get: (p: Property) => Math.round(p.superBuiltUpArea * getEffectiveRate(p)).toLocaleString('en-IN') },
    { label: 'Payment Plan', get: (p: Property) => propertyPaymentPlans[p.id] ? (paymentPlanOptions.find(opt => opt.value === propertyPaymentPlans[p.id])?.label || propertyPaymentPlans[p.id]) : '-' },
  ];

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintQuoteOnly = useReactToPrint({
    contentRef: printRef,
    pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } }',
  });

  const handleTokenSearch = async () => {
    setHasSearchedToken(true);
    if (!tokenNumber) {
      setAllOldProperties([]);
      setSelectedOldProperties([]);
      return;
    }
    try {
      const response = await getClientFromToken(Number(tokenNumber)) as any;
      const clientData = response?.clientData ?? response;
      if (!clientData || !Array.isArray(clientData.soldInventories) || clientData.soldInventories.length === 0) {
        setAllOldProperties([]);
        setSelectedOldProperties([]);
        alert('Token not found or no properties for this token');
        return;
      }
      const mapped = clientData.soldInventories.map((rec: any, idx: number) => ({
        id: String(rec.id),
        srNo: idx + 1,
        projectName: rec.projectName,
        projectType: rec.projectType,
        unitNo: rec.unitNo,
        customerName: rec.buyerName || clientData.name,
        superBuiltUpArea: rec.builtUpArea,
        rate: rec.rate,
        totalConsideration: rec.totalConsideration,
        netReceived: rec.netReceived,
        assuredValue: rec.assuredPrice,
        soldOffer: rec.soldOffer,
      }));
      setAllOldProperties(mapped);
      setSelectedOldProperties(mapped);
    } catch (error) {
      setAllOldProperties([]);
      setSelectedOldProperties([]);
      alert('Error fetching client details for this token');
    }
  };

  const handleAddNewProperty = () => {
    if (!newProject || !unitNo) {
      alert('Please select a project and unit number');
      return;
    }
    // Find the property in filteredInventory
    const property = filteredInventory.find(
      p => p.projectName === newProject && p.unitNo === unitNo
    );
    if (!property) {
      alert('Selected property not found in inventory.');
      return;
    }
    setNewProperties([...newProperties, property]);
    // Set default payment plan based on projectType (case-insensitive)
    const defaultPlan = property.projectType && /commercial/i.test(property.projectType) ? 'comm' : 'res1';
    setPropertyPaymentPlans(prev => ({
      ...prev,
      [property.id]: prev[property.id] || defaultPlan,
    }));
    setNewProject('');
    setUnitNo('');
  };

  const handleRemoveNewProperty = (id: string) => {
    setNewProperties(newProperties.filter(p => p.id !== id));
  };

  const handleSubmit = async () => {
    // Validation: require all fields
    if (!amountPaid.trim()) {
      alert('Amount Paid is required.');
      return;
    }
    if (!paymentMode.trim()) {
      alert('Payment Mode is required.');
      return;
    }
    if (!chequeUTR.trim()) {
      alert('Reference Number is required.');
      return;
    }
    if (!selectedCPId && (!customCPName.trim() || !customCPNumber.trim())) {
      alert('Please select a channel partner or enter both custom channel partner name and contact.');
      return;
    }
    try {
      await updatePayment(Number(tokenNumber), {
        amountPaid: Number(amountPaid),
        paymentMode: paymentMode,
        paymentId: Number(chequeUTR) || 0,
        channelPartnerId: selectedCPId && selectedCPId !== 'custom' ? selectedCPId : undefined,
        customChannelPartnerName: !selectedCPId && customCPName ? customCPName : undefined,
        customChannelPartnerNumber: !selectedCPId && customCPNumber ? customCPNumber : undefined,
      });
    } catch (e) {
      alert('Failed to update payment!');
      return;
    }
    alert('Transaction submitted successfully');
  };

  const handlePrintQuote = () => {
    alert('Printing quote...');
  };

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // New search handler for Search button
  const handleNewSearch = () => {
    setPage(1);
    // Call handleSearch directly for new search
    setTimeout(() => handleSearch(), 0);
  };

  // Add state for new property search pagination
  const [newPage, setNewPage] = useState(1);
  const [newPageSize] = useState(10);
  const [newTotalPages, setNewTotalPages] = useState(1);
  const [newTotalCount, setNewTotalCount] = useState(0);

  const handleSearch = async () => {
    setIsLoadingInventory(true);
    try {
      const result = await fetchNewInventory(
        newPage,
        newPageSize,
        newProjectSearch || undefined,
        newUnitNoSearch || undefined
      );
      console.log('API result:', result);
      // Handle if result is wrapped in 'newInventories'
      const pagedResult = (result && (result as any).newInventories) ? (result as any).newInventories : result;
      console.log('Paged result used:', pagedResult);
      const mappedInventory = (pagedResult.items || []).map((item: any, idx: number) => ({
        id: item.id,
        srNo: (newPage - 1) * newPageSize + idx + 1,
        projectName: item.projectName,
        projectType: item.projectType,
        unitNo: item.unitNo,
        customerName: '',
        superBuiltUpArea: item.builtUpArea,
        rate: item.rate,
        totalConsideration: item.totalConsideration,
        netReceived: 0,
        assuredValue: 0,
        bookingAmount: item.bookingAmount,
        newOffer: item.newOffer, // include newOffer if present
      }));
      console.log('Mapped inventory for table:', mappedInventory);
      setFilteredInventory(mappedInventory);
      setNewTotalPages(pagedResult.totalPages || 1);
      setNewTotalCount(pagedResult.totalCount || 0);
    } catch (error) {
      setFilteredInventory([]);
      setNewTotalPages(1);
      setNewTotalCount(0);
      window.alert('Error fetching inventory.');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };

  // Pagination controls for new property search
  const handlePrevNewPage = () => {
    if (newPage > 1) {
      setNewPage(newPage - 1);
    }
  };
  const handleNextNewPage = () => {
    if (newPage < newTotalPages) {
      setNewPage(newPage + 1);
    }
  };

  // Refetch inventory when page changes
  React.useEffect(() => {
    if (page > 1 || (newProjectSearch || newUnitNoSearch)) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [page]);

  // Refetch inventory when newPage changes
  React.useEffect(() => {
    if (newProjectSearch || newUnitNoSearch) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [newPage]);

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

  // 1. Add a utility to get unique customer names
  const uniqueCustomerNames = Array.from(new Set(allOldProperties.map(p => p.customerName)));

  React.useEffect(() => {
    // Fetch project names on mount using API for fresh data
    getNewProjectNamesApi().then((projectDtos = []) => {
      setProjectOptions(projectDtos.map(p => p.projectName).filter(Boolean));
    }).catch(() => setProjectOptions([]));
  }, []);

  const [selectedCPId, setSelectedCPId] = useState('');
  const [channelPartners, setChannelPartners] = useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    const partners = getChannelPartners() || [];
    setChannelPartners(partners);
  }, []);

  const [customCPName, setCustomCPName] = useState('');
  const [customCPNumber, setCustomCPNumber] = useState('');

  const cpOptions = [
    ...channelPartners.map(cp => ({ value: cp.id, label: cp.name })),
    { value: 'custom', label: 'Other (Custom)' }
  ];

  // Returns the effective rate for a property: offer > edited > original
  const getEffectiveRate = (property: Property) => {
    if (property.newOffer !== undefined && property.newOffer > 0) {
      return property.rate - property.newOffer;
    }
    if (editedNewRates[String(property.id)] !== undefined) {
      return editedNewRates[String(property.id)];
    }
    return property.rate;
  };

  // Returns the effective assured value for a property: (edited or original assuredValue) + soldOffer
  const getEffectiveAssuredValue = (property: Property) => {
    const base = editedOldAssured[String(property.id)] !== undefined
      ? editedOldAssured[String(property.id)]
      : property.assuredValue;
    const offer = property.soldOffer || 0;
    return Number(base) + Number(offer);
  };

  // Prepare cost sheet data for print
  const costSheetData = newProperties.map((property) => {
    // Use edited assured values for calculations
    const editedOlds = selectedOldProperties.map(p => ({
      ...p,
      assuredValue: editedOldAssured[String(p.id)] !== undefined ? editedOldAssured[String(p.id)] : p.assuredValue,
    }));
    const editedNew = {
      ...property,
      rate: getEffectiveRate(property),
    };
    // Recalculate total paid and premium with edited assured values
    const totalPaidAmount = editedOlds.reduce((sum, p) => sum + (p.netReceived || 0), 0);
    const totalPremium = editedOlds.reduce((sum, p) => sum + ((p.assuredValue && p.rate) ? (p.assuredValue - p.rate) * p.superBuiltUpArea : 0), 0);
    // Proportional split logic
    const allNewTCVs = newProperties.map(np => np.superBuiltUpArea * getEffectiveRate(np));
    const sumNewTCV = allNewTCVs.reduce((sum, tcv) => sum + tcv, 0);
    const thisTCV = editedNew.superBuiltUpArea * getEffectiveRate(property);
    const share = sumNewTCV > 0 ? thisTCV / sumNewTCV : 0;
    const proportionalPaidAmount = totalPaidAmount * share;
    const proportionalPremium = totalPremium * share;
    // If no old properties, treat all values as zero
    const costSheetOlds = editedOlds.length > 0 ? editedOlds : [];
    const costSheetTotalPaid = editedOlds.length > 0 ? proportionalPaidAmount : 0;
    const costSheetTotalPremium = editedOlds.length > 0 ? proportionalPremium : 0;
    let paymentPlan: PaymentPlan;
    const planKey = propertyPaymentPlans[property.id];
    if (planKey === 'custom') {
      paymentPlan = customPlansByPropertyId[property.id] || [];
    } else if (planKey === '' || planKey === undefined) {
      paymentPlan = 'res1';
    } else {
      paymentPlan = planKey as PaymentPlan;
    }
    return {
      oldProperties: costSheetOlds,
      newProperty: editedNew,
      paymentPlan,
      totalPaidAmount: costSheetTotalPaid,
      totalPremium: costSheetTotalPremium,
      numNewProperties: newProperties.length,
    };
  });

  // Add isPaymentDetailsFilled for payment section button disabling
  const isPaymentDetailsFilled = amountPaid && paymentMode && chequeUTR && ((selectedCPId && selectedCPId !== 'custom') || (customCPName && customCPNumber));

  const handlePaymentPlanChange = (propertyId: string, value: string) => {
    setIsApprovalSent(false);
    let plan: { label: string; percent: number }[] = [];
    if (value === 'custom') {
      setCustomPlanPropertyId(propertyId);
      setCustomMilestones([{ label: '', percent: 0 }]);
      setShowCustomPlanModal(true);
      return;
    } else if (value === 'res1') {
      plan = [
        { label: 'Milestone 1', percent: 30 },
        { label: 'Milestone 2', percent: 30 },
        { label: 'Milestone 3', percent: 30 },
        { label: 'Milestone 4', percent: 10 },
      ];
    } else if (value === 'res2') {
      plan = [
        { label: 'Milestone 1', percent: 10 },
        { label: 'Milestone 2', percent: 90 },
      ];
    } else if (value === 'comm') {
      plan = [
        { label: 'Milestone 1', percent: 45 },
        { label: 'Milestone 2', percent: 55 },
      ];
    }
    setPropertyPaymentPlans((prev) => ({ ...prev, [propertyId]: value }));
    if (plan.length > 0) openDiscAdjModal(propertyId, plan);
  };

  const handleCustomMilestoneChange = (idx: number, field: 'label' | 'percent', value: string) => {
    setCustomMilestones((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: field === 'percent' ? Number(value) : value } : m));
  };

  const handleAddMilestone = () => {
    if (customMilestones.length < 10) {
      setCustomMilestones((prev) => [...prev, { label: '', percent: 0 }]);
    }
  };

  const handleRemoveMilestone = (idx: number) => {
    setCustomMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  const customTotalPercent = customMilestones.reduce((sum, m) => sum + Number(m.percent), 0);
  const customPlanWarning = customTotalPercent !== 100;
  const canSubmitCustomPlan = customMilestones.length > 0 && !customPlanWarning && customMilestones.every(m => m.label && m.percent > 0);

  const handleSubmitCustomPlan = () => {
    if (customPlanPropertyId && canSubmitCustomPlan) {
      const plan = customMilestones.map(m => ({ label: m.label, percent: Number(m.percent) }));
      setCustomPlansByPropertyId((prev) => ({ ...prev, [customPlanPropertyId]: plan }));
      setPropertyPaymentPlans((prev) => ({ ...prev, [customPlanPropertyId]: 'custom' }));
      setShowCustomPlanModal(false);
      setCustomPlanPropertyId(null);
      openDiscAdjModal(customPlanPropertyId, plan);
    }
  };

  const [discAdjByPropertyId, setDiscAdjByPropertyId] = useState<{ [propertyId: string]: number[] }>({});
  const [showDiscAdjModal, setShowDiscAdjModal] = useState(false);
  const [discAdjMilestones, setDiscAdjMilestones] = useState<{ label: string; paymentPercent: number; discAdjPercent: number }[]>([]);
  const [discAdjPropertyId, setDiscAdjPropertyId] = useState<string | null>(null);

  // Helper to open Disc. Adj. modal for a property and plan
  const openDiscAdjModal = (propertyId: string, plan: { label: string; percent: number }[]) => {
    setDiscAdjPropertyId(propertyId);
    setDiscAdjMilestones(plan.map((m, i) => ({
      label: m.label,
      paymentPercent: m.percent,
      discAdjPercent: m.percent,
    })));
    setShowDiscAdjModal(true);
  };

  // Disc. Adj. modal logic
  const discAdjTotal = discAdjMilestones.reduce((sum, m) => sum + Number(m.discAdjPercent), 0);
  const discAdjWarning = discAdjTotal !== 100;
  const canSubmitDiscAdj = discAdjMilestones.length > 0 && !discAdjWarning && discAdjMilestones.every(m => m.discAdjPercent >= 0);
  const handleDiscAdjChange = (idx: number, value: string) => {
    setDiscAdjMilestones((prev) => prev.map((m, i) => i === idx ? { ...m, discAdjPercent: Number(value) } : m));
    setIsApprovalSent(false);
  };
  const handleSubmitDiscAdj = () => {
    if (discAdjPropertyId && canSubmitDiscAdj) {
      setDiscAdjByPropertyId((prev) => ({ ...prev, [discAdjPropertyId]: discAdjMilestones.map(m => Number(m.discAdjPercent)) }));
      setShowDiscAdjModal(false);
      setDiscAdjPropertyId(null);
    }
  };

  const handleRateEdit = (propertyId: string, value: number) => {
    setEditedNewRates(r => ({ ...r, [String(propertyId)]: value }));
    setIsApprovalSent(false);
  };

  const handleOldAssuredEdit = (propertyId: string, value: number) => {
    setEditedOldAssured(r => ({ ...r, [String(propertyId)]: value }));
    setIsApprovalSent(false);
  };

  const [showApprovalReview, setShowApprovalReview] = useState(false);
  const [approvalPayload, setApprovalPayload] = useState<any>(null);

  const handleSendForApproval = () => {
    const payload = {
      tokenNumber,
      customer: {
        name: newCustomerName,
        email: newCustomerEmail,
        phone: newCustomerPhone,
      },
      oldProperties: selectedOldProperties.map(p => {
        const obj: any = { id: p.id };
        // Only include assuredValue if changed
        const edited = editedOldAssured[String(p.id)];
        if (edited !== undefined && Number(edited) !== Number(p.assuredValue)) {
          obj.assuredValue = edited;
        }
        // Optionally include rate if you want to track rate edits for old properties (if editable)
        return obj;
      }),
      newProperties: newProperties.map(p => {
        const planKey = propertyPaymentPlans[p.id];
        const isCustom = planKey === 'custom';
        const originalRate = p.rate;
        const editedRate = editedNewRates[String(p.id)];
        const obj: any = { id: p.id };
        // Only include rate if changed
        if (editedRate !== undefined && editedRate !== originalRate) {
          obj.rate = editedRate;
        }
        if (isCustom) {
          obj.paymentPlan = planKey;
          obj.customPlan = customPlansByPropertyId[String(p.id)];
        }
        return obj;
      }),
    };
    setApprovalPayload(payload);
    setShowApprovalReview(true);
  };

  const handleConfirmSendForApproval = async () => {
    // await sendApprovalRequest(approvalPayload); // Call your API here
    setIsApprovalSent(true);
    setShowApprovalReview(false);
  };

  // Utility to check if there are any changes to send for approval
  const hasApprovalChanges =
    Object.keys(editedOldAssured).some(id => Number(editedOldAssured[id]) !== Number(selectedOldProperties.find(p => String(p.id) === id)?.assuredValue)) ||
    Object.keys(editedNewRates).some(id => Number(editedNewRates[id]) !== Number(newProperties.find(p => String(p.id) === id)?.rate)) ||
    newProperties.some(p => propertyPaymentPlans[p.id] === 'custom');

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
              setAllOldProperties([]);
              setSelectedOldProperties([]);
              setHasSearchedToken(false);
            }}
            className="px-4 text-base font-semibold rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Clear
          </Button>
        </div>
        {allOldProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
            <table className="min-w-full rounded overflow-hidden text-sm border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-1 border text-center w-10 text-gray-500 text-xs" title="Select property">Select</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Project Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Unit No.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Customer Name</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Area*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Rate* [all inc]</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration(With Tax) in Cr.</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Sell @ premium price*</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Net Profit (Cr.)</th>
                  <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Buyback Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {allOldProperties.map((property) => {
                  const isSelected = selectedOldProperties.some(p => String(p.id) === String(property.id));
                  return (
                    <tr key={property.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <td className="p-1 border text-center align-middle bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          aria-label="Select property"
                          title="Select property"
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                          onChange={() => {
                            if (isSelected) {
                              setSelectedOldProperties(selectedOldProperties.filter(p => String(p.id) !== String(property.id)));
                            } else {
                              setSelectedOldProperties([...selectedOldProperties, property]);
                            }
                          }}
                        />
                      </td>
                      <td className="p-1 border align-middle">{property.projectName}</td>
                      <td className="p-1 border align-middle">{property.unitNo}</td>
                      <td className="p-1 border align-middle">{property.customerName}</td>
                      <td className="p-1 border align-middle">{Math.round(property.superBuiltUpArea).toLocaleString('en-IN')}</td>
                      <td className="p-1 border align-middle">{Math.round(property.rate).toLocaleString('en-IN')}</td>
                      <td className="p-1 border align-middle">{(property.totalConsideration / 10000000).toFixed(2)}</td>
                      <td className="p-1 border align-middle">{getEffectiveAssuredValue(property).toLocaleString('en-IN')}</td>
                      <td className="p-1 border align-middle">{(((getEffectiveAssuredValue(property) - property.rate) * property.superBuiltUpArea) / 10000000).toFixed(2)}</td>
                      <td className="p-1 border align-middle">{Math.round((getEffectiveAssuredValue(property) * property.superBuiltUpArea) / 10000000).toFixed(2)}</td>
                    </tr>
                  );
                })}
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
            <AutocompleteDropdown
              options={projectOptions.map(p => ({ projectName: p }))}
              value={newProjectSearch}
              onChange={val => {
                setNewProjectSearch(val);
                setNewUnitNoSearch('');
              }}
              placeholder="Select or type project name"
            />
          </div>
          <div>
            <label htmlFor="newUnitNoSearch" className="block text-sm font-medium text-gray-700 mb-1">Unit No</label>
            <input
              type="text"
              id="newUnitNoSearch"
              placeholder="Enter unit number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={newUnitNoSearch}
              onChange={e => setNewUnitNoSearch(e.target.value)}
            />
          </div>
              <div className="md:col-span-2 flex justify-end items-end gap-2">
            <Button onClick={() => { setNewPage(1); setTimeout(() => handleSearch(), 0); }} className="px-6 text-base font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
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
                <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration (Without Tax)</th>
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
                          if (!isSelected) {
                            setNewProperties([...newProperties, property]);
                            // Set default payment plan based on projectType (case-insensitive)
                            const defaultPlan = property.projectType && /commercial/i.test(property.projectType) ? 'comm' : 'res1';
                            setPropertyPaymentPlans(prev => ({
                              ...prev,
                              [property.id]: prev[property.id] || defaultPlan,
                            }));
                          }
                        }}
                      />
                    </td>
                    <td className="p-1 border">{property.srNo}</td>
                    <td className="p-1 border">{property.projectName}</td>
                    <td className="p-1 border">{property.projectType}</td>
                    <td className="p-1 border">{property.unitNo}</td>
                    <td className="p-1 border">{Math.round(property.superBuiltUpArea).toLocaleString('en-IN')}</td>
                    <td className="p-1 border">{Math.round(property.rate).toLocaleString('en-IN')}</td>
                    <td className="p-1 border">{property.totalConsideration.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoadingInventory ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No properties found.</div>
          ) : null}
          {/* Pagination Controls for new property search */}
          {newTotalPages > 1 && (
            <div className="flex flex-col items-center mt-4 gap-2">
              <div className="text-sm text-gray-600 mb-2 text-center">
                {newTotalCount > 0 && (
                  <>
                    Showing <b>{(newPage - 1) * newPageSize + 1}</b>-
                    <b>{Math.min(newPage * newPageSize, newTotalCount)}</b> of <b>{newTotalCount}</b> results
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 justify-center">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={handlePrevNewPage}
                  disabled={newPage === 1 || isLoadingInventory}
                >
                  Previous
                </button>
                <span className="text-base text-gray-700">Page <b>{newPage}</b> of <b>{newTotalPages}</b></span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={handleNextNewPage}
                  disabled={newPage === newTotalPages || isLoadingInventory}
                >
                  Next
                </button>
              </div>
            </div>
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
                    <th className="p-1 border text-left font-semibold text-gray-800 bg-blue-50 text-sm">Total Consideration (Without Tax)</th>
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
                      <td className="p-1 border">{Math.round(property.superBuiltUpArea).toLocaleString('en-IN')}</td>
                      <td className="p-1 border">{Math.round(property.rate).toLocaleString('en-IN')}</td>
                      <td className="p-1 border">{property.totalConsideration.toLocaleString('en-IN')}</td>
                      <td className="p-1 border">
                        <Select
                          value={paymentPlanOptions.find(opt => opt.value === propertyPaymentPlans[property.id]) || paymentPlanOptions[0]}
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
      {(newProperties.length > 0) && (
        <>
          {/* Hidden print area for quote only */}
          <div style={{ display: 'none' }}>
            <PrintQuoteDetails
              ref={printRef}
              customerNames={uniqueCustomerNames}
              token={tokenNumber}
              costSheetData={costSheetData}
              oldProperties={selectedOldProperties}
              newProperties={newProperties}
            />
          </div>
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col items-center">
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
                {/* Only show Old Unit Details if there are selected old properties */}
                {selectedOldProperties.length > 0 && (
                  <div className="mb-4 bg-white rounded-lg shadow border border-gray-200 p-3 avoid-break-inside">
                    <h4 className="text-base font-bold mb-2 text-blue-900 tracking-wide border-b border-blue-100 pb-1 bg-blue-50 rounded-t">Old Unit Details</h4>
                    <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
                    <table className="min-w-full rounded overflow-hidden text-sm avoid-break-inside">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="p-1 border text-left font-medium">Field</th>
                          {selectedOldProperties.map((p, idx) => (
                            <th key={p.id} className="p-1 border text-left font-medium">Prop {idx + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-100">
                        {oldFields.map(field => (
                          <tr key={field.label}>
                            <td className="p-1 border font-semibold text-blue-800 bg-blue-50 whitespace-nowrap">{field.label}</td>
                            {selectedOldProperties.map(p => (
                              <td key={p.id} className="p-1 border text-gray-700 whitespace-nowrap">
                                {field.label === 'Sell @ premium price' ? (
                                  <div className="flex flex-col items-start gap-1">
                                    <input
                                      type="number"
                                      className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      value={editedOldAssured[String(p.id)] !== undefined ? editedOldAssured[String(p.id)] : p.assuredValue}
                                      onChange={e => {
                                        const val = Number(e.target.value);
                                        if (isNaN(val) || val < p.assuredValue) return;
                                        if (val === p.assuredValue) {
                                          setEditedOldAssured(r => {
                                            const copy = { ...r };
                                            delete copy[String(p.id)];
                                            return copy;
                                          });
                                        } else {
                                          setEditedOldAssured(r => ({ ...r, [String(p.id)]: val }));
                                        }
                                      }}
                                      disabled={rateApprovalSent}
                                    />
                                    {/* Show the offer badge below the input, only if offer > 0 */}
                                    {(p.soldOffer || 0) > 0 && (
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
                                        <span className="mr-1">⭐</span>Offer: {(p.soldOffer ?? 0).toLocaleString('en-IN')}
                                      </span>
                                    )}
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
                      {(() => {
                        const totalBuyback = Math.round(
                          selectedOldProperties.reduce((sum, p) => sum + (getEffectiveAssuredValue(p) * p.superBuiltUpArea), 0)
                        );
                        const croreValue = (totalBuyback / 10000000).toFixed(2);
                        return (
                          <>
                            Total Buyback Value: {totalBuyback.toLocaleString('en-IN')} <span className="text-gray-600 text-base">({croreValue} Cr.)</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
                {/* New Unit Details Table with payment plan dropdowns */}
                {newProperties.length > 0 && (
                  <div className="mb-4 bg-white rounded-lg shadow border border-green-200 p-3 avoid-break-inside">
                    <h4 className="text-base font-bold mb-2 text-green-900 tracking-wide border-b border-green-100 pb-1 bg-green-50 rounded-t">New Unit Details</h4>
                    <div className="mb-2 text-xs text-gray-600 font-medium">* Area and rates: sq. yards for plots, sq. ft. for others</div>
                    <div className="max-w-full overflow-x-auto border border-green-100 rounded bg-green-50">
                      <table className="min-w-max rounded overflow-hidden text-sm avoid-break-inside">
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
                                    <div className="flex flex-col items-start gap-1">
                                      <input
                                        type="number"
                                        className="w-24 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={editedNewRates[String(p.id)] !== undefined ? editedNewRates[String(p.id)] : p.rate}
                                        min={0}
                                        onChange={e => {
                                          const val = Number(e.target.value);
                                          if (isNaN(val) || val > p.rate) return;
                                          if (val === p.rate) {
                                            setEditedNewRates(r => {
                                              const copy = { ...r };
                                              delete copy[String(p.id)];
                                              return copy;
                                            });
                                          } else {
                                            setEditedNewRates(r => ({ ...r, [String(p.id)]: val }));
                                          }
                                        }}
                                        disabled={rateApprovalSent}
                                      />
                                      {p.newOffer !== undefined && p.newOffer > 0 && (
                                        <span className="text-xs font-bold mt-1 inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-300">
                                          <span className="mr-1">⭐</span>Offer: {Math.round(p.newOffer).toLocaleString('en-IN')}
                                        </span>
                                      )}
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
                    </div>
                    {/* Mini section for Total New TCV and Upgrade Ratio */}
                    <div className="flex flex-col items-start mt-4 gap-2">
                      <div className="text-base font-semibold text-green-900">
                        {(() => {
                          const totalNewTCV = Math.round(
                            newProperties.reduce((sum, p) => sum + getEffectiveRate(p) * p.superBuiltUpArea, 0)
                          );
                          const croreValue = (totalNewTCV / 10000000).toFixed(2);
                          return (
                            <>
                              Total New TCV: {totalNewTCV.toLocaleString('en-IN')} <span className="text-gray-600 text-base">({croreValue} Cr.)</span>
                            </>
                          );
                        })()}
                      </div>
                      <div className="mt-2 text-base font-semibold text-blue-900 flex items-center gap-2">
                        <div className="relative group inline-block">
                          <span className="underline decoration-dotted cursor-help">
                            Upgrade Ratio:
                          </span>
                          <div className="absolute left-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1 whitespace-nowrap">
                            Upgrade Ratio = Total New TCV / Total Buyback Value
                          </div>
                        </div>
                        {(() => {
                          const totalNewTCV = newProperties.reduce((sum, p) => sum + getEffectiveRate(p) * p.superBuiltUpArea, 0);
                          const totalBuyback = selectedOldProperties.reduce((sum, p) => sum + (getEffectiveAssuredValue(p) * p.superBuiltUpArea), 0);
                          return totalBuyback > 0 ? (totalNewTCV / totalBuyback).toFixed(2) : '-';
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                {/* Approval status and refresh */}
                {rateApprovalSent && (
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
                            const prop = selectedOldProperties.find(p => String(p.id) === String(id));
                            if (!prop || Number(newAssured) === Number(prop.assuredValue)) return null;
                            return (
                              <li key={id} className="flex gap-4 items-center">
                                <span className="text-gray-700">Old Property <b>{prop.unitNo}</b>:</span>
                                <span className="text-gray-500">Old Assured Value: <s>{getEffectiveAssuredValue(prop).toLocaleString('en-IN')}</s></span>
                                <span className="text-blue-700 font-semibold">New Assured Value: {newAssured.toLocaleString('en-IN')}</span>
                              </li>
                            );
                          })}
                          {/* New Property Rate Changes */}
                          {Object.entries(editedNewRates).map(([id, newRate]) => {
                            const prop = newProperties.find(p => String(p.id) === String(id));
                            if (!prop || Number(newRate) === Number(prop.rate)) return null;
                            return (
                              <li key={id} className="flex gap-4 items-center">
                                <span className="text-gray-700">New Property <b>{prop.unitNo}</b>:</span>
                                <span className="text-gray-500">Old Rate: <s>{prop.rate.toLocaleString('en-IN')}</s></span>
                                <span className="text-blue-700 font-semibold">New Rate: {newRate.toLocaleString('en-IN')}</span>
                              </li>
                            );
                          })}
                          {/* If no changes, show a message */}
                          {Object.values(editedOldAssured).filter((newAssured, i) => {
                            const prop = selectedOldProperties.find(p => String(p.id) === String(Object.keys(editedOldAssured)[i]));
                            return prop && Number(newAssured) !== Number(prop.assuredValue ?? 0);
                          }).length === 0 &&
                          Object.values(editedNewRates).filter((newRate, i) => {
                            const prop = newProperties.find(p => String(p.id) === String(Object.keys(editedNewRates)[i]));
                            return prop && Number(newRate) !== Number(prop.rate ?? 0);
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
                  const editedOlds = selectedOldProperties.map(p => ({
                    ...p,
                    assuredValue: editedOldAssured[String(p.id)] !== undefined ? editedOldAssured[String(p.id)] : p.assuredValue,
                  }));
                  const editedNew = {
                    ...property,
                    rate: getEffectiveRate(property),
                  };
                  // Recalculate total paid and premium with edited assured values
                  const totalPaidAmount = editedOlds.reduce((sum, p) => sum + (p.netReceived || 0), 0);
                  const totalPremium = editedOlds.reduce((sum, p) => sum + ((p.assuredValue && p.rate) ? (p.assuredValue - p.rate) * p.superBuiltUpArea : 0), 0);

                  // Proportional split logic
                  const allNewTCVs = newProperties.map(np => np.superBuiltUpArea * getEffectiveRate(np));
                  const sumNewTCV = allNewTCVs.reduce((sum, tcv) => sum + tcv, 0);
                  const thisTCV = editedNew.superBuiltUpArea * getEffectiveRate(property);
                  const share = sumNewTCV > 0 ? thisTCV / sumNewTCV : 0;
                  const proportionalPaidAmount = totalPaidAmount * share;
                  const proportionalPremium = totalPremium * share;

                  // If no old properties, treat all values as zero
                  const costSheetOlds = editedOlds.length > 0 ? editedOlds : [];
                  const costSheetTotalPaid = editedOlds.length > 0 ? proportionalPaidAmount : 0;
                  const costSheetTotalPremium = editedOlds.length > 0 ? proportionalPremium : 0;

                  return (
                    <React.Fragment key={property.id}>
                      <CostSheet
                        key={property.id}
                        oldProperties={costSheetOlds}
                        newProperty={editedNew}
                        paymentPlan={propertyPaymentPlans[property.id] === 'custom' ? customPlansByPropertyId[String(property.id)] : propertyPaymentPlans[property.id] as PaymentPlan}
                        totalPaidAmount={costSheetTotalPaid}
                        totalPremium={costSheetTotalPremium}
                        numNewProperties={newProperties.length}
                        discAdjPercents={discAdjByPropertyId[String(property.id)]}
                      />
                    </React.Fragment>
                  );
                })}
                {/* Place Send for Approval and Reset left, Print Quote Only right */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-4">
                    {hasApprovalChanges && (
                      <>
                        <Button
                          onClick={() => {
                            setEditedOldAssured({});
                            setEditedNewRates({});
                            // Remove custom plans for new properties
                            setCustomPlansByPropertyId(prev => {
                              const copy = { ...prev };
                              newProperties.forEach(p => {
                                if (propertyPaymentPlans[p.id] === 'custom') {
                                  delete copy[p.id];
                                }
                              });
                              return copy;
                            });
                            // Reset payment plans to default for custom ones
                            setPropertyPaymentPlans(prev => {
                              const copy = { ...prev };
                              newProperties.forEach(p => {
                                if (copy[p.id] === 'custom') {
                                  copy[p.id] = p.projectType && /commercial/i.test(p.projectType) ? 'comm' : 'res1';
                                }
                              });
                              return copy;
                            });
                            setIsApprovalSent(false);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow"
                        >
                          Reset Changes
                        </Button>
                        <Button
                          onClick={handleSendForApproval}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded shadow"
                          disabled={isApprovalSent}
                        >
                          Send for Approval
                        </Button>
                      </>
                    )}
                  </div>
                  <div>
                    <Button
                      onClick={handlePrintQuoteOnly}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow"
                      disabled={hasApprovalChanges && !isApprovalSent}
                    >
                      Print Quote Only
                    </Button>
                  </div>
                </div>
                {/* Banner if not approved */}
                {!isApprovalSent && hasApprovalChanges && (
                  <div className="mb-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-2 text-center">
                    You must send your changes for approval before printing the quote.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* 4. Printing and Payment Section (only after cost sheet is computed) */}
      {showCostSheet && (newProperties.length > 0) && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6">
          <h2 className="text-base font-bold mb-4 text-blue-900 tracking-wide border-b border-blue-100 pb-2 bg-blue-50 rounded-t px-2">4. Payment details</h2>
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
                      onChange={(option) => {
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
              onClick={handleSubmit}
              className={`bg-green-600 hover:bg-green-700 text-base font-semibold rounded px-6 py-2 text-white ${!isPaymentDetailsFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isPaymentDetailsFilled}
            >
              Submit and Print
            </Button>
          </div>
        </div>
      )}
    </div>
  )}

  {/* New Customer Flow */}
  {activeTab === 'new' && (
    <NewCustomerTransactionPage />
  )}

  {/* Custom Plan Modal */}
  <Modal open={showCustomPlanModal} onClose={() => {
    setShowCustomPlanModal(false);
    setCustomPlanPropertyId(null);
    setCustomMilestones([{ label: '', percent: 0 }]);
  }}>
    <div className="p-6 max-w-lg mx-auto relative">
      {/* Close button */}
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Close"
        onClick={() => {
          setShowCustomPlanModal(false);
          setCustomPlanPropertyId(null);
          setCustomMilestones([{ label: '', percent: 0 }]);
        }}
      >
        &times;
      </button>
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

  {/* Disc. Adj. Modal */}
  <Modal open={showDiscAdjModal} onClose={() => {}}>
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4">Distribute Disc. Adjustment (Net Profit)</h2>
      <div className="space-y-2">
        {discAdjMilestones.map((milestone, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="w-1/3 font-medium">{milestone.label} ({milestone.paymentPercent}%)</span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Disc. Adj. %"
              className="border p-1 rounded w-24"
              value={milestone.discAdjPercent}
              onChange={e => handleDiscAdjChange(idx, e.target.value)}
            />
            <span className="text-gray-500">%</span>
          </div>
        ))}
        <div className="flex justify-between items-center mt-2">
          <span className={discAdjWarning ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>
            Total: {discAdjTotal}%
          </span>
        </div>
        {discAdjWarning && (
          <div className="text-red-600 text-sm mt-1">Total Disc. Adj. % must be exactly 100%.</div>
        )}
        <button
          type="button"
          className={`mt-4 w-full py-2 rounded ${canSubmitDiscAdj ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          onClick={handleSubmitDiscAdj}
          disabled={!canSubmitDiscAdj}
        >
          Save Distribution
        </button>
      </div>
    </div>
  </Modal>

  {/* Approval Review Modal */}
  <Modal open={showApprovalReview} onClose={() => setShowApprovalReview(false)}>
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Review Changes Before Sending for Approval</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Old Properties</h3>
        <table className="min-w-full text-sm border mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 border">Unit No.</th>
              <th className="p-1 border">Rate</th>
              <th className="p-1 border">Assured Value</th>
              <th className="p-1 border">Edited Assured Value</th>
            </tr>
          </thead>
          <tbody>
            {approvalPayload?.oldProperties.map((p: any, idx: number) => (
              <tr key={p.id}>
                <td className="p-1 border">{selectedOldProperties.find(op => op.id === p.id)?.unitNo}</td>
                <td className="p-1 border">{p.rate}</td>
                <td className="p-1 border">{p.assuredValue}</td>
                <td className={`p-1 border ${p.editedAssuredValue !== undefined ? 'bg-yellow-100 font-bold' : ''}`}>{p.editedAssuredValue !== undefined ? p.editedAssuredValue : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="font-semibold mb-2">New Properties</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 border">Unit No.</th>
              <th className="p-1 border">Rate</th>
              <th className="p-1 border">Edited Rate</th>
              <th className="p-1 border">Custom Plan</th>
            </tr>
          </thead>
          <tbody>
            {approvalPayload?.newProperties.map((p: any, idx: number) => (
              <tr key={p.id}>
                <td className="p-1 border">{newProperties.find(np => np.id === p.id)?.unitNo}</td>
                <td className="p-1 border">{p.rate}</td>
                <td className={`p-1 border ${p.editedRate !== undefined ? 'bg-yellow-100 font-bold' : ''}`}>{p.editedRate !== undefined ? p.editedRate : '-'}</td>
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
</div>
);
};

export default TransactionPage;