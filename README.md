# Dr. Bhukar's Clinic — Token Management System

A production-ready, single-page clinic appointment & token management system built with React + Vite.

---

## 🚀 Setup

```bash
# 1. Navigate to the project folder
cd clinic-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## ✅ Features

- **Patient Registration** — Name, Phone, Age, Problem/Symptoms
- **Smart Token System** — Auto-increment `001`, `002`… with daily reset
- **PDF Slip Generation** — Downloadable & printable token slips (jsPDF)
- **PDF Customisation** — Edit clinic name, address, phone, footer with live preview
- **Returning Patient Detection** — Auto-detect by phone number + autofill
- **Live Queue** — Current serving token + next 3 patients
- **Patient History** — Click any patient to see all past visits
- **Real-time Search** — Filter by name or phone number
- **Analytics** — Today's total, new vs returning, all-time count
- **CSV Export** — Download all patient data as a CSV file
- **LocalStorage Persistence** — All data saved in browser storage
- **Fully Responsive** — Mobile-first, works on phone, tablet, desktop

---

## 📁 File Structure

```
clinic-app/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx
    │   ├── PatientForm.jsx
    │   ├── Queue.jsx
    │   ├── Analytics.jsx
    │   ├── PatientList.jsx
    │   └── PDFSettings.jsx
    └── utils/
        ├── storage.js
        ├── pdf.js
        └── csvExport.js
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion** — animations
- **jsPDF** — PDF generation
- **LocalStorage** — data persistence
- Custom CSS (no Tailwind required)
