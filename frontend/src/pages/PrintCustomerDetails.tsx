import React from "react";
import type { Property } from "../types";

interface PrintCustomerDetailsProps {
  customerNames: string[];
  token: string;
  properties: Property[];
}

const PrintCustomerDetails = React.forwardRef<HTMLDivElement, PrintCustomerDetailsProps>(
  ({ customerNames, token, properties }, ref) => {
    const propertyFields = [
      { label: 'Project Name', get: (p: Property) => p.projectName },
      { label: 'Unit No.', get: (p: Property) => p.unitNo },
      { label: 'Customer Name', get: (p: Property) => p.customerName },
      { label: 'Area*', get: (p: Property) => p.superBuiltUpArea },
      { label: 'Rate* [all inc]', get: (p: Property) => p.rate?.toLocaleString() },
      { label: 'Total Consideration (With Tax) in Cr.', get: (p: Property) => p.totalConsiderationInCr?.toFixed(2) ?? '-' },
      { label: 'Sell @ premium price*', get: (p: Property) => p.sellAtPremiumPrice?.toLocaleString() ?? '-' },
      { label: 'Net Profit (Cr.)', get: (p: Property) => (p.netProfitInCr !== undefined && p.netProfitInCr !== null ? p.netProfitInCr.toFixed(2) : '-') },
      { label: 'Net Received (With Tax) in Cr.', get: (p: Property) => p.netReceivedInCr?.toFixed(2) ?? '-' },
    ];

    return (
      <div
        ref={ref}
        style={{
          padding: '48px 0',
          maxWidth: 900,
          margin: '0 auto',
          background: '#f7fafd',
          borderRadius: 18,
          border: 'none',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <style>{`
          @media print {
            body {
              margin: 0 !important;
              background: #fff !important;
            }
            .accent-bar {
              width: 100%;
              height: 8px;
              background: linear-gradient(90deg, #FFD600 60%, #1976d2 100%);
              border-radius: 6px 6px 0 0;
              margin-bottom: 0px;
            }
            .print-title {
              font-size: 1.2rem !important;
              font-weight: 700 !important;
              color: #1a237e !important;
              margin-bottom: 0.5em !important;
              text-align: center;
              letter-spacing: 0.1px;
            }
            .print-details {
              font-size: 1.1rem !important;
              color: #222;
              margin-bottom: 0.3em;
              font-weight: 500;
              text-align: center;
            }
            .divider {
              width: 80px;
              height: 5px;
              background: #FFD600;
              border-radius: 3px;
              margin: 32px auto 36px auto;
            }
            .card-table-section {
              background: #fff;
              border-radius: 18px;
              box-shadow: 0 4px 24px rgba(25, 118, 210, 0.08);
              padding: 0 0 24px 0;
              margin: 0 auto 0 auto;
              max-width: 860px;
              border: 1.5px solid #e0e0e0;
            }
            .section-header {
              font-size: 1rem;
              font-weight: 700;
              color: #1976d2;
              margin: 18px 0 12px 0;
              letter-spacing: 0.1px;
              text-align: left;
              padding-left: 24px;
            }
           table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5px;
  table-layout: fixed;
}

th, td {
  padding: 4px 6px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #ccc;
  word-wrap: break-word;
}

th {
  background-color: #e6f0fa;
  font-weight: bold;
}

/* Prevent word breaks on specific columns */
.nobr {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
            .terms-bottom-right {
              position: fixed;
              right: 24px;
              bottom: 16px;
              font-size: 11px;
              color: #888;
              font-style: italic;
              text-align: right;
              z-index: 9999;
            }
          }
        `}</style>
        <div className="print-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Customer Existing Property Details</div>
        <div className="print-details" style={{ fontSize: '1.2rem', textAlign: 'left' }}><strong>Token number:</strong> {token || "-"}</div>
        <div className="print-details" style={{ textAlign: 'left' }}><strong>Customer name:</strong> {customerNames.join(", ") || "-"}</div>
        <div className="divider"></div>
        <div className="card-table-section">
          <div className="accent-bar"></div>
          <div className="section-header">Selected Properties</div>
          <div style={{ marginBottom: 8, fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            * Area and rates: sq. yards for plots, sq. ft. for others
          </div>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                {properties.map((p, idx) => (
                  <th key={p.id}>Prop {idx + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propertyFields.map(field => (
                <tr key={field.label}>
                  <td className="nobr" style={{ fontWeight: 600 }}>{field.label}</td>
                  {properties.map(p => (
                    <td key={p.id}>{field.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="terms-bottom-right">Terms and Conditions Apply</div>
      </div>
    );
  }
);

export default PrintCustomerDetails; 