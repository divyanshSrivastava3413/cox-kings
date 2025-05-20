import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import HomePg from './Components/Dashboard/HomePg.jsx'
import { element } from 'prop-types'
import { Test } from './Components/Test.jsx'
import CustomerForm from './Components/CustomerForm.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerTable } from './Components/CustomerTable.jsx'
import VendorForm from './Components/VendorForm.jsx'

import InvoiceForm from './Components/SalesForm.jsx'
import PaymentRecon from './Components/PaymentRecon.jsx'
import { BookingInvoices } from './Components/BookingInvoices.jsx'
import { VendorTable } from './Components/VendorTable.jsx'
import PaymentAdvisoryForm from './Components/PaymentAdvisoryForm.jsx'
import InvoicePaymentsForm from './Components/InvoicePaymentsForm.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<HomePg/>

      },
      {path:'test',
      element:<Test/>},
      {
        path:'OnboardingCustomer',
        element:<CustomerTable/>
      },
      {
        path:'OnboardingVendor',
        element:<VendorTable/>
      },
      {
        path:'New-customer',
        element:<CustomerForm/>
      },
      {
        path:'Vendor',
        element:<VendorForm/>
      },
      {
        path:'sales',
        element:<InvoiceForm/>
      },
      {
        path:'paymentreconcilation',
        element:<PaymentRecon/>
      },
      {
        path:'bookings',
        element:<BookingInvoices/>
      },{
        path:'paymentadvisory',
        element:<PaymentAdvisoryForm/>
      },
      {
        path:'invoicepayments',
        element:<InvoicePaymentsForm/>
      }
    ]
  }
])
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
    </QueryClientProvider>
  </StrictMode>,
)
