import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_SLOTS } from '../utils/storage.js';

const normalizePhone = (p) => String(p ?? '').replace(/\D/g, '');

const PatientForm = ({ patients, onAddPatient, onDownload, onPrint, onWhatsApp }) => {
  const [form, setForm]           = useState({ name:'', phone:'', age:'', problem:'', prescription:'', slot:'' });
  const [errors, setErrors]       = useState({});
  const [returning, setReturning] = useState(null);
  const [tokenCard, setTokenCard] = useState(null);
  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    const norm = normalizePhone(form.phone);
    if (norm.length >= 7) {
      const found = patients.find(p => normalizePhone(p.phone) === norm);
      setReturning(found || null);
    } else {
      setReturning(null);
    }
  }, [form.phone, patients]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (normalizePhone(form.phone).length < 7) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectSlot = (s) => setForm(prev => ({ ...prev, slot: prev.slot === s ? '' : s }));

  const handleAutofill = () => {
    if (!returning) return;
    setForm(prev => ({ ...prev, name: returning.name, age: returning.age || prev.age }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const patient = onAddPatient({ ...form }, returning != null);
    setTokenCard(patient);
    setForm({ name:'', phone:'', age:'', problem:'', prescription:'', slot:'' });
    setErrors({});
    setReturning(null);
    setShowSlots(false);
  };

  const handleClear = () => {
    setForm({ name:'', phone:'', age:'', problem:'', prescription:'', slot:'' });
    setErrors({});
    setReturning(null);
    setTokenCard(null);
    setShowSlots(false);
  };

  return (
    <motion.div className="card"
      initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, ease:'easeOut' }}>

      <div className="card-title">
        <div className="card-icon" style={{ background:'#EFF6FF' }}>📋</div>
        Patient Registration
      </div>

      {/* Returning banner */}
      <AnimatePresence>
        {returning && (
          <motion.div className="returning-banner"
            initial={{ height:0, opacity:0, marginBottom:0 }}
            animate={{ height:'auto', opacity:1, marginBottom:14 }}
            exit={{ height:0, opacity:0, marginBottom:0 }}
            transition={{ duration:0.22 }} style={{ overflow:'hidden' }}>
            <div className="returning-label">🔁 Returning — <span className="badge badge-teal">{returning.name}</span></div>
            <button className="btn btn-accent btn-sm" onClick={handleAutofill}>Autofill</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className={`form-input ${errors.name ? 'error' : ''}`}
          name="name" value={form.name} onChange={handleChange}
          placeholder="Patient's full name" autoComplete="off" />
        {errors.name && <div className="form-error">⚠ {errors.name}</div>}
      </div>

      {/* Phone + Age */}
      <div className="form-row">
        <div className="form-group" style={{ flex:2 }}>
          <label className="form-label">Phone Number *</label>
          <input className={`form-input ${errors.phone ? 'error' : ''}`}
            name="phone" value={form.phone} onChange={handleChange}
            placeholder="+91 XXXXX XXXXX" type="tel" autoComplete="off" />
          {errors.phone && <div className="form-error">⚠ {errors.phone}</div>}
        </div>
        <div className="form-group" style={{ flex:1 }}>
          <label className="form-label">Age</label>
          <input className="form-input" name="age" value={form.age} onChange={handleChange}
            placeholder="yrs" type="number" min="0" max="150" />
        </div>
      </div>

      {/* Problem */}
      <div className="form-group">
        <label className="form-label">Problem / Symptoms</label>
        <textarea className="form-input" name="problem" value={form.problem}
          onChange={handleChange} placeholder="Describe main complaint..." rows={2} />
      </div>

      {/* Prescription notes */}
      <div className="form-group">
        <label className="form-label">💊 Prescription / Initial Notes</label>
        <textarea className="form-input" name="prescription" value={form.prescription}
          onChange={handleChange} placeholder="Medicine notes, dosage, instructions..." rows={2} />
      </div>

      {/* Appointment slot */}
      <div className="form-group">
        <label className="form-label" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span>⏰ Appointment Slot</span>
          {form.slot && <span className="badge badge-blue">{form.slot}</span>}
        </label>
        <button type="button" className="btn btn-ghost btn-sm btn-full"
          style={{ justifyContent:'space-between', marginBottom: showSlots ? 10 : 0 }}
          onClick={() => setShowSlots(v => !v)}>
          <span>{form.slot || 'Choose a time slot'}</span>
          <span>{showSlots ? '▲' : '▼'}</span>
        </button>
        <AnimatePresence>
          {showSlots && (
            <motion.div className="slot-grid"
              initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}
              style={{ overflow:'hidden' }}>
              {TIME_SLOTS.map(s => (
                <button key={s} type="button"
                  className={`slot-pill ${form.slot === s ? 'selected' : ''}`}
                  onClick={() => selectSlot(s)}>{s}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button className="btn btn-primary btn-lg" style={{ flex:1 }} onClick={handleSubmit}>
          🎫 Generate Token
        </button>
        <button className="btn btn-ghost" onClick={handleClear}>✕ Clear</button>
      </div>

      {/* Token result card */}
      <AnimatePresence>
        {tokenCard && (
          <motion.div className="token-result-card"
            initial={{ opacity:0, scale:0.88, y:10 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:10 }}
            transition={{ type:'spring', stiffness:320, damping:26 }}>
            <div className="token-result-header">
              <div className="token-big-num">{tokenCard.token}</div>
              <div style={{ flex:1 }}>
                <div className="token-result-name">{tokenCard.name}</div>
                <div className="token-result-meta">{tokenCard.date} · {tokenCard.time}</div>
                {tokenCard.slot && (
                  <div className="token-result-slot">⏰ {tokenCard.slot}</div>
                )}
                {tokenCard.isReturning && (
                  <span className="badge badge-teal" style={{ marginTop:2 }}>🔁 Returning</span>
                )}
              </div>
            </div>
            <div className="token-result-actions">
              <button className="btn btn-primary btn-sm" onClick={() => onDownload(tokenCard)}>⬇ PDF</button>
              <button className="btn btn-outline btn-sm" onClick={() => onPrint(tokenCard)}>🖨 Print</button>
              <button className="btn btn-wa btn-sm" onClick={() => onWhatsApp(tokenCard)}>💬 WhatsApp</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setTokenCard(null)}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientForm;
