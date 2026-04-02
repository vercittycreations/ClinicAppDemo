import React from 'react';
import { motion } from 'framer-motion';
import { exportToCSV } from '../utils/csvExport';

const Analytics = ({ todayPatients, allPatients }) => {
  const today = new Date().toISOString().split('T')[0];

  // Count returning patients today: any patient whose phone appears
  // in a previous day's records
  const todayPhones = new Set(todayPatients.map((p) => p.phone));
  const prevPatients = allPatients.filter((p) => p.date !== today);
  const prevPhones   = new Set(prevPatients.map((p) => p.phone));

  const returningToday = todayPatients.filter((p) =>
    prevPhones.has(p.phone)
  ).length;

  const newToday   = todayPatients.length - returningToday;
  const totalAll   = allPatients.length;

  const stats = [
    {
      num:   String(todayPatients.length).padStart(2, '0'),
      lbl:   'Today',
      color: 'blue',
    },
    {
      num:   String(newToday).padStart(2, '0'),
      lbl:   'New Today',
      color: 'green',
    },
    {
      num:   String(returningToday).padStart(2, '0'),
      lbl:   'Returning',
      color: 'teal',
    },
    {
      num:   String(totalAll),
      lbl:   'All Time',
      color: 'orange',
    },
  ];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
    >
      <div className="card-title">
        <div className="card-icon" style={{ background: '#FFFAF0' }}>📊</div>
        Analytics
      </div>

      <div className="analytics-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.lbl}
            className={`stat-tile ${s.color}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.25 + i * 0.06 }}
          >
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      <button
        className="btn btn-ghost btn-full btn-sm"
        onClick={() => exportToCSV(allPatients)}
        disabled={allPatients.length === 0}
      >
        ⬇ Export All as CSV
      </button>
    </motion.div>
  );
};

export default Analytics;
