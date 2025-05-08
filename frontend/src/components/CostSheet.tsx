import React from 'react';
import { Property, PaymentPlan } from '../types';

interface CostSheetProps {
  oldProperties: Property[];
  newProperty: Property;
  paymentPlan: PaymentPlan;
  totalPaidAmount: number;
  totalPremium: number;
  numNewProperties: number;
}

const CostSheet: React.FC<CostSheetProps> = ({ oldProperties, newProperty, paymentPlan, totalPaidAmount, totalPremium, numNewProperties }) => {
  // Payment plan calculations
  const bookingAmount = 500000;
  // Distribute paid and premium equally among new properties
  const perPropertyPaidAmount = numNewProperties > 0 ? totalPaidAmount / numNewProperties : 0;
  const perPropertyPremium = numNewProperties > 0 ? totalPremium / numNewProperties : 0;
  const newUnitTCVActual = newProperty.superBuiltUpArea * newProperty.rate;
  const remainingAmount = newUnitTCVActual - bookingAmount;

  // Payment plan splits
  let planSplits: { label: string; percent: number; }[] = [];
  if (paymentPlan === 'res1') {
    planSplits = [
      { label: 'Within 30 Days of Booking (Less Earlier Paid)', percent: 30 },
      { label: 'On Completion of Super Structure', percent: 30 },
      { label: 'On Application of OC', percent: 30 },
      { label: '2 Years From Application of OC', percent: 10 },
    ];
  } else if (paymentPlan === 'res2') {
    planSplits = [
      { label: 'Within 30 Days of Booking (Less Earlier Paid)', percent: 10 },
      { label: 'On Application of OC', percent: 90 },
    ];
  } else if (paymentPlan === 'comm') {
    planSplits = [
      { label: 'Within 30 Days of Booking (Less Earlier Paid)', percent: 45 },
      { label: 'On Application of OC', percent: 55 },
    ];
  }

  // Calculate installment, FT adjustment, disc adjustment, net payable for each split
  let rows: { label: string; percent: number; installment: number; ftAdj: number; discAdj: number; netPayable: number }[] = [];
  let totalInstallment = 0;
  let totalFTAdj = 0;
  let totalDiscAdj = 0;
  let totalNetPayable = 0;

  planSplits.forEach((split, idx) => {
    const installment = remainingAmount * (split.percent / 100);
    const ftAdj = perPropertyPaidAmount * (split.percent / 100);
    const discAdj = perPropertyPremium * (split.percent / 100);
    const netPayable = installment - ftAdj - discAdj;
    totalInstallment += installment;
    totalFTAdj += ftAdj;
    totalDiscAdj += discAdj;
    totalNetPayable += netPayable;
    rows.push({
      label: split.label,
      percent: split.percent,
      installment,
      ftAdj,
      discAdj,
      netPayable,
    });
  });

  return (
    <div className="border border-blue-200 rounded-xl overflow-hidden shadow bg-white mb-8">
      <div className="bg-blue-50 p-2 text-blue-900 text-base font-bold tracking-wide border-b border-blue-200 text-left">
        Cost Sheet for {newProperty.unitNo}
      </div>
      <div className="bg-blue-700 p-2 text-white text-center text-lg font-bold tracking-wide shadow-sm">
        COST SHEET
      </div>
      <div>
        <div className="bg-blue-100 p-2 text-center text-base font-semibold tracking-wide text-blue-900 border-b border-blue-200">
          Payment Plan
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-1 border text-left font-semibold">Particulars</th>
                <th className="p-1 border text-left font-semibold">Payment %</th>
                <th className="p-1 border text-left font-semibold">Total Payment (With Tax)</th>
                {oldProperties.length > 0 && <th className="p-1 border text-left font-semibold">FT Adjustment</th>}
                {oldProperties.length > 0 && <th className="p-1 border text-left font-semibold">Disc. Adjustment</th>}
                <th className="p-1 border text-left font-semibold">Net Payable by Customer</th>
                <th className="p-1 border text-left font-semibold">Tax payable @5%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              <tr className="hover:bg-blue-50">
                <td className="p-1 border font-semibold text-blue-800 bg-blue-50">Booking Amount</td>
                <td className="p-1 border">-</td>
                <td className="p-1 border">{bookingAmount.toLocaleString()}</td>
                {oldProperties.length > 0 && <td className="p-1 border">-</td>}
                {oldProperties.length > 0 && <td className="p-1 border">-</td>}
                <td className="p-1 border font-semibold text-blue-800">{bookingAmount.toLocaleString()}</td>
                <td className="p-1 border">{(bookingAmount * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-50'}>
                  <td className="p-1 border font-medium text-blue-900">{row.label}</td>
                  <td className="p-1 border">{row.percent}%</td>
                  <td className="p-1 border">{Math.round(row.installment).toLocaleString()}</td>
                  {oldProperties.length > 0 && <td className="p-1 border text-green-700">{Math.round(row.ftAdj).toLocaleString()}</td>}
                  {oldProperties.length > 0 && <td className="p-1 border text-yellow-700">{Math.round(row.discAdj).toLocaleString()}</td>}
                  <td className="p-1 border font-semibold text-blue-900">{Math.round(row.netPayable).toLocaleString()}</td>
                  <td className="p-1 border">{(Math.round(row.installment) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-100 border-t border-blue-300">
                <td className="p-1 border">Total</td>
                <td className="p-1 border">100%</td>
                <td className="p-1 border">{Math.round(newUnitTCVActual).toLocaleString()}</td>
                {oldProperties.length > 0 && <td className="p-1 border">{Math.round(perPropertyPaidAmount).toLocaleString()}</td>}
                {oldProperties.length > 0 && <td className="p-1 border">{Math.round(perPropertyPremium).toLocaleString()}</td>}
                <td className="p-1 border text-blue-900">{Math.round(bookingAmount + totalNetPayable).toLocaleString()}</td>
                <td className="p-1 border">{(Math.round(newUnitTCVActual) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostSheet;