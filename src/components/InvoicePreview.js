import React from 'react';

const InvoicePreview = ({ invoice, onDelete, setActiveTab, isAdmin, onUpdateStatus }) => {
  const handlePrint = () => {
    window.print();
  };

  const isRequest = invoice.status === 'Request' || invoice.status === 'Inquiry';
  const headerTitle = isRequest ? 'SERVICE REQUEST' : 'TAX INVOICE';
  const whatsappHeader = isRequest ? 'SERVICE REQUEST' : 'INVOICE';

  const itemsList = invoice.items.map(item => `• ${item.name}: ${item.quantity} x ₹${item.rate} = ₹${item.amount}`).join('\n');
  const whatsappMessage = `*SURNAME ELECTRICIANS - ${whatsappHeader}*\n--------------------------------\n*Customer:* ${invoice.customerName}\n*Date:* ${invoice.date}\n--------------------------------\n*Items:*\n${itemsList}\n--------------------------------\n*Subtotal:* ₹${invoice.subtotal}\n*Discount:* -₹${invoice.discount}\n*Grand Total: ₹${invoice.finalTotal}*\n--------------------------------\n${isRequest ? 'Please confirm this service request.' : 'Thank you for your business!'}`;

  const customerWhatsappUrl = `https://wa.me/91${invoice.customerPhone}?text=${encodeURIComponent(whatsappMessage)}`;
  const adminWhatsappUrl = `https://wa.me/917498045041?text=${encodeURIComponent(`*SHOP OWNER COPY - ${whatsappHeader} #${invoice.id}*\n\n` + whatsappMessage)}`;

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-2xl invoice-container relative">
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isRequest ? 'text-blue-600' : 'text-yellow-600'}`}>{headerTitle}</h1>
          <p className="text-sm text-gray-500">#{invoice.id}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-xl uppercase tracking-tighter">Surname Electricians</h2>
          <p className="text-sm">Professional Electrical Solutions</p>
          <p className="text-sm">Nashik, Maharashtra</p>
          <p className="text-sm">Service Support: 7498045041</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-gray-700 uppercase text-xs mb-2 tracking-widest">Bill To:</h3>
          <p className="font-bold text-lg">{invoice.customerName}</p>
          <p className="text-gray-600">{invoice.customerPhone}</p>
          <p className="text-sm text-gray-600 mt-1">{invoice.customerAddress}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-gray-700 uppercase text-xs mb-2 tracking-widest">Date:</h3>
          <p className="text-lg">{invoice.date}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-yellow-500">
              <th className="py-3 px-4 text-left font-bold uppercase text-sm">Item Description</th>
              <th className="py-3 px-4 text-right font-bold uppercase text-sm">Qty</th>
              <th className="py-3 px-4 text-right font-bold uppercase text-sm">Rate</th>
              <th className="py-3 px-4 text-right font-bold uppercase text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium">{item.name}</td>
                <td className="py-4 px-4 text-right">{item.quantity}</td>
                <td className="py-4 px-4 text-right">₹{item.rate}</td>
                <td className="py-4 px-4 text-right font-bold">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2 text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{invoice.subtotal}</span>
          </div>
          <div className="flex justify-between py-2 text-red-600 italic">
            <span>Discount:</span>
            <span>- ₹{invoice.discount}</span>
          </div>
          <div className="flex justify-between py-4 border-t-2 border-gray-100 mt-2">
            <span className="text-xl font-bold">Total Amount:</span>
            <span className="text-2xl font-black text-yellow-700">₹{invoice.finalTotal}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-gray-100 pt-10">
        <div className="text-center md:text-left flex-1">
          <div className="inline-block border-2 border-gray-100 p-4 rounded-2xl mb-4">
             <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Payment Methods</p>
             <p className="text-sm font-bold">GPay / PhonePe / Paytm</p>
             <p className="text-lg font-black text-yellow-600">7498045041</p>
          </div>
          <p className="text-xs text-gray-400 italic">"Quality work is our signature."</p>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
            {isRequest ? 'Thank you for your request!' : 'Thank you for choosing Surname Electricians!'}
          </p>
        </div>

        {!isRequest && (
          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Scan & Pay Now</p>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=7498045041@ybl&pn=Surname%20Electricians&am=${invoice.finalTotal}&cu=INR`)}`}
                alt="Payment QR"
                className="w-32 h-32"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-bold text-gray-500">Amount Payable</p>
              <p className="text-xl font-black text-yellow-700">₹{invoice.finalTotal}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] text-gray-500 text-center leading-relaxed italic">
        <span className="font-bold text-red-500 uppercase mr-1">Warning:</span>
        This website and admin are not responsible for the bill. You did not add your number here for the bill,
        the message is sent directly to your WhatsApp number for your records.
      </div>

      <div className="mt-10 pt-6 border-t border-dashed flex flex-wrap gap-4 no-print justify-center items-center">
        <button
          onClick={handlePrint}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg flex-1 md:flex-none"
        >
          {isRequest ? 'Print Request' : 'Print Invoice'}
        </button>
        <a
          href={customerWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            onUpdateStatus(invoice.id, 'Paid');
            setActiveTab('history');
          }}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2 flex-1 md:flex-none"
        >
          {isAdmin ? 'Send to Customer' : 'Send to My WhatsApp'}
        </a>
        <a
          href={adminWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            onUpdateStatus(invoice.id, 'Paid');
            setActiveTab('history');
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 flex-1 md:flex-none"
        >
          {isAdmin ? 'Send to My WhatsApp' : 'Send to Shop Owner'}
        </a>
      </div>

      {(isAdmin || invoice.status === 'Paid') && (
        <div className="mt-8 text-center no-print">
          <button
            onClick={() => {
              if(window.confirm('Are you sure you want to delete and discard this generated bill?')) {
                onDelete(invoice.id);
                setActiveTab('history');
              }
            }}
            className="text-red-500 hover:text-red-700 text-xs font-black uppercase tracking-widest transition-all"
          >
            Delete & Discard This Record
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
