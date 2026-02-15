import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Share2, ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';

const PrintableBill = ({ bill, onBack }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const shareOnWhatsApp = () => {
    const text = `*Zing Zaika *\nBill No: ${bill.billNumber}\nTotal: ₹${bill.grandTotal}\nThank you for dining with us!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return Number(amount).toFixed(2);
  };

  // Calculations
  const subTotal = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = bill.discount || 0;
  const taxableAmount = subTotal - discount;
  const cgst = taxableAmount * 0.025;
  const sgst = taxableAmount * 0.025;
  const totalWithTax = taxableAmount + cgst + sgst;
  const roundOff = bill.grandTotal - totalWithTax;
  const totalQty = bill.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-dark font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-sans"
        >
          <ArrowLeft size={20} />
          New Bill
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-all shadow-md font-sans"
          >
            <Printer size={20} />
            Print Bill
          </button>
          <button 
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all shadow-md font-sans"
          >
            <MessageSquare size={20} />
            Share WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 font-sans">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-center text-gray-900 mb-1">Order Confirmed!</h2>
        <p className="text-gray-500 text-center mb-8">Bill #{bill.billNumber} has been generated</p>

        {/* Paper Receipt Simulation */}
        <div 
          ref={componentRef} 
          className="bg-white p-4 text-black font-mono text-xs leading-tight"
          style={{ width: '100%', maxWidth: '80mm', margin: '0 auto' }}
        >
          <div className="text-center mb-4">
            <h1 className="text-base font-bold uppercase mb-1"> Zing Zaika</h1>
            <p>Near Ashirwad Hotel, Ganesh Cinema Road, Sitamarhi</p>
            <p className="mt-1">Contact No.: 7903815234</p>
          </div>

          <div className="mb-4">
            <p className="font-bold border-b border-black pb-1 mb-2">Customer Details</p>
            <p>Name: ______________________</p>
          </div>

          <div className="mb-4">
            <p className="font-bold border-b border-black pb-1 mb-2">Bill Details</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
               <div className="flex justify-between">
                 <span>Date</span>
                 <span>{new Date(bill.createdAt).toLocaleDateString('en-GB')}</span>
               </div>
               <div className="flex justify-between">
                 <span>Time</span>
                 <span>{new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
               </div>
               <div className="flex justify-between">
                 <span>Order Type</span>
                 <span>{bill.orderType === 'Takeaway' ? 'Pick Up' : bill.orderType}</span>
               </div>
               <div className="flex justify-between">
                  <span>Bill No.</span>
                  <span>{bill.billNumber}</span>
               </div>
               <div className="flex justify-between col-span-2">
                  <span>Cashier</span>
                  <span>biller</span>
               </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-bold border-b border-black pb-1 mb-2">Order Summary</p>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black border-dashed">
                  <th className="py-1 w-1/2">Item Name</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price (₹)</th>
                  <th className="py-1 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, idx) => (
                  <tr key={idx} className="">
                    <td className="py-1 pr-1">{item.name}</td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <p className="font-bold border-b border-black pb-1 mb-2">Billing Summary</p>
            <div className="space-y-1">
               <div className="flex justify-between border-b border-dashed border-gray-400 pb-1">
                 <span>Description</span>
                 <span>Amount (₹)</span>
               </div>
              <div className="flex justify-between pt-1">
                <span>Total Quantity</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount (Fixed)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CGST 2.5%</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST 2.5%</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
               <div className="flex justify-between">
                <span>Round Off</span>
                <span>{roundOff >= 0 ? '+' : ''}{formatCurrency(roundOff)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-black border-dashed pt-1 mt-1">
                <span>Grand Total:</span>
                <span>₹{formatCurrency(bill.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="text-center border-t-2 border-dashed border-black pt-2">
            <p className="font-bold mb-1">Paid: {bill.paymentMode}</p>
            <p className="font-bold">Thank You & Visit Again</p>
             <p className="text-[10px] mt-1">😊</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableBill;
