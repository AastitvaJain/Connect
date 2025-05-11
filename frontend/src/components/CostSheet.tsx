import React from 'react';
import { Property, PaymentPlan } from '../types';

interface CostSheetProps {
  oldProperties: Property[];
  newProperty: Property;
  paymentPlan: PaymentPlan;
  totalPaidAmount: number;
  totalPremium: number;
  numNewProperties: number;
  discAdjPercents?: number[];
}

const CostSheet: React.FC<CostSheetProps> = ({ oldProperties, newProperty, paymentPlan, totalPaidAmount, totalPremium, numNewProperties, discAdjPercents }) => {
  // Payment plan calculations
  const bookingAmount = newProperty.bookingAmount;
  // Use the full proportional values passed from parent
  const perPropertyPaidAmount = totalPaidAmount;
  const perPropertyPremium = totalPremium;
  const newUnitTCVActual = newProperty.superBuiltUpArea * newProperty.rate;
  const remainingAmount = newUnitTCVActual - bookingAmount;

  // Payment plan splits
  let planSplits: { label: string; percent: number; }[] = [];
  if (Array.isArray(paymentPlan)) {
    planSplits = paymentPlan;
  } else if (paymentPlan === 'res1') {
    planSplits = [
      { label: 'Milestone 1', percent: 30 },
      { label: 'Milestone 2', percent: 30 },
      { label: 'Milestone 3', percent: 30 },
      { label: 'Milestone 4', percent: 10 },
    ];
  } else if (paymentPlan === 'res2') {
    planSplits = [
      { label: 'Milestone 1', percent: 10 },
      { label: 'Milestone 2', percent: 90 },
    ];
  } else if (paymentPlan === 'comm') {
    planSplits = [
      { label: 'Milestone 1', percent: 45 },
      { label: 'Milestone 2', percent: 55 },
    ];
  }

  // Debug logs for calculation
  console.log('perPropertyPaidAmount:', perPropertyPaidAmount);
  console.log('perPropertyPremium:', perPropertyPremium);
  console.log('newUnitTCVActual:', newUnitTCVActual);
  console.log('remainingAmount:', remainingAmount);
  console.log('planSplits:', planSplits);

  // FT adjustment: only in first milestone
  const ftAdjs = planSplits.map((_, idx) => idx === 0 ? perPropertyPaidAmount : 0);
  // Profit adjustment: distributed as before, or by custom discAdjPercents
  const discAdjs = planSplits.map((split, idx) =>
    discAdjPercents && discAdjPercents.length === planSplits.length
      ? perPropertyPremium * (discAdjPercents[idx] / 100)
      : perPropertyPremium * (split.percent / 100)
  );
  // Installments: distribute full TCV, deduct bookingAmount only from first milestone
  const installmentsRaw = planSplits.map((split) => newUnitTCVActual * (split.percent / 100));
  const installments = installmentsRaw.map((amt, idx) => idx === 0 ? amt - bookingAmount : amt);

  console.log('ftAdjs:', ftAdjs);
  console.log('discAdjs:', discAdjs);
  console.log('installments:', installments);

  // Initial net payables
  let netPayables = installments.map((installment, idx) => installment - ftAdjs[idx] - discAdjs[idx]);
  console.log('netPayables before carry logic:', [...netPayables]);

  // Custom carry logic: move all negatives to the last milestone, then backward if needed
  let carry = 0;
  netPayables = netPayables.map((val, idx) => {
    if (val < 0) {
      carry += val; // val is negative
      return 0;
    }
    return val;
  });
  // Add carry to the last milestone
  netPayables[netPayables.length - 1] += carry;
  // If last milestone is negative, carry backward
  let i = netPayables.length - 1;
  while (i >= 0 && netPayables[i] < 0) {
    if (i === 0) {
      netPayables[i] = 0;
      break;
    }
    carry = netPayables[i];
    netPayables[i] = 0;
    netPayables[i - 1] += carry;
    i--;
  }

  console.log('netPayables after carry logic:', [...netPayables]);

  // Calculate installment, FT adjustment, disc adjustment, net payable for each split
  let rows: { label: string; percent: number; installment: number; ftAdj: number; discAdj: number; netPayable: number }[] = [];
  let totalInstallment = 0;
  let totalFTAdj = 0;
  let totalDiscAdj = 0;
  let totalNetPayable = 0;

  planSplits.forEach((split, idx) => {
    const installment = installments[idx];
    const ftAdj = ftAdjs[idx];
    const discAdj = discAdjs[idx];
    const netPayable = netPayables[idx];
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

  console.log('rows (final milestone breakdown):', rows);

  // Determine if property is a plot (case-insensitive)
  const isPlot = newProperty.projectType?.toLowerCase().includes('plot');

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
                <th className="p-1 border text-left font-semibold">Total Payment (Without Tax)</th>
                {oldProperties.length > 0 && <th className="p-1 border text-left font-semibold">FT Adjustment</th>}
                {oldProperties.length > 0 && <th className="p-1 border text-left font-semibold">Disc. Adjustment</th>}
                <th className="p-1 border text-left font-semibold">Net Payable by Customer</th>
                <th className="p-1 border text-left font-semibold">Tax payable @5%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              <tr className="hover:bg-blue-50">
                <td className="p-1 border text-blue-800 bg-blue-50">Booking Amount</td>
                <td className="p-1 border">-</td>
                <td className="p-1 border">{bookingAmount.toLocaleString('en-IN')}</td>
                {oldProperties.length > 0 && <td className="p-1 border">-</td>}
                {oldProperties.length > 0 && <td className="p-1 border">-</td>}
                <td className="p-1 border font-semibold text-blue-800">{bookingAmount.toLocaleString('en-IN')}</td>
                <td className="p-1 border">-</td>
              </tr>
              {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-50'}>
                  <td className="p-1 border font-medium text-blue-900">{row.label}</td>
                  <td className="p-1 border">{row.percent}%</td>
                  <td className="p-1 border">{Math.round(row.installment).toLocaleString('en-IN')}</td>
                  {oldProperties.length > 0 && <td className="p-1 border text-green-700">{Math.round(row.ftAdj).toLocaleString('en-IN')}</td>}
                  {oldProperties.length > 0 && <td className="p-1 border text-yellow-700">{Math.round(row.discAdj).toLocaleString('en-IN')}</td>}
                  <td className="p-1 border font-semibold text-blue-900">{Math.round(row.netPayable).toLocaleString('en-IN')}</td>
                  <td className="p-1 border">{isPlot ? 0 : Math.round(row.netPayable * 0.05).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-100 border-t border-blue-300">
                <td className="p-1 border">Total</td>
                <td className="p-1 border">100%</td>
                <td className="p-1 border">{Math.round(newUnitTCVActual).toLocaleString('en-IN')}</td>
                {oldProperties.length > 0 && <td className="p-1 border">{Math.round(perPropertyPaidAmount).toLocaleString('en-IN')}</td>}
                {oldProperties.length > 0 && <td className="p-1 border">{Math.round(perPropertyPremium).toLocaleString('en-IN')}</td>}
                <td className="p-1 border text-blue-900">{Math.round(bookingAmount + totalNetPayable).toLocaleString('en-IN')}</td>
                <td className="p-1 border">{isPlot ? 0 : Math.round((bookingAmount + totalNetPayable) * 0.05).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostSheet;