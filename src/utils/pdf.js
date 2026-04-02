// ============================================================
//  pdf.js — jsPDF token slip generator (redesigned)
// ============================================================
import jsPDF from 'jspdf';

const W = 90;
const H = 180;

const C = {
  blue:   [0,  86,  210],
  teal:   [0, 191,  166],
  white:  [255,255, 255],
  dark:   [26,  35,  50],
  gray:   [100,116, 139],
  faint:  [180,190, 205],
  light:  [240,244, 250],
  border: [220,228, 240],
  rule:   [210,218, 230],
};

const fill  = (doc, [r,g,b]) => doc.setFillColor(r,g,b);
const tc    = (doc, [r,g,b]) => doc.setTextColor(r,g,b);
const dc    = (doc, [r,g,b]) => doc.setDrawColor(r,g,b);

export const generateSlipPDF = (patient, settings) => {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  fill(doc, C.blue);
  doc.rect(0, 0, W, 26, 'F');

  tc(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text(settings.clinicName || "Dr. Bhukar's Clinic", W / 2, 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  if (settings.specialty) doc.text(settings.specialty, W / 2, 14.5, { align: 'center' });
  doc.setFontSize(6.2);
  const contactLine = [settings.address, settings.phone ? 'Tel: ' + settings.phone : ''].filter(Boolean).join('   •   ');
  if (contactLine) doc.text(contactLine, W / 2, 19.5, { align: 'center' });

  // Token badge — top right corner
  const badgeX = W - 20;
  const badgeY = 28;
  const badgeR = 11;
  fill(doc, C.teal);
  doc.circle(badgeX, badgeY + badgeR, badgeR, 'F');
  tc(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(String(patient.token), badgeX, badgeY + badgeR + 4, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  tc(doc, C.teal);
  doc.text('TOKEN', badgeX, badgeY + badgeR * 2 + 5.5, { align: 'center' });

  // Patient name — left side
  tc(doc, C.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const nameLines = doc.splitTextToSize(patient.name || '', badgeX - 11);
  doc.text(nameLines, 6, 35);
  const nameLinesH = nameLines.length * 6;
  let detailY = 35 + nameLinesH;
  if (patient.age) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    tc(doc, C.gray);
    doc.text('Age: ' + patient.age + ' yrs', 6, detailY + 1);
    detailY += 5.5;
  }

  // Divider
  const divY = Math.max(badgeY + badgeR * 2 + 10, detailY + 5);
  dc(doc, C.border);
  doc.line(5, divY, W - 5, divY);

  let y = divY + 6;

  const row = (label, value, bold) => {
    if (!value || !String(value).trim()) return;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    tc(doc, C.gray);
    doc.text(label, 6, y);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    tc(doc, C.dark);
    const vLines = doc.splitTextToSize(String(value), W - 36);
    doc.text(vLines, 30, y);
    y += Math.max(5.5, vLines.length * 4.5);
  };

  row('Phone',   patient.phone);
  row('Date',    patient.date + '  ·  ' + patient.time);
  if (patient.slot)    row('Slot',    patient.slot, true);
  if (patient.problem) row('Problem', patient.problem);

  // Notes section
  y += 3;
  dc(doc, C.border);
  doc.line(5, y, W - 5, y);
  y += 5;
  tc(doc, C.gray);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text("Doctor's Notes / Prescription", 6, y);
  y += 5;
  dc(doc, C.rule);
  for (let i = 0; i < 7; i++) doc.line(6, y + i * 7.5, W - 6, y + i * 7.5);

  // Footer
  const footerY = H - 14;
  fill(doc, C.light);
  doc.rect(0, footerY, W, 14, 'F');
  dc(doc, C.border);
  doc.line(0, footerY, W, footerY);
  tc(doc, C.gray);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  const fLines = doc.splitTextToSize(settings.footerMessage || 'Please wait for your turn. Thank you.', W - 14);
  doc.text(fLines, W / 2, footerY + 6, { align: 'center' });

  return doc;
};

export const downloadPDF = (patient, settings) => {
  const doc  = generateSlipPDF(patient, settings);
  const name = (patient.name || 'Patient').replace(/\s+/g, '_');
  doc.save('Token_' + patient.token + '_' + name + '.pdf');
};

export const printPDF = (patient, settings) => {
  const doc  = generateSlipPDF(patient, settings);
  const blob = doc.output('blob');
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 600);
    });
  }
};

export const shareWhatsApp = (patient, settings) => {
  const clinic = settings.clinicName || "Dr. Bhukar's Clinic";
  const lines = [
    '*' + clinic + '*',
    settings.specialty ? '_' + settings.specialty + '_' : '',
    '',
    'Your Token Number: *' + patient.token + '*',
    '',
    'Patient: ' + patient.name,
    patient.age     ? 'Age: ' + patient.age + ' yrs'                : '',
    patient.slot    ? 'Appointment Slot: ' + patient.slot           : '',
    'Date: ' + patient.date + '   Time: ' + patient.time,
    patient.problem ? 'Complaint: ' + patient.problem               : '',
    '',
    settings.footerMessage || 'Please wait for your turn. Thank you.',
  ].filter(l => l !== undefined).join('\n');

  window.open('https://wa.me/?text=' + encodeURIComponent(lines), '_blank');
};
