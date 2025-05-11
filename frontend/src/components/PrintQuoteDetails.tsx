import React from "react";
import CostSheet from "./CostSheet";
import type { Property, PaymentPlan } from "../types";

interface CostSheetData {
  oldProperties: Property[];
  newProperty: Property;
  paymentPlan: PaymentPlan;
  totalPaidAmount: number;
  totalPremium: number;
  numNewProperties: number;
}

interface PrintQuoteDetailsProps {
  customerNames: string[];
  token: string;
  costSheetData: CostSheetData[];
  oldProperties: Property[];
  newProperties: Property[];
}

const oldFields = [
  { label: 'Project Name', get: (p: Property) => p.projectName },
  { label: 'Unit No.', get: (p: Property) => p.unitNo },
  { label: 'Area*', get: (p: Property) => p.superBuiltUpArea?.toLocaleString('en-IN') },
  { label: 'Rate', get: (p: Property) => Math.round(p.rate).toLocaleString('en-IN') },
  { label: 'Total Consideration(With Tax)', get: (p: Property) => Math.round(p.superBuiltUpArea * p.rate).toLocaleString('en-IN') },
  { label: 'Sell @ premium price', get: (p: Property) => p.assuredValue?.toLocaleString('en-IN') },
  { label: 'Net Received(With Tax)', get: (p: Property) => Math.round(p.netReceived).toLocaleString('en-IN') },
  { label: 'Net Profit', get: (p: Property) => Math.round(((p.assuredValue - p.rate) * p.superBuiltUpArea)).toLocaleString('en-IN') },
  { label: 'Buyback Value', get: (p: Property) => Math.round(p.assuredValue * p.superBuiltUpArea).toLocaleString('en-IN') },
];

const newFields = [
  { label: 'Project Name', get: (p: Property) => p.projectName },
  { label: 'Unit No.', get: (p: Property) => p.unitNo },
  { label: 'Area*', get: (p: Property) => p.superBuiltUpArea?.toLocaleString('en-IN') },
  { label: 'Rate', get: (p: Property) => p.rate?.toLocaleString('en-IN') },
  { label: 'Total Consideration(Without Tax)', get: (p: Property) => Math.round(p.superBuiltUpArea * p.rate).toLocaleString('en-IN') },
];

const PrintQuoteDetails = React.forwardRef<HTMLDivElement, PrintQuoteDetailsProps>(
  ({ customerNames, token, costSheetData, oldProperties, newProperties }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "48px 0",
          maxWidth: 900,
          margin: "0 auto",
          background: "#f7fafd",
          borderRadius: 18,
          border: "none",
          fontFamily: "Inter, Arial, sans-serif",
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
              margin-bottom: 80px !important;
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
        <div className="print-title" style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
          Sales Print out format (Quote Only) - Draft
        </div>
        <div className="print-details" style={{ fontSize: "1.2rem", textAlign: "left" }}><strong>Token number:</strong> {token || "-"}</div>
        <div className="print-details" style={{ textAlign: "left" }}><strong>Customer name:</strong> {customerNames.join(", ") || "-"}</div>
        <div className="divider"></div>
        {/* Old Unit Details */}
        {oldProperties.length > 0 && (
          <div className="card-table-section" style={{ marginBottom: 24 }}>
            <div className="accent-bar"></div>
            <div className="section-header">Old Unit Details</div>
            <div style={{ marginBottom: 8, fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
              * Area and rates: sq. yards for plots, sq. ft. for others
            </div>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  {oldProperties.map((p, idx) => (
                    <th key={p.id}>Prop {idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {oldFields.map(field => (
                  <tr key={field.label}>
                    <td className="nobr" style={{ fontWeight: 600 }}>{field.label}</td>
                    {oldProperties.map(p => (
                      <td key={p.id}>{field.get(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* New Unit Details */}
        {newProperties.length > 0 && (
          <div className="card-table-section" style={{ marginBottom: 24 }}>
            <div className="accent-bar"></div>
            <div className="section-header">New Unit Details</div>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  {newProperties.map((p, idx) => (
                    <th key={p.id}>Prop {idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {newFields.map(field => (
                  <tr key={field.label}>
                    <td className="nobr" style={{ fontWeight: 600 }}>{field.label}</td>
                    {newProperties.map(p => (
                      <td key={p.id}>{field.get(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Cost Sheet(s) */}
        <div className="card-table-section">
          <div className="accent-bar"></div>
          <div className="section-header">Cost Sheet</div>
          {costSheetData.map((data, idx) => (
            <CostSheet key={data.newProperty.id} {...data} />
          ))}
        </div>
        <div className="terms-bottom-right">Terms and Conditions Apply</div>
      </div>
    );
  }
);

export default PrintQuoteDetails; 