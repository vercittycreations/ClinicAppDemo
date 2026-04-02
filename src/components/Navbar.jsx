import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onSettingsClick }) => {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo-wrap">🏥</div>
          <div>
            <div className="navbar-title">Dr. Bhukar's Clinic</div>
            <div className="navbar-sub">ENT · Cancer · Cochlear Implant</div>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-date">{dateStr}</div>
          <button className="btn btn-outline btn-sm" onClick={onSettingsClick}>
            ⚙️ PDF Settings
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
