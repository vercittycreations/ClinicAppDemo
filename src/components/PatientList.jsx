import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const normalizePhone = (p) => String(p ?? '').replace(/\D/g, '');

const HistoryModal = ({ patient, allPatients, onClose, onDownload, onPrint, onWhatsApp }) => {
  const visits = allPatients
    .filter(p => normalizePhone(p.phone) === normalizePhone(patient.phone))
    .sort((a,b) => b.timestamp - a.timestamp);

  return (
    <motion.div className="modal-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="modal"
        initial={{ opacity:0, y:40, scale:0.95 }}
        animate={{ opacity:1, y:0,  scale:1    }}
        exit={{ opacity:0,   y:40,  scale:0.95 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}>
        <div className="modal-header">
          <div className="modal-patient-info">
            <div className="modal-title">{patient.name}</div>
            <div className="modal-sub">{patient.phone}{patient.age ? ` · ${patient.age} yrs` : ''}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <span className="badge badge-blue">{visits.length} visit{visits.length !== 1 ? 's' : ''}</span>
          {visits.length > 1 && <span className="badge badge-teal">Returning Patient</span>}
        </div>

        <div className="history-section-title">Visit History</div>
        {visits.map((v, i) => (
          <motion.div key={v.id} className="history-visit"
            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.05 }}>
            <div className="history-visit-top">
              <span className="tbl-token">{v.token}</span>
              <span className="badge badge-gray">{v.date}</span>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{v.time}</span>
              {v.slot && <span className="badge badge-orange">⏰ {v.slot}</span>}
              {i === 0 && <span className="badge badge-green">Latest</span>}
            </div>
            {v.problem && (
              <div className="history-problem"><strong>Complaint:</strong> {v.problem}</div>
            )}
            {v.prescription && (
              <div className="history-problem" style={{ marginTop:4 }}>
                <strong>💊 Notes:</strong> {v.prescription}
              </div>
            )}
            <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={() => onDownload(v)}>⬇ PDF</button>
              <button className="btn btn-outline btn-sm" onClick={() => onPrint(v)}>🖨 Print</button>
              <button className="btn btn-wa btn-sm" onClick={() => onWhatsApp(v)}>💬 WA</button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const PatientList = ({ patients, onDownload, onPrint, onWhatsApp }) => {
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = search.trim()
    ? patients.filter(p =>
        normalizePhone(p.phone).includes(normalizePhone(search)) ||
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : patients;

  const sorted = [...filtered].sort((a,b) => b.timestamp - a.timestamp);

  return (
    <>
      <motion.div className="card"
        initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4, delay:0.15, ease:'easeOut' }}>
        <div className="list-header">
          <div className="card-title" style={{ marginBottom:0 }}>
            <div className="card-icon" style={{ background:'#F0FFF4' }}>👥</div>
            Patient Records
            <span className="badge badge-gray" style={{ marginLeft:6 }}>{patients.length}</span>
          </div>
          <div className="search-wrap">
            <span className="search-icon-left">🔍</span>
            <input className="search-input" placeholder="Search by name or phone…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">{search ? '🔍' : '📋'}</div>
            <p>{search ? `No patients found for "${search}"` : 'No patients registered yet.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Token</th><th>Name</th><th>Phone</th>
                  <th>Slot</th><th>Date</th><th>Time</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {sorted.map((p, i) => (
                    <motion.tr key={p.id}
                      initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      onClick={() => setSelected(p)}>
                      <td><span className="tbl-token">{p.token}</span></td>
                      <td>
                        <span className="tbl-name">{p.name}</span>
                        {p.isReturning && <span className="badge badge-teal" style={{ marginLeft:6 }}>🔁</span>}
                      </td>
                      <td className="tbl-phone">{p.phone}</td>
                      <td>
                        {p.slot
                          ? <span className="badge badge-orange">{p.slot}</span>
                          : <span style={{ color:'var(--text-faint)' }}>—</span>}
                      </td>
                      <td className="tbl-date">{p.date}</td>
                      <td className="tbl-date">{p.time}</td>
                      <td>
                        <div className="tbl-actions" onClick={e => e.stopPropagation()}>
                          <button className="btn btn-primary btn-sm" onClick={() => onDownload(p)}>⬇</button>
                          <button className="btn btn-outline btn-sm" onClick={() => onPrint(p)}>🖨</button>
                          <button className="btn btn-wa btn-sm" onClick={() => onWhatsApp(p)}>💬</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <HistoryModal patient={selected} allPatients={patients}
            onClose={() => setSelected(null)}
            onDownload={onDownload} onPrint={onPrint} onWhatsApp={onWhatsApp} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PatientList;
