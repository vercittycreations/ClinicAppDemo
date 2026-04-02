import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SlipPreview = ({ settings }) => (
  <div className="pdf-slip-preview">
    <div className="slip-header-preview">
      <div className="slip-clinic-name">{settings.clinicName || 'Clinic Name'}</div>
      {settings.specialty && <div className="slip-spec">{settings.specialty}</div>}
      {settings.address   && <div className="slip-addr">{settings.address}</div>}
      {settings.phone     && <div className="slip-addr">Tel: {settings.phone}</div>}
    </div>
    <div className="slip-token-badge-row">
      <div className="slip-patient-info">
        <div className="slip-patient-name-prev">Sample Patient</div>
        <div className="slip-patient-sub-prev">Age: 35 yrs</div>
      </div>
      <div className="slip-token-corner">007</div>
    </div>
    <div className="slip-details-preview">
      {[['Phone','98765 00000'],['Date','2026-04-02 · 10:30 am'],['Slot','10:30 AM'],['Problem','Ear pain']].map(([l,v]) => (
        <div className="slip-row" key={l}><span className="sl">{l}:</span><span className="sv">{v}</span></div>
      ))}
    </div>
    <div className="slip-notes-preview">
      <div className="slip-notes-lbl">Doctor's Notes / Prescription</div>
      {[...Array(4)].map((_,i) => <hr key={i} className="slip-rule" />)}
    </div>
    <div className="slip-footer-preview">{settings.footerMessage || 'Please wait for your turn.'}</div>
  </div>
);

const PDFSettings = ({ settings, onSave, onClose }) => {
  const [local, setLocal] = useState({ ...settings });
  useEffect(() => { setLocal({ ...settings }); }, [settings]);

  const handleChange = (field) => (e) => setLocal(prev => ({ ...prev, [field]: e.target.value }));
  const handleSave   = () => { onSave({ ...local }); onClose(); };

  const fields = [
    { key:'clinicName',    label:'Clinic Name',    type:'text',     placeholder:"Dr. Bhukar's Clinic" },
    { key:'specialty',     label:'Specialty',      type:'text',     placeholder:'ENT, Cancer & Cochlear Implant' },
    { key:'address',       label:'Address',        type:'text',     placeholder:'123 Medical Lane, City' },
    { key:'phone',         label:'Phone Number',   type:'tel',      placeholder:'+91 XXXXX XXXXX' },
    { key:'footerMessage', label:'Footer Message', type:'textarea', placeholder:'Please wait for your turn.' },
  ];

  return (
    <motion.div className="settings-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="settings-panel"
        initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }}
        exit={{ y:60, opacity:0 }}
        transition={{ type:'spring', stiffness:280, damping:28 }}>
        <div className="settings-panel-header">
          <div className="settings-panel-title">⚙️ PDF Slip Customisation</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="settings-panel-body">
          <div className="settings-form-col">
            {fields.map(({ key, label, type, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                {type === 'textarea'
                  ? <textarea className="form-input" value={local[key]||''} onChange={handleChange(key)} placeholder={placeholder} rows={3} />
                  : <input className="form-input" type={type} value={local[key]||''} onChange={handleChange(key)} placeholder={placeholder} />
                }
              </div>
            ))}
          </div>
          <div className="settings-preview-col">
            <div className="preview-label">Live Preview</div>
            <SlipPreview settings={local} />
            <p style={{ fontSize:'0.73rem', color:'var(--text-muted)', textAlign:'center', marginTop:12, lineHeight:1.5 }}>
              Token appears in top-right corner.<br />Notes space included for prescriptions.
            </p>
          </div>
        </div>
        <div className="settings-panel-footer">
          <button className="btn btn-ghost btn-sm" onClick={() => setLocal({ ...settings })}>↺ Reset</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>💾 Save Settings</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PDFSettings;
