import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/firebase';  // adjust the path
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const SalesForm = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    // add other fields as needed
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "masters/ONBOARDING/CUSTOMER"));
      const customerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setCustomers(customerList);
    };

    fetchCustomers();
  }, []);

  const handleSelectChange = async (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);

    if (customerId) {
      const docRef = doc(db, "masters/ONBOARDING/CUSTOMER", customerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          // set other fields similarly
        });
      }
    }
  };

  return (
    <form>
      <div>
        <label>Select Customer:</label>
        <select value={selectedCustomerId} onChange={handleSelectChange}>
          <option value="">-- Select --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Name:</label>
        <input type="text" value={formData.name} readOnly />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={formData.email} readOnly />
      </div>
      <div>
        <label>Phone:</label>
        <input type="text" value={formData.phone} readOnly />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" value={formData.address} readOnly />
      </div>

      {/* Add other fields as needed */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default SalesForm;
