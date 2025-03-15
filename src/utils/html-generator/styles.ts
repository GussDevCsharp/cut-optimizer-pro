
export const getStylesHtml = (): string => {
  return `
    <style>
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
        margin-bottom: 20px; 
        position: relative; 
        page-break-after: always; 
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        width: 100%;
        height: auto;
        max-width: 100%;
      }
      .sheet-page {
        page-break-after: always;
        padding-bottom: 20px;
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
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
        position: absolute; 
        border: 1px solid rgba(0,0,0,0.1); 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        font-size: 12px; 
        box-sizing: border-box; 
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border-radius: 2px;
      }
      .dimension-width { 
        position: absolute; 
        bottom: 2px; 
        width: 100%; 
        text-align: center; 
        font-size: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.75);
      }
      .dimension-height { 
        position: absolute; 
        left: 2px; 
        height: 100%; 
        writing-mode: vertical-lr; 
        transform: rotate(180deg); 
        display: flex; 
        align-items: center; 
        font-size: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.75);
      }
      .project-info {
        margin-bottom: 10px;
        font-size: 14px;
        color: #8e9196;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #8e9196;
        padding-top: 15px;
        border-top: 1px solid #E2E2E2;
      }
      @media print {
        @page { margin: 0.5cm; }
        body { margin: 1cm; }
        .sheet-page { page-break-after: always; width: 100%; }
        .sheet-page:last-child { page-break-after: avoid; }
        .sheet-container { max-width: 100%; width: 100%; }
        .print-info {
          background-color: #F9F9F9;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .piece {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `;
};
