import { toggleTheme, initTilt } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => toggleTheme(themeToggle));
  }

  // Export resume as PDF
  const exportBtn = document.getElementById('exportPdf');
  if (exportBtn && window.jspdf) {
    exportBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Akash — Résumé', 40, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('Full‑stack developer | Automation | Interactive Dashboards', 40, 84);
      doc.text('Projects:', 40, 120);
      doc.text('- Crypto Prediction Dashboard (Flask + Charts + Automation)', 60, 138);
      doc.text('- Workflow Engine (Front/Back integration, retries, logging)', 60, 156);
      doc.text('- IoT Dashboard (Sensors, anomaly detection, UI)', 60, 174);
      doc.save('Akash_Resume.pdf');
    });
  }

  initTilt();
});
