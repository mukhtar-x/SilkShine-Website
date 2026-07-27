import React, { useState, useEffect } from 'react';
import { Printer, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    taxPercent: number;
}

const InvoiceGenerator: React.FC = () => {
    const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerContact, setCustomerContact] = useState('');

    const [items, setItems] = useState<LineItem[]>([
        { id: '1', description: 'SilkShine Premium Grade Oil (200L Drum)', quantity: 1, rate: 82000, taxPercent: 18 },
    ]);

    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [totals, setTotals] = useState({ subtotal: 0, taxAmount: 0, grandTotal: 0 });

    useEffect(() => {
        let subtotal = 0;
        let taxAmount = 0;

        items.forEach(item => {
            const lineAmount = item.quantity * item.rate;
            const lineTax = lineAmount * (item.taxPercent / 100);
            subtotal += lineAmount;
            taxAmount += lineTax;
        });

        const grandTotal = subtotal + taxAmount + deliveryCharge - discount;
        setTotals({ subtotal, taxAmount, grandTotal });
    }, [items, deliveryCharge, discount]);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, taxPercent: 18 }]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 print:space-y-0 print:m-0 print:max-w-none">
            {/* Action Bar - Hidden in print */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 print-hidden">
                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-950">Invoice Generator</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={handlePrint} className="bg-amber-500 text-navy-950 px-5 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors flex items-center gap-2">
                        <Printer className="w-5 h-5" />
                        <span>Print / Save PDF</span>
                    </button>
                </div>
            </div>

            {/* A4 Invoice Container */}
            <div className="bg-white p-8 md:p-12 shadow-xl border border-gray-100 print:shadow-none print:border-none print:p-0">
                
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-navy-900 pb-6 mb-6">
                    <div>
                        <h2 className="text-4xl font-bold text-navy-950 tracking-tight font-urdu">Silkshine</h2>
                        <div className="text-gray-600 mt-2 text-sm space-y-1">
                            <p>123 Industrial Estate, Phase II</p>
                            <p>Lahore, Pakistan 54000</p>
                            <p>Phone: +92 300 1234567</p>
                            <p className="font-semibold text-navy-800">NTN: 1234567-8</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-400 uppercase tracking-widest mb-2">Invoice</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-left">
                            <label className="text-gray-500 font-semibold text-right">Invoice No:</label>
                            <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="font-bold text-navy-900 focus:outline-none print:border-none" />
                            
                            <label className="text-gray-500 font-semibold text-right">Date:</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="text-navy-900 focus:outline-none print:appearance-none print:border-none" />
                            
                            <label className="text-gray-500 font-semibold text-right">Due Date:</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="text-navy-900 focus:outline-none print:appearance-none print:border-none" />
                        </div>
                    </div>
                </div>

                {/* Bill To & Payment Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To</h3>
                        <div className="space-y-2">
                            <input type="text" placeholder="Customer / Company Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full font-bold text-lg text-navy-950 placeholder-gray-300 focus:outline-none focus:border-b focus:border-amber-500 transition-colors print:border-none" />
                            <textarea placeholder="Delivery Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full text-gray-700 resize-none h-16 placeholder-gray-300 focus:outline-none focus:border-b focus:border-amber-500 transition-colors print:border-none print:resize-none" />
                            <input type="text" placeholder="Contact Number" value={customerContact} onChange={e => setCustomerContact(e.target.value)} className="w-full text-gray-700 placeholder-gray-300 focus:outline-none focus:border-b focus:border-amber-500 transition-colors print:border-none" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-24">Method:</span>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="text-navy-900 font-medium focus:outline-none print:appearance-none">
                                    <option>Cash on Delivery</option>
                                    <option>Bank Transfer</option>
                                    <option>Cheque</option>
                                    <option>Online Payment</option>
                                </select>
                            </div>
                            {paymentMethod === 'Bank Transfer' && (
                                <div className="p-3 bg-gray-50 rounded border border-gray-100 print:border-none print:p-0">
                                    <p className="text-gray-600">Bank: HBL Pakistan</p>
                                    <p className="text-gray-600">A/C Title: Silkshine Pvt Ltd</p>
                                    <p className="text-gray-600 font-medium">IBAN: PK23 HABB 0000 1234 5678</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-navy-900 text-white text-sm">
                                <th className="p-3 font-semibold w-[40%]">Item Description</th>
                                <th className="p-3 font-semibold text-center w-[15%]">Qty</th>
                                <th className="p-3 font-semibold text-right w-[15%]">Rate (Rs.)</th>
                                <th className="p-3 font-semibold text-center w-[10%]">Tax %</th>
                                <th className="p-3 font-semibold text-right w-[15%]">Amount (Rs.)</th>
                                <th className="p-3 print-hidden w-[5%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-gray-50 transition-colors print:hover:bg-white">
                                    <td className="p-3">
                                        <input type="text" placeholder="Product name/description" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full text-navy-950 font-medium bg-transparent focus:outline-none" />
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="1" value={item.quantity || ''} onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} className="w-full text-center text-gray-700 bg-transparent focus:outline-none" />
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="0" value={item.rate || ''} onChange={e => handleItemChange(item.id, 'rate', Number(e.target.value))} className="w-full text-right text-gray-700 bg-transparent focus:outline-none" />
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="0" max="100" value={item.taxPercent || ''} onChange={e => handleItemChange(item.id, 'taxPercent', Number(e.target.value))} className="w-full text-center text-gray-700 bg-transparent focus:outline-none" />
                                    </td>
                                    <td className="p-3 text-right font-medium text-navy-950">
                                        {((item.quantity || 0) * (item.rate || 0)).toLocaleString()}
                                    </td>
                                    <td className="p-3 print-hidden">
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleAddItem} className="mt-3 text-amber-600 text-sm font-semibold flex items-center gap-1 hover:text-amber-700 print-hidden">
                        <Plus className="w-4 h-4" /> Add Line Item
                    </button>
                </div>

                {/* Totals Calculation */}
                <div className="flex flex-col md:flex-row justify-between items-start border-t-2 border-gray-100 pt-6">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 pr-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Terms & Conditions</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            1. Payment is due within the stipulated time.<br/>
                            2. Goods once sold will not be returned.<br/>
                            3. Please make cheques payable to "Silkshine Pvt Ltd".
                        </p>
                    </div>
                    <div className="w-full md:w-[40%] space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-medium text-navy-950">Rs. {totals.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax Amount:</span>
                            <span className="font-medium text-navy-950">Rs. {totals.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Delivery/Freight:</span>
                            <div className="flex items-center gap-1">
                                <span>Rs.</span>
                                <input type="number" min="0" value={deliveryCharge || ''} onChange={e => setDeliveryCharge(Number(e.target.value))} className="w-24 text-right font-medium text-navy-950 bg-gray-50 p-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 print:bg-transparent print:p-0" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Discount:</span>
                            <div className="flex items-center gap-1">
                                <span>- Rs.</span>
                                <input type="number" min="0" value={discount || ''} onChange={e => setDiscount(Number(e.target.value))} className="w-24 text-right font-medium text-red-600 bg-gray-50 p-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 print:bg-transparent print:p-0" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t-2 border-navy-900 pt-3 mt-3">
                            <span className="text-lg font-bold text-navy-950">Grand Total:</span>
                            <span className="text-2xl font-bold text-amber-600">Rs. {totals.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center text-sm text-gray-400 print-only">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">Generated by Silkshine Invoice System</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
