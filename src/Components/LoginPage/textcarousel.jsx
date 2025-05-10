import './text.css'; 

const ModulesList = () => {
  // Data for the modules and their respective features.
  const modules = [
    // Module A - E-Invoicing
    {
      title: "E-Invoicing – Ready, Click Go!",
      features: [
        { name: "Instant E-Invoice Generation & IRN Integration" },
        { name: "Auto-Integration with Billing Software" },
        { name: "Real-Time Data Sync with GST Portal" },
        { name: "Email Invoices to Clients" },
        { name: "Bulk Upload & Smart Templates" },
        { name: "Customized E-Invoicing Designs" }
      ]
    },
    // Module B - E-Way Bill
    {
      title: "E-Way Bill Module – Let's clear the roadblocks!",
      features: [
        { name: "One-Click E-Way Bill Generation", description: "Generate single or bulk e-way bills in seconds, error-free." },
        { name: "Part A & B Auto-Fill from Invoices", description: "Reduce manual entry with smart auto-fill from existing invoice data." },
        { name: "Expiry Alerts & Validity Reminders", description: "Get notified before your e-way bills expire to avoid penalties." },
        { name: "Vehicle-Wise, Route-Wise Reports", description: "Powerful insights for efficient transport planning." }
      ]
    },
    // Module C - GST Compliances
    {
      title: "GST Compliances Module – Make your compliances fantastic with GSTastic!",
      features: [
        { name: "GSTR 1, 3B, 9, 9C Filing Made Easy", description: "Step-by-step guided filing process with built-in validation checks." },
        { name: "Smart Reconciliation Engine", description: "Match books with GSTR-2A/2B in real-time and auto-suggest corrections." },
        { name: "IMS Tool", description: "Dedicated IMS tool module that supports bulk inputs for easier invoice processing." },
        { name: "Live Information Dashboard", description: "View ITC position, filing status, payment dues, and return summary—at a glance." },
        { name: "Excel & JSON Import/Export Support", description: "Flexible input/output for different accounting ecosystems." },
        { name: "Auto-Interest, Late Fee & Payment Calculators", description: "Automatically calculate late fees, interest, and generate challans." },
        { name: "Value Add Reports", description: "Get insights like mismatch summaries, filing consistency trends, vendor ratings, and more." },
        { name: "Monthly Compliance Calendar", description: "Integrated due date tracker to help you never miss a deadline." }
      ]
    },
    // Module D - IMS Tool
    {
      title: "IMS Tool (Invoice Management System) – Bulk action, zero tension!",
      features: [
        { name: "Centralised Invoice Repository", description: "Manage and retrieve all your sales/purchase invoices from one place." },
        { name: "Smart Search & Filters", description: "Locate any invoice instantly with dynamic filters and keyword search." },
        { name: "Excel Based Inputs", description: "Support for bulk inputs using Excel, allowing quick import of invoice actions." }
      ]
    }
  ];

  return (
    <div className="modules-list">
      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module flex justify-center items-center gap-2">
         <span className="bullet-dot"></span> <h2 className="module-title">{module.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default ModulesList;
