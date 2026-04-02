import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Queue = ({ todayPatients, servingToken, onNext }) => {
  // Sort by token number (ascending = registration order)
  const sorted = [...todayPatients].sort(
    (a, b) => parseInt(a.token, 10) - parseInt(b.token, 10)
  );

  const servingIdx     = sorted.findIndex((p) => p.token === servingToken);
  const servingPatient = servingIdx >= 0 ? sorted[servingIdx] : sorted[0] || null;
  const nextPatients   = servingIdx >= 0
    ? sorted.slice(servingIdx + 1, servingIdx + 4)
    : sorted.slice(1, 4);

  const canAdvance =
    sorted.length > 0 && servingIdx < sorted.length - 1;

  const totalWaiting = servingIdx >= 0
    ? sorted.length - servingIdx - 1
    : Math.max(0, sorted.length - 1);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
    >
      <div className="card-title">
        <div className="card-icon" style={{ background: '#E0F7F4' }}>🔢</div>
        Live Queue
        {totalWaiting > 0 && (
          <span className="badge badge-teal" style={{ marginLeft: 'auto' }}>
            {totalWaiting} waiting
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="queue-empty-state">
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏥</div>
          <p>No patients today yet.</p>
        </div>
      ) : (
        <>
          {/* ── Now Serving ── */}
          <div className="queue-serving-wrap">
            <div className="serving-label">Now Serving</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={servingPatient?.token || 'none'}
                className="serving-token-num"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{ scale: 1.1,   opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {servingPatient ? servingPatient.token : '—'}
              </motion.div>
            </AnimatePresence>
            <div className="serving-patient-name">
              {servingPatient ? servingPatient.name : 'No patient'}
            </div>
          </div>

          {/* ── Next tokens ── */}
          {nextPatients.length > 0 && (
            <>
              <hr className="queue-divider" />
              <div className="next-label">Up Next</div>
              <div className="next-tokens-row">
                <AnimatePresence>
                  {nextPatients.map((p, i) => (
                    <motion.div
                      key={p.token}
                      className="next-token-chip"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0   }}
                      exit={{ opacity: 0,   x: 12   }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="chip-num">{p.token}</div>
                      <div className="chip-name">{p.name.split(' ')[0]}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* ── Next Patient Button ── */}
          <button
            className="btn btn-accent btn-full"
            onClick={onNext}
            disabled={!canAdvance}
            style={{ marginTop: 4 }}
          >
            ▶ Next Patient
          </button>
        </>
      )}
    </motion.div>
  );
};

export default Queue;
