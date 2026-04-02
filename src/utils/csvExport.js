// ============================================================
//  csvExport.js — export patient records as CSV
// ============================================================

export const exportToCSV = (patients) => {
  if (!patients || patients.length === 0) {
    alert('No patient data to export.');
    return;
  }

  const headers = ['Token', 'Name', 'Phone', 'Age', 'Problem', 'Date', 'Time'];

  const escape = (val) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = patients.map((p) => [
    escape(p.token),
    escape(p.name),
    escape(p.phone),
    escape(p.age ?? ''),
    escape(p.problem ?? ''),
    escape(p.date),
    escape(p.time),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];

  a.href     = url;
  a.download = `clinic_patients_${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
