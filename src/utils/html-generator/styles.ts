
export const getCuttingPlanStyles = (): string => {
  return `
    body { 
      font-family: 'Inter', sans-serif; 
      margin: 20px; 
      color: #222222;
      line-height: 1.5;
    }
    .print-header { 
      margin-bottom: 25px; 
      padding-bottom: 15px;
      border-bottom: 1px solid #E2E2E2;
    }
    .print-header h1 { 
      margin: 0 0 5px 0; 
      font-weight: 600;
      color: #1a1f2c;
    }
    .print-date {
      color: #8e9196;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .print-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 15px; 
      margin-bottom: 25px; 
      background-color: #F6F6F7;
      border-radius: 8px;
      padding: 15px;
    }
    .print-info-item { 
      display: flex; 
      justify-content: space-between;
      padding: 5px 0;
    }
    .print-info-label { 
      color: #8e9196; 
      font-weight: 500;
    }
    .print-info-value { 
      font-weight: 600;
      color: #1a1f2c;
    }
    .sheet-container { 
      border: 1px solid #E2E2E2; 
      margin-bottom: 40px; 
      position: relative; 
      page-break-after: always; 
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .sheet-page {
      page-break-after: always;
      padding-bottom: 30px;
      position: relative;
      margin-top: 20px;
    }
    .sheet-page:last-child {
      page-break-after: avoid;
    }
    .sheet-title { 
      font-weight: 600; 
      margin-bottom: 12px; 
      color: #1a1f2c;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .sheet-title:before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #9b87f5;
      margin-right: 8px;
    }
    .piece {
      /* Styles inline in the piece element for better PDF rendering */
    }
    .sheet-dimension-width {
      position: absolute;
      bottom: -20px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: #555;
    }
    .sheet-dimension-height {
      position: absolute;
      left: -20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      font-size: 12px;
      font-weight: 500;
      color: #555;
    }
    .project-info {
      margin-bottom: 10px;
      font-size: 14px;
      color: #8e9196;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #8e9196;
      padding-top: 15px;
      border-top: 1px solid #E2E2E2;
    }
    @media print {
      @page { margin: 0.5cm; }
      body { margin: 1cm; }
      .sheet-page { page-break-after: always; }
      .sheet-page:last-child { page-break-after: avoid; }
      .print-info {
        background-color: #F9F9F9;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .piece {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        border: 1px solid rgba(0,0,0,0.15) !important;
      }
    }
  `;
};
