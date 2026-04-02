import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar      from './components/Navbar.jsx';
import PatientForm from './components/PatientForm.jsx';
import Queue       from './components/Queue.jsx';
import Analytics   from './components/Analytics.jsx';
import PatientList from './components/PatientList.jsx';
import PDFSettings from './components/PDFSettings.jsx';

import {
  getPatients, savePatients,
  getNextToken, getServingToken, setServingToken,
  getPDFSettings, savePDFSettings,
} from './utils/storage.js';

import { downloadPDF, printPDF, shareWhatsApp } from './utils/pdf.js';

function App() {
  const [patients,     setPatients]     = useState([]);
  const [servingToken, setServing]      = useState(null);
  const [pdfSettings,  setPdfSettings]  = useState({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setPatients(getPatients());
    setServing(getServingToken());
    setPdfSettings(getPDFSettings());
  }, []);

  const today         = new Date().toISOString().split('T')[0];
  const todayPatients = patients.filter(p => p.date === today);

  const handleAddPatient = useCallback((formData, isReturning) => {
    const token = getNextToken();
    const now   = new Date();
    const newP  = {
      id:          `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      name:        formData.name.trim(),
      phone:       formData.phone.trim(),
      age:         formData.age.trim(),
      problem:     formData.problem.trim(),
      prescription:formData.prescription.trim(),
      slot:        formData.slot,
      token,
      date:        today,
      time:        now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      timestamp:   now.getTime(),
      isReturning: !!isReturning,
    };
    const updated = [newP, ...patients];
    setPatients(updated);
    savePatients(updated);
    if (!servingToken || !todayPatients.some(p => p.token === servingToken)) {
      setServing(token);
      setServingToken(token);
    }
    return newP;
  }, [patients, servingToken, today, todayPatients]);

  const handleNextPatient = useCallback(() => {
    const sorted = [...todayPatients].sort((a,b) => parseInt(a.token,10) - parseInt(b.token,10));
    if (!sorted.length) return;
    const idx = sorted.findIndex(p => p.token === servingToken);
    const nextToken = idx === -1 ? sorted[0].token : (idx < sorted.length-1 ? sorted[idx+1].token : null);
    if (!nextToken) return;
    setServing(nextToken);
    setServingToken(nextToken);
  }, [todayPatients, servingToken]);

  const handleDownload  = useCallback(p => downloadPDF(p, pdfSettings),  [pdfSettings]);
  const handlePrint     = useCallback(p => printPDF(p, pdfSettings),     [pdfSettings]);
  const handleWhatsApp  = useCallback(p => shareWhatsApp(p, pdfSettings),[pdfSettings]);

  const handleSaveSettings = useCallback(s => {
    setPdfSettings(s);
    savePDFSettings(s);
  }, []);

  return (
    <div className="app">
      <Navbar onSettingsClick={() => setShowSettings(v => !v)} />

      <main className="main-content">
        <div className="top-row">
          <PatientForm
            patients={patients}
            onAddPatient={handleAddPatient}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onWhatsApp={handleWhatsApp}
          />
          <div className="right-col">
            <Queue todayPatients={todayPatients} servingToken={servingToken} onNext={handleNextPatient} />
            <Analytics todayPatients={todayPatients} allPatients={patients} />
          </div>
        </div>

        <PatientList patients={patients} onDownload={handleDownload} onPrint={handlePrint} onWhatsApp={handleWhatsApp} />
      </main>

      <AnimatePresence>
        {showSettings && (
          <PDFSettings settings={pdfSettings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
