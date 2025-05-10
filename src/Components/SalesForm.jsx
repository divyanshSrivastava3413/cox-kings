// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { useForm, useFieldArray } from 'react-hook-form';
// // // import { useHistory } from 'react-router-dom';

// // // const InvoiceForm = () => {
// // //   const history = useHistory();

// // //   // State for storing fetched data
// // //   const [onboardingCustomerData, setOnboardingCustomerData] = useState([]);
// // //   const [stockData, setStockData] = useState({ items: [] });

// // //   // Fetch customer data
// // //   useEffect(() => {
// // //     axios.get('/api/onboarding-customers')
// // //       .then(response => setOnboardingCustomerData(response.data));
    
// // //     axios.get('/api/stock-items')
// // //       .then(response => setStockData({ items: response.data }));
// // //   }, []);

// // //   // Handling form state with react-hook-form
// // //   const {
// // //     register,
// // //     control,
// // //     handleSubmit,
// // //     reset,
// // //     setValue,
// // //     getValues,
// // //   } = useForm({
// // //     defaultValues: {
// // //       customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
// // //       shipFrom: { name: '', address: '', stateCode: '', gstin: '' },
// // //       shipTo: { name: '', address: '', stateCode: '', gstin: '' },
// // //       invoiceNumber: '',
// // //       invoiceDate: '',
// // //       placeOfSupply: '',
// // //       reverseCharge: 'No',
// // //       items: [{
// // //         name: '',
// // //         description: '',
// // //         hsnSac: '',
// // //         quantity: 1,
// // //         maxQuantity: 0,
// // //         uom: '',
// // //         basicValue: 0,
// // //         itemdiscount: 0,
// // //         taxableValue: 0,
// // //         gstRate: 0,
// // //         igst: 0,
// // //         cgst: 0,
// // //         sgst: 0,
// // //         cess: 0,
// // //         total: 0,
// // //       }],
// // //     },
// // //   });

// // //   const { fields, append, remove } = useFieldArray({
// // //     control,
// // //     name: 'items',
// // //   });

// // //   const [total, setTotals] = useState({
// // //     totalBasicValue: 0,
// // //     totalitemdiscount: 0,
// // //     totalTaxableValue: 0,
// // //     totalIgst: 0,
// // //     totalCgst: 0,
// // //     totalSgst: 0,
// // //     totalCess: 0,
// // //     totalOverall: 0,
// // //   });

// // //   const onSubmit = async (data) => {
// // //     try {
// // //       // Here you can send the form data to your API or save it
// // //       console.log(data);
  
// // //       // Example: Save invoice logic
// // //       await saveInvoice(data);
// // //       alert('Invoice saved successfully!');
// // //     } catch (error) {
// // //       console.error('Error saving invoice:', error);
// // //       alert('There was an error while saving the invoice.');
// // //     }
// // //   };
  

// // // //   // Handle form submission
// // // //   const onSubmit = (data) => {
// // // //     // Here you can handle the mutation for saving the data to your backend.
// // // //     axios.post('/api/save-invoice', { record: data })
// // // //       .then(response => {
// // // //         // Success logic (toast notifications, etc.)
// // // //         console.log('Invoice saved:', response.data);
// // // //       })
// // // //       .catch(error => {
// // // //         // Error logic
// // // //         console.error('Error saving invoice:', error);
// // // //       });

// // // //     reset(); // Reset form after submission
// // // //     history.push('/dashboard/user'); // Redirect after saving
// // // //   };

// // // //   // Handle quantity change and update totals
// // // //   const handleInputQuantity = (e, index) => {
// // // //     const inputValue = parseInt(e.target.value, 10);
// // // //     const maxQuantity = getValues(`items.${index}.maxQuantity`);
// // // //     const basicValue = getValues(`items.${index}.basicValue`);
// // // //     const gstRate = getValues(`items.${index}.gstRate`);

// // // //     if (inputValue > maxQuantity) {
// // // //       setValue(`items.${index}.quantity`, maxQuantity);
// // // //       e.target.value = maxQuantity.toString();
// // // //     } else if (inputValue < 1) {
// // // //       setValue(`items.${index}.quantity`, 1);
// // // //       e.target.value = '1';
// // // //     } else {
// // // //       setValue(`items.${index}.quantity`, inputValue);
// // // //     }

// // // //     const quantity = getValues(`items.${index}.quantity`);
// // // //     const taxableValue = basicValue * quantity;

// // // //     setValue(`items.${index}.taxableValue`, taxableValue);
// // // //     setValue(`items.${index}.cgst`, (gstRate / 2) * (taxableValue / 100));
// // // //     setValue(`items.${index}.sgst`, (gstRate / 2) * (taxableValue / 100));
// // // //     setValue(`items.${index}.igst`, gstRate * (taxableValue / 100));
// // // //     setValue(`items.${index}.total`, taxableValue + (gstRate / 100) * taxableValue);

// // // //     recalculateTotals();
// // // //   };

// // // //   const recalculateTotals = () => {
// // // //     const items = getValues('items');
// // // //     const totalBasicValue = items.reduce((sum, item) => sum + (item.basicValue || 0), 0).toFixed(2);
// // // //     const totalitemdiscount = items.reduce((sum, item) => sum + (item.itemdiscount || 0), 0).toFixed(2);
// // // //     const totalTaxableValue = items.reduce((sum, item) => sum + (item.taxableValue || 0), 0).toFixed(2);
// // // //     const totalIgst = items.reduce((sum, item) => sum + (item.igst || 0), 0).toFixed(2);
// // // //     const totalCgst = items.reduce((sum, item) => sum + (item.cgst || 0), 0).toFixed(2);
// // // //     const totalSgst = items.reduce((sum, item) => sum + (item.sgst || 0), 0).toFixed(2);
// // // //     const totalCess = items.reduce((sum, item) => sum + (item.cess || 0), 0).toFixed(2);
// // // //     const totalOverall = items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2);

// // // //     setTotals({
// // // //       totalBasicValue: parseFloat(totalBasicValue),
// // // //       totalitemdiscount: parseFloat(totalitemdiscount),
// // // //       totalTaxableValue: parseFloat(totalTaxableValue),
// // // //       totalIgst: parseFloat(totalIgst),
// // // //       totalCgst: parseFloat(totalCgst),
// // // //       totalSgst: parseFloat(totalSgst),
// // // //       totalCess: parseFloat(totalCess),
// // // //       totalOverall: parseFloat(totalOverall),
// // // //     });
// // // //   };

// // // //   // Handle vendor selection
// // // //   const handleVendorSelection = (value) => {
// // // //     const party = onboardingCustomerData.find((p) => p.name === value);
// // // //     if (party) {
// // // //       ['customerdtls', 'shipFrom', 'shipTo'].forEach((section) => {
// // // //         setValue(`${section}.name`, party.name);
// // // //         setValue(`${section}.address`, party.address);
// // // //         setValue(`${section}.stateCode`, party.pincode);
// // // //         setValue(`${section}.gstin`, party.gstin);
// // // //       });
// // // //     }
// // // //   };
// // // const handleVendorSelection = (partyName, field) => {
// // //     const selectedParty = onboardingCustomerData.find(
// // //       (party) => party.name === partyName
// // //     );
  
// // //     if (selectedParty) {
// // //       // Update the selected party data in the corresponding field
// // //       setValue(`${field}.name`, selectedParty.name);
// // //       setValue(`${field}.address`, selectedParty.address);
// // //       setValue(`${field}.stateCode`, selectedParty.stateCode);
// // //       setValue(`${field}.gstin`, selectedParty.gstin);
// // //     }
// // //   };
  
// // //   const autofillItemDetails = (index, itemCode) => {
// // //     const selectedItem = stockData.items.find((item) => item.code === itemCode);
  
// // //     if (selectedItem) {
// // //       // Fill out item-specific details (HSN/SAC, UOM, etc.)
// // //       setValue(`items.${index}.hsnSac`, selectedItem.hsnSac);
// // //       setValue(`items.${index}.uom`, selectedItem.uom);
// // //       setValue(`items.${index}.gstRate`, selectedItem.gstRate);
// // //       // Additional logic to calculate basicValue, taxableValue, etc.
// // //       recalculateItemTax(index);
// // //     }
// // //   };
  
// // //   const recalculateItemTax = (index) => {
// // //     const item = getValues(`items.${index}`);
// // //     const basicValue = item.basicValue || 0;
// // //     const itemdiscount = item.itemdiscount || 0;
// // //     const taxableValue = basicValue - itemdiscount;
  
// // //     const gstRate = item.gstRate || 0;
// // //     const gstAmount = (taxableValue * gstRate) / 100;
  
// // //     setValue(`items.${index}.taxableValue`, taxableValue);
// // //     setValue(`items.${index}.total`, taxableValue + gstAmount);
// // //     // Other tax calculations (IGST, CGST, SGST) can be done here if needed.
// // //   };
  
// // //   const handleInputQuantity = (e, index) => {
// // //     const quantity = e.target.value;
// // //     const maxQuantity = getValues(`items.${index}.maxQuantity`);
    
// // //     if (quantity > maxQuantity) {
// // //       alert('Quantity exceeds the maximum allowed value');
// // //       return;
// // //     }
  
// // //     setValue(`items.${index}.quantity`, quantity);
// // //     recalculateItemTax(index);
// // //   };
  
// // //   return (
// // //     <form onSubmit={handleSubmit(onSubmit)}>
// // //       {/* Render the form fields and submit button here */}
// // //     </form>
// // //   );
// // // };

// // // export default InvoiceForm;


// // import React from 'react';
// // import { useForm, useFieldArray, Controller } from 'react-hook-form';
// // import { Button, Input, Label, Select, SelectItem, SelectContent, SelectTrigger, SelectValue, Table, TableHeader, TableRow, TableCell, TableHead, TableBody, Card, CardContent } from '@components'; // Adjust to your UI component imports

// // const InvoiceForm = () => {
// //   const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm({
// //     defaultValues: {
// //       customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
// //       shipFrom: { name: '', address: '', stateCode: '', gstin: '' },
// //       shipTo: { name: '', address: '', stateCode: '', gstin: '' },
// //       invoiceNumber: '',
// //       invoiceDate: '',
// //       placeOfSupply: '',
// //       reverseCharge: '',
// //       items: []
// //     }
// //   });

// //   const { fields, append, remove } = useFieldArray({
// //     control,
// //     name: 'items',
// //   });

// //   // Example data for onboarding customers and stock items (replace with real data)
// //   const onboardingCustomerData = [
// //     { name: 'Party A', address: 'Address A', stateCode: 'ST1', gstin: 'GSTIN1' },
// //     { name: 'Party B', address: 'Address B', stateCode: 'ST2', gstin: 'GSTIN2' },
// //   ];

// //   const stockData = { items: [
// //     { code: 'ITEM001', name: 'Item 1', hsnSac: '1234', uom: 'pcs', gstRate: 18 },
// //     { code: 'ITEM002', name: 'Item 2', hsnSac: '5678', uom: 'kg', gstRate: 12 },
// //   ]};

// //   // Handle vendor selection for customerdtls, shipFrom, and shipTo sections
// //   const handleVendorSelection = (partyName, field) => {
// //     const selectedParty = onboardingCustomerData.find(
// //       (party) => party.name === partyName
// //     );

// //     if (selectedParty) {
// //       setValue(`${field}.name`, selectedParty.name);
// //       setValue(`${field}.address`, selectedParty.address);
// //       setValue(`${field}.stateCode`, selectedParty.stateCode);
// //       setValue(`${field}.gstin`, selectedParty.gstin);
// //     }
// //   };

// //   // Autofill item details based on selected item
// //   const autofillItemDetails = (index, itemCode) => {
// //     const selectedItem = stockData.items.find((item) => item.code === itemCode);

// //     if (selectedItem) {
// //       setValue(`items.${index}.hsnSac`, selectedItem.hsnSac);
// //       setValue(`items.${index}.uom`, selectedItem.uom);
// //       setValue(`items.${index}.gstRate`, selectedItem.gstRate);
// //       recalculateItemTax(index);
// //     }
// //   };

// //   // Recalculate taxes based on item values
// //   const recalculateItemTax = (index) => {
// //     const item = getValues(`items.${index}`);
// //     const basicValue = item.basicValue || 0;
// //     const itemdiscount = item.itemdiscount || 0;
// //     const taxableValue = basicValue - itemdiscount;

// //     const gstRate = item.gstRate || 0;
// //     const gstAmount = (taxableValue * gstRate) / 100;

// //     setValue(`items.${index}.taxableValue`, taxableValue);
// //     setValue(`items.${index}.total`, taxableValue + gstAmount);
// //   };

// //   // Handle quantity input changes
// //   const handleInputQuantity = (e, index) => {
// //     const quantity = e.target.value;
// //     const maxQuantity = getValues(`items.${index}.maxQuantity`);

// //     if (quantity > maxQuantity) {
// //       alert('Quantity exceeds the maximum allowed value');
// //       return;
// //     }

// //     setValue(`items.${index}.quantity`, quantity);
// //     recalculateItemTax(index);
// //   };

// //   // Handle form submission
// //   const onSubmit = (data) => {
// //     console.log(data);
// //     // Implement save functionality, like API calls or other actions
// //   };

// //   return (
// //     <div className="container mx-auto p-4 space-y-6">
// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //         {/* Bill To, Ship From, Ship To Sections */}
// //         <div className="grid grid-cols-3 gap-8">
// //           {/* Bill To */}
// //           <Card>
// //             <CardContent className="p-4 space-y-4">
// //               <h2 className="text-xl font-bold">Bill To</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <Label htmlFor="customerdtls.name">Party Name</Label>
// //                   <Select onValueChange={(value) => handleVendorSelection(value, 'customerdtls')}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder={getValues("customerdtls.name") || "Select Party"} />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {onboardingCustomerData.map((party) => (
// //                         <SelectItem key={party.gstin} value={party.name}>{party.name}</SelectItem>
// //                       ))}
// //                       <SelectItem value="add-new-party">Add New Party</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="customerdtls.address">Address</Label>
// //                   <Input {...register("customerdtls.address")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="customerdtls.stateCode">State Code</Label>
// //                   <Input {...register("customerdtls.stateCode")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="customerdtls.gstin">GSTIN</Label>
// //                   <Input {...register("customerdtls.gstin")} readOnly />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Ship From */}
// //           <Card>
// //             <CardContent className="p-4 space-y-4">
// //               <h2 className="text-xl font-bold">Ship From</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <Label htmlFor="shipFrom.name">Party Name</Label>
// //                   <Select onValueChange={(value) => handleVendorSelection(value, 'shipFrom')}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder={getValues("shipFrom.name") || "Select Party"} />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {onboardingCustomerData.map((party) => (
// //                         <SelectItem key={party.gstin} value={party.name}>{party.name}</SelectItem>
// //                       ))}
// //                       <SelectItem value="add-new-party">Add New Party</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipFrom.address">Address</Label>
// //                   <Input {...register("shipFrom.address")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipFrom.stateCode">State Code</Label>
// //                   <Input {...register("shipFrom.stateCode")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipFrom.gstin">GSTIN</Label>
// //                   <Input {...register("shipFrom.gstin")} readOnly />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Ship To */}
// //           <Card>
// //             <CardContent className="p-4 space-y-4">
// //               <h2 className="text-xl font-bold">Ship To</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <Label htmlFor="shipTo.name">Party Name</Label>
// //                   <Select onValueChange={(value) => handleVendorSelection(value, 'shipTo')}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder={getValues("shipTo.name") || "Select Party"} />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {onboardingCustomerData.map((party) => (
// //                         <SelectItem key={party.gstin} value={party.name}>{party.name}</SelectItem>
// //                       ))}
// //                       <SelectItem value="add-new-party">Add New Party</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipTo.address">Address</Label>
// //                   <Input {...register("shipTo.address")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipTo.stateCode">State Code</Label>
// //                   <Input {...register("shipTo.stateCode")} readOnly />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="shipTo.gstin">GSTIN</Label>
// //                   <Input {...register("shipTo.gstin")} readOnly />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Invoice Details */}
// //         <Card>
// //           <CardContent className="p-4 space-y-4">
// //             <h2 className="text-xl font-bold">Invoice Details</h2>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <Label htmlFor="invoiceNumber">Invoice Number</Label>
// //                 <Input {...register("invoiceNumber")} />
// //               </div>
// //               <div>
// //                 <Label htmlFor="invoiceDate">Invoice Date</Label>
// //                 <Input {...register("invoiceDate")} type="date" />
// //               </div>
// //               <div>
// //                 <Label htmlFor="placeOfSupply">Place of Supply</Label>
// //                 <Input {...register("placeOfSupply")} />
// //               </div>
// //               <div>
// //                 <Label htmlFor="reverseCharge">Reverse Charge</Label>
// //                 <Input {...register("reverseCharge")} type="checkbox" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Items Table */}
// //         <Card>
// //           <CardContent className="p-4 space-y-4">
// //             <h2 className="text-xl font-bold">Items</h2>
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableCell>#</TableCell>
// //                   <TableCell>Item</TableCell>
// //                   <TableCell>HSN</TableCell>
// //                   <TableCell>UOM</TableCell>
// //                   <TableCell>Quantity</TableCell>
// //                   <TableCell>Rate</TableCell>
// //                   <TableCell>itemdiscount</TableCell>
// //                   <TableCell>Taxable Value</TableCell>
// //                   <TableCell>Total</TableCell>
// //                   <TableCell></TableCell>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {fields.map((field, index) => (
// //                   <TableRow key={field.id}>
// //                     <TableCell>{index + 1}</TableCell>
// //                     <TableCell>
// //                       <Select onValueChange={(value) => autofillItemDetails(index, value)}>
// //                         <SelectTrigger>
// //                           <SelectValue placeholder="Select Item" />
// //                         </SelectTrigger>
// //                         <SelectContent>
// //                           {stockData.items.map((item) => (
// //                             <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
// //                           ))}
// //                           <SelectItem value="add-new-item">Add New Item</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input {...register(`items.${index}.hsnSac`)} readOnly />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input {...register(`items.${index}.uom`)} readOnly />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input
// //                         {...register(`items.${index}.quantity`, { valueAsNumber: true })}
// //                         type="number"
// //                         onInput={(e) => handleInputQuantity(e, index)}
// //                       />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input
// //                         {...register(`items.${index}.basicValue`, { valueAsNumber: true })}
// //                         type="number"
// //                       />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input
// //                         {...register(`items.${index}.itemdiscount`, { valueAsNumber: true })}
// //                         type="number"
// //                       />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input {...register(`items.${index}.taxableValue`)} readOnly />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Input {...register(`items.${index}.total`)} readOnly />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
// //                         {/* Trash Icon */}
// //                       </Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //                 {/* TOTAL Row */}
// //               </TableBody>
// //             </Table>
// //           </CardContent>
// //         </Card>

// //         {/* Submit Button */}
// //         <div className="flex justify-end">
// //           <Button type="submit">Save Invoice</Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default InvoiceForm;

// // import { doc, getDoc } from 'firebase/firestore';
// // import React, { useEffect } from 'react';
// // import { useForm, useFieldArray, Controller } from 'react-hook-form';

// // const InvoiceForm = () => {
// //   const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm({
// //     defaultValues: {
// //       customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
// //       shipFrom: { name: '', address: '', stateCode: '', gstin: '' },
// //       shipTo: { name: '', address: '', stateCode: '', gstin: '' },
// //       invoiceNumber: '',
// //       invoiceDate: '',
// //       placeOfSupply: '',
// //       reverseCharge: '',
// //       items: []
// //     }
// //   });

// //   const { fields, append, remove } = useFieldArray({
// //     control,
// //     name: 'items',
// //   });

// //   // Example data for onboarding customers and stock items (replace with real data)


// //     const fetchCustomers=async()=>{
// //       const docRef = doc(db, "masters/ONBOARDING/CUSTOMER", customerId);
// //       const docSnap = await getDoc(docRef);
// //       if (docSnap.exists()) {
// //         const data = docSnap.data();
        
// //     }
// //       }
// //       fetchCustomers();
    



// //   const onboardingCustomerData = [
// //     { name: 'Party A', address: 'Address A', stateCode: 'ST1', gstin: 'GSTIN1' },
// //     { name: 'Party B', address: 'Address B', stateCode: 'ST2', gstin: 'GSTIN2' },
// //   ];

// //   const stockData = { items: [
// //     { code: 'ITEM001', name: 'Item 1', hsnSac: '1234', uom: 'pcs', gstRate: 18 },
// //     { code: 'ITEM002', name: 'Item 2', hsnSac: '5678', uom: 'kg', gstRate: 12 },
// //   ]};

// //   // Handle vendor selection for customerdtls, shipFrom, and shipTo sections
// //   const handleVendorSelection = (partyName, field) => {


// //     const selectedParty = onboardingCustomerData.find(
// //       (party) => party.name === partyName
// //     );

// //     if (selectedParty) {
// //       setValue(`${field}.name`, selectedParty.name);
// //       setValue(`${field}.address`, selectedParty.address);
// //       setValue(`${field}.stateCode`, selectedParty.stateCode);
// //       setValue(`${field}.gstin`, selectedParty.gstin);
// //     }
// //   };

// //   // Autofill item details based on selected item
// //   const autofillItemDetails = (index, itemCode) => {
// //     const selectedItem = stockData.items.find((item) => item.code === itemCode);

// //     if (selectedItem) {
// //       setValue(`items.${index}.hsnSac`, selectedItem.hsnSac);
// //       setValue(`items.${index}.uom`, selectedItem.uom);
// //       setValue(`items.${index}.gstRate`, selectedItem.gstRate);
// //       recalculateItemTax(index);
// //     }
// //   };

// //   // Recalculate taxes based on item values
// //   const recalculateItemTax = (index) => {
// //     const item = getValues(`items.${index}`);
// //     const basicValue = item.basicValue || 0;
// //     const itemdiscount = item.itemdiscount || 0;
// //     const taxableValue = basicValue - itemdiscount;

// //     const gstRate = item.gstRate || 0;
// //     const gstAmount = (taxableValue * gstRate) / 100;

// //     setValue(`items.${index}.taxableValue`, taxableValue);
// //     setValue(`items.${index}.total`, taxableValue + gstAmount);
// //   };

// //   // Handle quantity input changes
// //   const handleInputQuantity = (e, index) => {
// //     const quantity = e.target.value;
// //     const maxQuantity = getValues(`items.${index}.maxQuantity`);

// //     if (quantity > maxQuantity) {
// //       alert('Quantity exceeds the maximum allowed value');
// //       return;
// //     }

// //     setValue(`items.${index}.quantity`, quantity);
// //     recalculateItemTax(index);
// //   };

// //   // Handle form submission
// //   const onSubmit = (data) => {
// //     console.log(data);
// //     // Implement save functionality, like API calls or other actions
// //   };

// //   return (
// //     <div className="container mx-auto p-4 space-y-6">
// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //         {/* Bill To, Ship From, Ship To Sections */}
// //         <div className="grid grid-cols-3 gap-8">
// //           {/* Bill To */}
// //           <div>
// //             <h2 className="text-xl font-bold">Bill To</h2>
// //             <div>
// //               <label htmlFor="customerdtls.name">Party Name</label>
// //               <select {...register('customerdtls.name')} onChange={(e) => handleVendorSelection(e.target.value, 'customerdtls')}>
// //                 <option value="">Select Party</option>
// //                 {onboardingCustomerData.map((party) => (
// //                   <option key={party.gstin} value={party.name}>{party.name}</option>
// //                 ))}
// //                 <option value="add-new-party">Add New Party</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label htmlFor="customerdtls.address">Address</label>
// //               <input {...register("customerdtls.address")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="customerdtls.stateCode">State Code</label>
// //               <input {...register("customerdtls.stateCode")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="customerdtls.gstin">GSTIN</label>
// //               <input {...register("customerdtls.gstin")} readOnly />
// //             </div>
// //           </div>

// //           {/* Ship From */}
// //           <div>
// //             <h2 className="text-xl font-bold">Ship From</h2>
// //             <div>
// //               <label htmlFor="shipFrom.name">Party Name</label>
// //               <select {...register('shipFrom.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipFrom')}>
// //                 <option value="">Select Party</option>
// //                 {onboardingCustomerData.map((party) => (
// //                   <option key={party.gstin} value={party.name}>{party.name}</option>
// //                 ))}
// //                 <option value="add-new-party">Add New Party</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label htmlFor="shipFrom.address">Address</label>
// //               <input {...register("shipFrom.address")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="shipFrom.stateCode">State Code</label>
// //               <input {...register("shipFrom.stateCode")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="shipFrom.gstin">GSTIN</label>
// //               <input {...register("shipFrom.gstin")} readOnly />
// //             </div>
// //           </div>

// //           {/* Ship To */}
// //           <div>
// //             <h2 className="text-xl font-bold">Ship To</h2>
// //             <div>
// //               <label htmlFor="shipTo.name">Party Name</label>
// //               <select {...register('shipTo.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipTo')}>
// //                 <option value="">Select Party</option>
// //                 {onboardingCustomerData.map((party) => (
// //                   <option key={party.gstin} value={party.name}>{party.name}</option>
// //                 ))}
// //                 <option value="add-new-party">Add New Party</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label htmlFor="shipTo.address">Address</label>
// //               <input {...register("shipTo.address")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="shipTo.stateCode">State Code</label>
// //               <input {...register("shipTo.stateCode")} readOnly />
// //             </div>
// //             <div>
// //               <label htmlFor="shipTo.gstin">GSTIN</label>
// //               <input {...register("shipTo.gstin")} readOnly />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Invoice Details */}
// //         <div>
// //           <h2 className="text-xl font-bold">Invoice Details</h2>
// //           <div>
// //             <label htmlFor="invoiceNumber">Invoice Number</label>
// //             <input {...register("invoiceNumber")} />
// //           </div>
// //           <div>
// //             <label htmlFor="invoiceDate">Invoice Date</label>
// //             <input {...register("invoiceDate")} type="date" />
// //           </div>
// //           <div>
// //             <label htmlFor="placeOfSupply">Place of Supply</label>
// //             <input {...register("placeOfSupply")} />
// //           </div>
// //           <div>
// //             <label htmlFor="reverseCharge">Reverse Charge</label>
// //             <input {...register("reverseCharge")} type="checkbox" />
// //           </div>
// //         </div>

// //         {/* Items Table */}
// //         <div>
// //           <h2 className="text-xl font-bold">Items</h2>
// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>#</th>
// //                 <th>Item</th>
// //                 <th>HSN</th>
// //                 <th>UOM</th>
// //                 <th>Quantity</th>
// //                 <th>Rate</th>
// //                 <th>itemdiscount</th>
// //                 <th>Taxable Value</th>
// //                 <th>Total</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {fields.map((field, index) => (
// //                 <tr key={field.id}>
// //                   <td>{index + 1}</td>
// //                   <td>
// //                     <select onChange={(e) => autofillItemDetails(index, e.target.value)}>
// //                       <option value="">Select Item</option>
// //                       {stockData.items.map((item) => (
// //                         <option key={item.code} value={item.code}>{item.name}</option>
// //                       ))}
// //                       <option value="add-new-item">Add New Item</option>
// //                     </select>
// //                   </td>
// //                   <td><input {...register(`items.${index}.hsnSac`)} readOnly /></td>
// //                   <td><input {...register(`items.${index}.uom`)} readOnly /></td>
// //                   <td>
// //                     <input
// //                       {...register(`items.${index}.quantity`, { valueAsNumber: true })}
// //                       type="number"
// //                       onInput={(e) => handleInputQuantity(e, index)}
// //                     />
// //                   </td>
// //                   <td><input {...register(`items.${index}.basicValue`, { valueAsNumber: true })} type="number" /></td>
// //                   <td><input {...register(`items.${index}.itemdiscount`, { valueAsNumber: true })} type="number" /></td>
// //                   <td><input {...register(`items.${index}.taxableValue`)} readOnly /></td>
// //                   <td><input {...register(`items.${index}.total`)} readOnly /></td>
// //                   <td>
// //                     <button type="button" onClick={() => remove(index)}>Remove</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Submit Button */}
// //         <div>
// //           <button type="submit">Save Invoice</button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default InvoiceForm;

// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { db } from '../Firebase/firebase';  // Adjust the path if needed

// const InvoiceForm = () => {
//   const { register, handleSubmit, control, setValue, getValues } = useForm({
//     defaultValues: {
//       customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
//       shipFrom: { name: '', address: '', stateCode: '', gstin: '' },
//       shipTo: { name: '', address: '', stateCode: '', gstin: '' },
//       invoiceNumber: '',
//       invoiceDate: '',
//       placeOfSupply: '',
//       reverseCharge: '',
//       items: []
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'items',
//   });

//   // 🔥 1️⃣ Firestore Customers
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "masters/ONBOARDING/CUSTOMER"));
//         const customerList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCustomers(customerList);
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   // 2️⃣ Keep stock data as-is for now
//   const stockData = {
//     items: [
//       { code: 'ITEM001', name: 'Item 1', hsnSac: '1234', uom: 'pcs', gstRate: 18 },
//       { code: 'ITEM002', name: 'Item 2', hsnSac: '5678', uom: 'kg', gstRate: 12 },
//     ]
//   };

//   // 3️⃣ Handle vendor selection
//   const handleVendorSelection = (partyName, field) => {
//     const selectedParty = customers.find((party) => party.name === partyName);

//     if (selectedParty) {
//       setValue(`${field}.name`, selectedParty.name);
//       setValue(`${field}.address`, selectedParty.address);
//       setValue(`${field}.stateCode`, selectedParty.pincode);
//       setValue(`${field}.gstin`, selectedParty.gstin);
//     }
//   };

//   // 4️⃣ Autofill item details
//   const autofillItemDetails = (index, itemCode) => {
//     const selectedItem = stockData.items.find((item) => item.code === itemCode);

//     if (selectedItem) {
//       setValue(`items.${index}.hsnSac`, selectedItem.hsnSac);
//       setValue(`items.${index}.uom`, selectedItem.uom);
//       setValue(`items.${index}.gstRate`, selectedItem.gstRate);
//       recalculateItemTax(index);
//     }
//   };

//   const recalculateItemTax = (index) => {
//     const item = getValues(`items.${index}`);
//     const basicValue = item.basicValue || 0;
//     const itemdiscount = item.itemdiscount || 0;
//     const taxableValue = basicValue - itemdiscount;

//     const gstRate = item.gstRate || 0;
//     const gstAmount = (taxableValue * gstRate) / 100;

//     setValue(`items.${index}.taxableValue`, taxableValue);
//     setValue(`items.${index}.total`, taxableValue + gstAmount);
//   };

//   const handleInputQuantity = (e, index) => {
//     const quantity = e.target.value;
//     const maxQuantity = getValues(`items.${index}.maxQuantity`);

//     if (quantity > maxQuantity) {
//       alert('Quantity exceeds the maximum allowed value');
//       return;
//     }

//     setValue(`items.${index}.quantity`, quantity);
//     recalculateItemTax(index);
//   };

//   const onSubmit = (data) => {
//     console.log(data);
//     // Save to database or other actions
//   };

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Bill To, Ship From, Ship To Sections */}
//         <div className="grid grid-cols-3 gap-8">
//           {/* Bill To */}
//           <div>
//             <h2 className="text-xl font-bold">Bill To</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('customerdtls.name')} onChange={(e) => handleVendorSelection(e.target.value, 'customerdtls')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("customerdtls.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("customerdtls.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("customerdtls.gstin")} readOnly />
//             </div>
//           </div>

//           {/* Ship From */}
//           {/* <div>
//             <h2 className="text-xl font-bold">Ship From</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('shipFrom.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipFrom')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("shipFrom.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("shipFrom.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("shipFrom.gstin")} readOnly />
//             </div>
//           </div> */}

//           {/* Ship To */}
//           {/* <div>
//             <h2 className="text-xl font-bold">Ship To</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('shipTo.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipTo')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("shipTo.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("shipTo.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("shipTo.gstin")} readOnly />
//             </div>
//           </div> */}
//         </div>

//         {/* Invoice Details */}
//         {/* <div>
//           <h2 className="text-xl font-bold">Invoice Details</h2>
//           <div>
//             <label>Invoice Number</label>
//             <input {...register("invoiceNumber")} />
//           </div>
//           <div>
//             <label>Invoice Date</label>
//             <input {...register("invoiceDate")} type="date" />
//           </div>
//           <div>
//             <label>Place of Supply</label>
//             <input {...register("placeOfSupply")} />
//           </div>
//           <div>
//             <label>Reverse Charge</label>
//             <input {...register("reverseCharge")} type="checkbox" />
//           </div>
//         </div> */}

//         {/* Items Table */}
//         <div>
//           <h2 className="text-xl font-bold">Items</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>HSN</th>
//                 <th>UOM</th>
//                 <th>Quantity</th>
//                 <th>Rate</th>
//                 <th>itemdiscount</th>
//                 <th>Taxable Value</th>
//                 <th>Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => (
//                 <tr key={field.id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <select onChange={(e) => autofillItemDetails(index, e.target.value)}>
//                       <option value="">Select Item</option>
//                       {stockData.items.map((item) => (
//                         <option key={item.code} value={item.code}>{item.name}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td><input {...register(`items.${index}.hsnSac`)} readOnly /></td>
//                   <td><input {...register(`items.${index}.uom`)} readOnly /></td>
//                   <td>
//                     <input
//                       {...register(`items.${index}.quantity`, { valueAsNumber: true })}
//                       type="number"
//                       onInput={(e) => handleInputQuantity(e, index)}
//                     />
//                   </td>
//                   <td><input {...register(`items.${index}.basicValue`, { valueAsNumber: true })} type="number" /></td>
//                   <td><input {...register(`items.${index}.itemdiscount`, { valueAsNumber: true })} type="number" /></td>
//                   <td><input {...register(`items.${index}.taxableValue`)} readOnly /></td>
//                   <td><input {...register(`items.${index}.total`)} readOnly /></td>
//                   <td>
//                     <button type="button" onClick={() => remove(index)}>Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button type="submit">Save Invoice</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default InvoiceForm;


// {latest correct}
// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { db } from '../Firebase/firebase';  // Adjust path if needed

// const InvoiceForm = () => {
//   const { register, handleSubmit, control, setValue, getValues } = useForm({
//     defaultValues: {
//       customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
//       shipFrom: { name: '', address: '', stateCode: '', gstin: '' },
//       shipTo: { name: '', address: '', stateCode: '', gstin: '' },
//       invoiceNumber: '',
//       invoiceDate: '',
//       placeOfSupply: '',
//       reverseCharge: '',
//       items: []
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'items',
//   });

//   // 1️⃣ Customers from Firestore
//   const [customers, setCustomers] = useState([]);

//   // 2️⃣ Items from Firestore
//   const [stockItems, setStockItems] = useState([]);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "masters/ONBOARDING/CUSTOMER"));
//         const customerList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCustomers(customerList);
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     const fetchStockItems = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "masters/STOCK/records"));
//         const itemList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setStockItems(itemList);
//       } catch (error) {
//         console.error('Error fetching stock items:', error);
//       }
//     };

//     fetchCustomers();
//     fetchStockItems();
//   }, []);

//   // Handle vendor selection
//   const handleVendorSelection = (partyName, field) => {
//     const selectedParty = customers.find((party) => party.name === partyName);

//     if (selectedParty) {
//       setValue(`${field}.name`, selectedParty.name);
//       setValue(`${field}.address`, selectedParty.address);
//       setValue(`${field}.stateCode`, selectedParty.pincode);
//       setValue(`${field}.gstin`, selectedParty.gstin);
//     }
//   };

//   // Autofill item details based on selection
//   const autofillItemDetails = (index, itemCode) => {
//     const selectedItem = stockItems.find((item) => item.code === itemCode);

//     if (selectedItem) {
//         setValue(`items.${index}.name`, selectedItem.name);
//         setValue(`items.${index}.hsnSac`, selectedItem.hsn);
//         setValue(`items.${index}.uom`, selectedItem.uom || "");
//         setValue(`items.${index}.maxQuantity`, selectedItem.quantity || 0);
//         setValue(`items.${index}.basicValue`, selectedItem.amount);
//         setValue(`items.${index}.gstRate`, parseFloat(selectedItem.gstTaxCode));
//       recalculateItemTax(index);
//     }
//   };

//   const recalculateItemTax = (index) => {
//     const item = getValues(`items.${index}`);
//     const basicValue = item.basicValue || 0;
//     const itemdiscount = item.itemdiscount || 0;
//     const taxableValue = basicValue - itemdiscount;

//     const gstRate = item.gstRate || 0;
//     const gstAmount = (taxableValue * gstRate) / 100;

//     setValue(`items.${index}.taxableValue`, taxableValue);
//     setValue(`items.${index}.total`, taxableValue + gstAmount);
//   };

//   const handleInputQuantity = (e, index) => {
//     const quantity = e.target.value;
//     const maxQuantity = getValues(`items.${index}.maxQuantity`);

//     if (quantity > maxQuantity) {
//       alert('Quantity exceeds the maximum allowed value');
//       return;
//     }

//     setValue(`items.${index}.quantity`, quantity);
//     recalculateItemTax(index);
//   };

//   const onSubmit = (data) => {
//     console.log(data);
//     // Save to database or other actions
//   };

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Bill To, Ship From, Ship To Sections */}
//         <div className="grid grid-cols-3 gap-8">
//           {/* Bill To */}
//           <div>
//             <h2 className="text-xl font-bold">Bill To</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('customerdtls.name')} onChange={(e) => handleVendorSelection(e.target.value, 'customerdtls')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("customerdtls.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("customerdtls.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("customerdtls.gstin")} readOnly />
//             </div>
//           </div>

//           {/* Ship From */}
//           <div>
//             <h2 className="text-xl font-bold">Ship From</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('shipFrom.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipFrom')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("shipFrom.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("shipFrom.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("shipFrom.gstin")} readOnly />
//             </div>
//           </div>

//           {/* Ship To */}
//           <div>
//             <h2 className="text-xl font-bold">Ship To</h2>
//             <div>
//               <label>Party Name</label>
//               <select {...register('shipTo.name')} onChange={(e) => handleVendorSelection(e.target.value, 'shipTo')}>
//                 <option value="">Select Party</option>
//                 {customers.map((party) => (
//                   <option key={party.id} value={party.name}>{party.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Address</label>
//               <input {...register("shipTo.address")} readOnly />
//             </div>
//             <div>
//               <label>State Code</label>
//               <input {...register("shipTo.stateCode")} readOnly />
//             </div>
//             <div>
//               <label>GSTIN</label>
//               <input {...register("shipTo.gstin")} readOnly />
//             </div>
//           </div>
//         </div>

//         {/* Invoice Details */}
//         <div>
//           <h2 className="text-xl font-bold">Invoice Details</h2>
//           <div>
//             <label>Invoice Number</label>
//             <input {...register("invoiceNumber")} />
//           </div>
//           <div>
//             <label>Invoice Date</label>
//             <input {...register("invoiceDate")} type="date" />
//           </div>
//           <div>
//             <label>Place of Supply</label>
//             <input {...register("placeOfSupply")} />
//           </div>
//           <div>
//             <label>Reverse Charge</label>
//             <input {...register("reverseCharge")} type="checkbox" />
//           </div>
//         </div>

//         {/* Items Table */}
//         <div>
//           <h2 className="text-xl font-bold">Items</h2>
//           <button type="button" onClick={() => append({})} className="mb-4 bg-blue-500 text-white px-3 py-1 rounded">Add Item</button>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>HSN</th>
//                 <th>UOM</th>
//                 <th>Quantity</th>
//                 <th>Rate</th>
//                 <th>itemdiscount</th>
//                 <th>Taxable Value</th>
//                 <th>Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => (
//                 <tr key={field.id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <select onChange={(e) => autofillItemDetails(index, e.target.value)}>
//                       <option value="">Select Item</option>
//                       {stockItems.map((item) => (
//                         <option key={item.id} value={item.code}>{item.name}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td><input {...register(`items.${index}.hsnSac`)} readOnly /></td>
//                   <td><input {...register(`items.${index}.uom`)} readOnly /></td>
//                   <td>
//                     <input
//                       {...register(`items.${index}.quantity`, { valueAsNumber: true })}
//                       type="number"
//                       onInput={(e) => handleInputQuantity(e, index)}
//                     />
//                   </td>
//                   <td><input {...register(`items.${index}.basicValue`, { valueAsNumber: true })} type="number" /></td>
//                   <td><input {...register(`items.${index}.itemdiscount`, { valueAsNumber: true })} type="number" /></td>
//                   <td><input {...register(`items.${index}.taxableValue`)} readOnly /></td>
//                   <td><input {...register(`items.${index}.total`)} readOnly /></td>
//                   <td>
//                     <button type="button" onClick={() => remove(index)}>Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button type="submit">Save Invoice</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default InvoiceForm;

import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { db  } from '../Firebase/firebase';  // Firestore
import { rtdb } from '../Firebase/firebase';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';


import { ref, get, runTransaction } from 'firebase/database';  // Realtime DB
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const InvoiceForm = () => {
  const navigate = useNavigate();
   const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  
  const { register, handleSubmit, control, setValue, getValues,formState: { errors },reset } = useForm({
    defaultValues: {
      customerdtls: { name: '', address: '', stateCode: '', gstin: '' },
      
      bookingId: '',  // This is your booking ID
      invoiceDate: '',
      startdate:'',
      enddate:'',
      adv:0,
      pkgName:'',
      pkgPrice:0,
      discount:0,
      topay:0,


      items: [
        {
          name: "",
          code:'',
          description: "",
          hsnSac: "",
          quantity: 1,
          maxQuantity: 0,
          uom: "",
          basicValue: 0,
          itemdiscount: 0,
          taxableValue: 0,
          gstRate: 0,
          igst: 0,
          cgst: 0,
          sgst: 0,
          cess: 0,
          total: 0,
        },
      ]
    }
  });
  
  const [openAddModal, setOpenAddModal] = useState(false);
const [formValues, setFormValues] = useState({
  name: "",
  description: "",
  hsnSac: "",
  quantity: 1,
  maxQuantity: 0,
  uom: "",
  basicValue: 0,
  itemdiscount: 0,
  taxableValue: 0,
  gstRate: 0,
  igst: 0,
  cgst: 0,
  sgst: 0,
  cess: 0,
  total: 0,
});




  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Customers from Firestore
  const [customers, setCustomers] = useState([]);

  // Items from Firestore
  const [stockItems, setStockItems] = useState([]);

  // 1️⃣ Fetch Customers & Items
  const fetchStockItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "masters/STOCK/records"));
        const itemList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStockItems(itemList);
      } catch (error) {
        console.error('Error fetching stock items:', error);
      }
    };
     const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "masters/ONBOARDING/CUSTOMER"));
        const customerList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  useEffect(() => {
   fetchCustomers();
    fetchStockItems();
  }, []);

  
useEffect(() => {
  const fetchBookingNumber = async () => {
    const lastNumberRef = ref(rtdb, 'lastBookingNumber');
    const snapshot = await get(lastNumberRef);
    const lastNumber = snapshot.exists() ? snapshot.val() : 0;
    
    // 👉 Format as "B001", "B002", etc.
    // const formattedId = `B${String(lastNumber + 1).padStart(3, '0')}`;

    // setValue('bookingId', formattedId);  // Set formatted ID in form
    const formattedBookingId = `BK-${(lastNumber+1).toString().padStart(5, '0')}`;
setValue('bookingId', formattedBookingId);

  };

  fetchBookingNumber();
}, [setValue]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValues(prev => ({
    ...prev,
    [name]: ['quantity','maxQuantity','basicValue','itemdiscount','taxableValue','gstRate','igst','cgst','sgst','cess','total'].includes(name)
      ? Number(value)
      : value,
  }));
};
const addItemSubmit = async (e) => {
  e.preventDefault();
  try {
    const docRef = doc(db, 'masters/STOCK/records', formValues.name); // ✅ doc ID = name
    await setDoc(docRef, formValues);
    setOpenAddModal(false);
    alert('Item added successfully!');
    // OPTIONAL: refresh your items list here
    fetchStockItems()
  } catch (error) {
    console.error('Error adding item:', error);
    alert('Failed to add item.');
  }
};
const fetchItemCodeFromRTDB = async (prefix, index) => {
  const itemCodeRef = ref(rtdb, `itemSequences/${prefix}`);
  try {
    const snapshot = await get(itemCodeRef);
    const currentCodeInDb = snapshot.exists() ? snapshot.val() : 0;

    // 👉 display current code +1 (since we're showing next available)
    const codeToDisplay = currentCodeInDb + 1;

    const formattedCode = `${prefix}${String(codeToDisplay).padStart(4, '0')}`;
    setValue(`items.${index}.code`, formattedCode);
    console.log(`Fetched code for ${prefix}: ${formattedCode}`);
  } catch (err) {
    console.error('Error fetching item code:', err);
    alert('Failed to fetch item code');
  }
};





  // Handle vendor selection
  const handleVendorSelection = (partyName, field) => {
    const selectedParty = customers.find((party) => party.name === partyName);

    if (selectedParty) {
      setValue(`${field}.name`, selectedParty.name);
      setValue(`${field}.address`, selectedParty.address);
      setValue(`${field}.stateCode`, selectedParty.pincode);
      setValue(`${field}.city`, selectedParty.city);
      setValue(`${field}.gstin`, selectedParty.gstin);
      setValue(`${field}.email`, selectedParty.email);
      setValue(`${field}.phone`, selectedParty.phone);
    }
  };

 
  // function autofillItemDetails(index, selectedItemName) {
  //   const item = stockItems.find((i) => i.name === selectedItemName);
  //   if (item) {
  //     setValue(`items.${index}.description`, item.description || "");
  //     setValue(`items.${index}.hsnSac`, item.hsnSac || "");
  //     setValue(`items.${index}.uom`, item.uom || "");
  //     setValue(`items.${index}.basicValue`, item.basicValue || 0);
  //     setValue(`items.${index}.gstRate`, item.gstRate || 0);
  //     setValue(`items.${index}.igst`, item.igst || 0);
  //     setValue(`items.${index}.cgst`, item.cgst || 0);
  //     setValue(`items.${index}.sgst`, item.sgst || 0);
  //     setValue(`items.${index}.cess`, item.cess || 0);
  //     setValue(`items.${index}.total`, item.total || 0);
  //   }
    
  // }
  async function autofillItemDetails(index, selectedItemName) {
  const item = stockItems.find((i) => i.name === selectedItemName);
  if (item) {
    setValue(`items.${index}.description`, item.description || "");
    setValue(`items.${index}.hsnSac`, item.hsnSac || "");
    setValue(`items.${index}.uom`, item.uom || "");
    setValue(`items.${index}.basicValue`, item.basicValue || 0);
    setValue(`items.${index}.gstRate`, item.gstRate || 0);
    setValue(`items.${index}.igst`, item.igst || 0);
    setValue(`items.${index}.cgst`, item.cgst || 0);
    setValue(`items.${index}.sgst`, item.sgst || 0);
    setValue(`items.${index}.cess`, item.cess || 0);
    setValue(`items.${index}.total`, item.total || 0);

    // 🆕 Generate item code
  //   const prefix = item.name.substring(0, 2).toUpperCase();
  //   try {
  //     const itemCode = await generateItemCode(prefix);
  //     setValue(`items.${index}.code`, itemCode);
  //     console.log(`Generated item code: ${itemCode}`);
  //   } catch (err) {
  //     console.error('Error generating item code:', err);
  //     alert('Failed to generate item code');
  //   }
   
   // 🔥 fetch code from RTDB
    const prefix = item.name.substring(0, 2).toUpperCase();
    await fetchItemCodeFromRTDB(prefix, index);

   }
}


  const recalculateItemTax = (index) => {
    const item = getValues(`items.${index}`);
    const basicValue = item.basicValue || 0;
    const itemdiscount = item.itemdiscount || 0;
    const taxableValue = basicValue - itemdiscount;

    const gstRate = item.gstRate || 0;
    const gstAmount = (taxableValue * gstRate) / 100;

    setValue(`items.${index}.taxableValue`, taxableValue);
    setValue(`items.${index}.total`, taxableValue + gstAmount);
  };

  const handleInputQuantity = (e, index) => {
    const quantity = e.target.value;
    const maxQuantity = getValues(`items.${index}.maxQuantity`);

    if (quantity > maxQuantity) {
      alert('Quantity exceeds the maximum allowed value');
      return;
    }

    setValue(`items.${index}.quantity`, quantity);
    recalculateItemTax(index);
  };

  const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnackbarOpen(false);
    };

  const onSubmit = async (data) => {
  console.log('Submitting invoice...', data);

  // 1️⃣ Increment Realtime DB sequence number
  const lastNumberRef = ref(rtdb, 'lastBookingNumber');
  let newBookingNumber;
  await runTransaction(lastNumberRef, (currentValue) => {
    newBookingNumber = (currentValue || 0) + 1;
    console.log(`Booking Number ${newBookingNumber} reserved!`);
    return newBookingNumber;  // Updates the Realtime DB
  });

  // 2️⃣ Format the bookingId
  const formattedBookingId = `BK-${newBookingNumber.toString().padStart(5, '0')}`;

  // 3️⃣ Update the bookingId in form data
  data.bookingId = formattedBookingId;
  
  // 🔥 increment code for selected items
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    if (item.name) {  // make sure item is selected
      const prefix = item.name.substring(0, 2).toUpperCase();
      const itemCodeRef = ref(rtdb, `itemSequences/${prefix}`);
      await runTransaction(itemCodeRef, (currentValue) => {
        return (currentValue || 0) + 1;
      });
      console.log(`Incremented code for prefix ${prefix}`);
      // 👉 do NOT change data.items[i].code → keep same as fetched earlier
    }
  }

  // 4️⃣ Save invoice to Firestore using formattedBookingId as document ID
  try {
    await setDoc(doc(db, 'invoices', formattedBookingId), {
      ...data,
      createdAt: new Date(),
    });
    setSnackbarMessage(`Booking ${data.bookingId.toUpperCase()} added successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    reset();
     setTimeout(() => {
        navigate("/bookings");
      }, 1500); 
    
  } catch (err) {
    console.error('Error saving invoice:', err);
    alert('Failed to save invoice');
  }
};



  return (
    <div className="container mx-auto p-4 space-y-6 bg-white w-[75vw] rounded-xl" style={{padding:'14px'}}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill To, Ship From, Ship To Sections */}
        <div className='flex justify-end'>  <Link to="/bookings" className="bg-red-500 text-white p-2">
          <button><CloseIcon /></button>
        </Link></div>
        <h2 className="text-xl font-bold">Customer Details</h2>
        <div >
          {/* Bill To */}
          <div className="grid grid-cols-3 gap-3 border border-gray-300 shadow-md rounded-xl" style={{padding:'10px'}}>
            
            <div className='flex flex-col'>
              <label>Customer Name &nbsp;</label>
              <select className='border rounded-md' style={{padding:'14px 8px'}} {...register('customerdtls.name',{required:true})} onChange={(e) => handleVendorSelection(e.target.value, 'customerdtls') }>
                <option value="" defaultChecked disabled>Select Customer</option>
                {customers.map((party) => (
                  <option key={party.id} value={party.name}>{party.name}</option>
                ))}
              </select>
              {errors.customerdtls?.name && (
    <span className="text-red-500 text-xs">Customer is required</span>
  )}
            </div>
            <div>
              <label>Address</label>
              <input {...register("customerdtls.address")} readOnly />
            </div>
            <div>
              <label>PIN Code</label>
              <input {...register("customerdtls.stateCode")} readOnly />
            </div>
            <div>
              <label>City</label>
              <input {...register("customerdtls.city")} readOnly />
            </div>
            <div>
              <label>GSTIN</label>
              <input {...register("customerdtls.gstin")} readOnly />
            </div>
            <div>
              <label>Email</label>
              <input {...register("customerdtls.email")} readOnly />
            </div>
            <div>
              <label>Phone</label>
              <input {...register("customerdtls.phone")} readOnly />
            </div>
          </div>
         


         
        </div>
         {/* Invoice Details */}
              

         <h2 className="text-xl font-bold mt-4" style={{marginTop:'10px'}}>Booking Details</h2>    
         <div className="grid grid-cols-3 gap-3 border border-gray-300 shadow-md rounded-xl" style={{padding:'10px'}}>
          
          <div>
             <label>Booking ID</label>
            <input {...register("bookingId")}  readOnly/>
           </div>
          <div>
             <label>Booking Date</label>
             <input {...register("invoiceDate")} type="date" />
          </div>
          <div>
             <label>Starting Date</label>
             <input {...register("startdate")} type="date" />
          </div>
          <div>
             <label>Ending Date</label>
             <input {...register("enddate")} type="date" />
          </div>
          <div>
             <label>Advance Payment</label>
             <input {...register("adv")} type='number' />
          </div>
          <div>
             <label>Package Name</label>
             <input {...register("pkgName")}  />
          </div>
          <div>
             <label>Package Price</label>
             <input {...register("pkgPrice")} type='number' />
          </div>
          <div>
             <label>Discount</label>
             <input {...register("discount")} type='number' />
          </div>
          <div>
             <label>Total Amount</label>
             <input {...register("toPay")} type='number' />
          </div>
         
          
         </div>


        
        {/* Items Table */}
        <h2 className="text-xl font-bold mt-4" style={{marginTop:'10px'}}>Item Details</h2>
        <div className='border rounded-xl border-gray-300 shadow-md' style={{padding:'10px',overflow:'hidden'}}>
         <div className='w-[full] flex justify-between items-center h-16'>
          <button type="button" onClick={() => append({})} className="mb-4 bg-blue-500 text-white px-3 py-1 rounded" style={{padding:'4px',marginBottom:'5px'}}>Add Row</button>
           <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
    Add Item
  </Button>
          </div>
          


<div className="w-[70vw] overflow-hidden">
  <div className="overflow-x-auto shadow-md custom-scrollbar w-full">
    <div className="min-w-[1600px] inline-block align-middle">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="w-[80px] p-2 border whitespace-nowrap">S.No.</th>
            
            <th className="p-2 border whitespace-nowrap">Item Name</th>
            <th className="p-2 border whitespace-nowrap">Item Code</th>
            <th className="p-2 border whitespace-nowrap">Item/Service Description</th>
            <th className="p-2 border whitespace-nowrap">HSN/SAC</th>
            <th className="p-2 border whitespace-nowrap">Quantity</th>
            <th className="p-2 border whitespace-nowrap">UOM</th>
            <th className="p-2 border whitespace-nowrap">Basic Value</th>
            <th className="p-2 border whitespace-nowrap">Discount</th>
            <th className="p-2 border whitespace-nowrap">Taxable Value</th>
            <th className="p-2 border whitespace-nowrap">GST Rate (%)</th>
            <th className="p-2 border whitespace-nowrap">IGST</th>
            <th className="p-2 border whitespace-nowrap">CGST</th>
            <th className="p-2 border whitespace-nowrap">SGST</th>
            <th className="p-2 border whitespace-nowrap">Cess</th>
            <th className="p-2 border whitespace-nowrap">Total</th>
            <th className="p-2 border whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            const { onChange, ...rest } = register(`items.${index}.name`);
            return (
              <tr key={field.id}>
                <td className="p-2 border whitespace-nowrap">{index + 1}</td>
                <td className="p-2 border whitespace-nowrap">
                  <select
                    {...rest}
                    className="w-full p-1 border rounded"
                    onChange={(e) => {
                      onChange(e);
                      autofillItemDetails(index, e.target.value);
                    }}
                  >
                    <option value="">Select Item</option>
                    {stockItems.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </td>
                {/* The rest of your <td> cells remain unchanged */}
                  <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.code`)}
                className="w-full p-1 border rounded"
                placeholder="Item Code"
              />
            </td>
                <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.description`)}
                className="w-full p-1 border rounded"
                placeholder="Description"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.hsnSac`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                type="number"
                className="w-full p-1 border rounded"
                onInput={(e) => handleInputQuantity(e, index)}
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.uom`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.basicValue`, { valueAsNumber: true })}
                type="number"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.itemdiscount`, { valueAsNumber: true })}
                type="number"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.taxableValue`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.gstRate`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.igst`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.cgst`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.sgst`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.cess`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${index}.total`)}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap text-center">
              <button
                type="button"
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </td>
            
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>



</div>

        </div>
        

  <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      maxHeight: '80vh',
      bgcolor: 'background.paper',
      borderRadius: 4,
      boxShadow: 24,
      p: 4,
      overflowY: 'auto', // 👈 make content scrollable if needed
    }}>
      <Typography variant="h6" gutterBottom>Add New Item</Typography>
      <form onSubmit={addItemSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          <TextField label="Item Name" name="name" value={formValues.name} onChange={handleChange} required />
          <TextField label="Description" name="description" value={formValues.description} onChange={handleChange} />
          <TextField label="HSN/SAC" name="hsnSac" value={formValues.hsnSac} onChange={handleChange} />
          <TextField label="Quantity" name="quantity" type="number" value={formValues.quantity} onChange={handleChange} />
          <TextField label="Max Quantity" name="maxQuantity" type="number" value={formValues.maxQuantity} onChange={handleChange} />
          <TextField label="UOM" name="uom" value={formValues.uom} onChange={handleChange} />
          <TextField label="Basic Value" name="basicValue" type="number" value={formValues.basicValue} onChange={handleChange} />
          <TextField label="Discount" name="itemdiscount" type="number" value={formValues.itemdiscount} onChange={handleChange} />
          <TextField label="Taxable Value" name="taxableValue" type="number" value={formValues.taxableValue} onChange={handleChange} />
          <TextField label="GST Rate (%)" name="gstRate" type="number" value={formValues.gstRate} onChange={handleChange} />
          <TextField label="IGST" name="igst" type="number" value={formValues.igst} onChange={handleChange} />
          <TextField label="CGST" name="cgst" type="number" value={formValues.cgst} onChange={handleChange} />
          <TextField label="SGST" name="sgst" type="number" value={formValues.sgst} onChange={handleChange} />
          <TextField label="Cess" name="cess" type="number" value={formValues.cess} onChange={handleChange} />
          <TextField label="Total" name="total" type="number" value={formValues.total} onChange={handleChange} />
        </Box>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button variant="contained" color="primary" type="submit">Add Item</Button>
        </Box>
      </form>
    </Box>
  </Modal>


        {/* Submit Button */}
        <div className='h-20 flex items-center justify-end'>
          <button type="submit" style={{padding:'8px',backgroundColor:'#005899',color:'white',}} className='rounded-lg hover:bg-[#2e7bbf]'>Save Booking Invoice</button>
        </div>
      </form>
        <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%', }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default InvoiceForm;
