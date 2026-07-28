import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.jpeg";

interface LineItem {
    id: string;
    description: string;
    subDescription?: string;
    quantity: number;
    rate: number;
}

const InvoiceGenerator: React.FC = () => {
    const [invoiceNo, setInvoiceNo] = useState('TV-2026-089');
    const [date, setDate] = useState('July 28, 2026');
    const [dueDate, setDueDate] = useState('August 28, 2026');
    
    // Seller Details (SilkShine Actual Data)
    const [sellerName] = useState('SilkShine');
    const [sellerLegalName] = useState('SilkShine Pvt Ltd');
    const [sellerAddress] = useState('123 Industrial Estate, Phase II, Lahore, Pakistan 54000');
    const [sellerPhone] = useState('+92 300 1234567');
    const [sellerNtn] = useState('1234567-8 / 17-00-9821-3');
    const [sellerEmail] = useState('billing@silkshine.pk');

    // Buyer Details
    const [buyerName, setBuyerName] = useState('Al-Habib Enterprises');
    const [buyerAttn, setBuyerAttn] = useState('Muhammad Ali (Procurement Manager)');
    const [buyerAddress, setBuyerAddress] = useState('Suite 12, Bahadurabad Chowrangi, Karachi, Sindh, Pakistan');
    const [buyerPhone, setBuyerPhone] = useState('+92 21 34938210');
    const [buyerNtn, setBuyerNtn] = useState('8765432-1');

    const [items, setItems] = useState<LineItem[]>([
        { 
            id: '1', 
            description: 'SilkShine Premium Grade Oil (200L Drum)', 
            subDescription: 'High-performance industrial grade lubricant drum with anti-rust formulation.', 
            quantity: 1, 
            rate: 350000 
        },
        { 
            id: '2', 
            description: 'Industrial Lubrication Setup & Testing', 
            subDescription: 'On-site viscosity check, machinery compatibility audit, and safety assessment.', 
            quantity: 1, 
            rate: 85000 
        },
        { 
            id: '3', 
            description: 'Staff Maintenance Workshop', 
            subDescription: 'On-site corporate workshop conducted at buyer premises.', 
            quantity: 2, 
            rate: 25000 
        },
    ]);

    const [deliveryCharge, setDeliveryCharge] = useState(3500);
    const [taxRate, setTaxRate] = useState(15); // GST 15%

    const [totals, setTotals] = useState({ subtotal: 0, taxAmount: 0, grandTotal: 0 });

    useEffect(() => {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += (item.quantity || 0) * (item.rate || 0);
        });

        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount + deliveryCharge;
        setTotals({ subtotal, taxAmount, grandTotal });
    }, [items, deliveryCharge, taxRate]);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', subDescription: '', quantity: 1, rate: 0 }]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 print:space-y-0 print:m-0 print:max-w-none px-0 sm:px-4 md:px-0">
            {/* Top Navigation Bar - Hidden on Print */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden">
                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Invoice Generator</h1>
                        <p className="text-xs text-gray-500">Exact A4 flex-spaced layout with SilkShine corporate branding.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => window.print()} className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                        <Download className="w-4 h-4" />
                        <span>Export / Print PDF</span>
                    </button>
                </div>
            </div>

            {/* Print-Optimized Container mirroring exact HTML .page-wrapper with flex balance */}
            <div className="bg-white p-4 sm:p-8 md:p-12 shadow-md rounded-2xl border border-gray-100 text-[9.5pt] text-[#222222] font-sans print:shadow-none print:border-none print:p-0 print:m-0 flex flex-col justify-between min-h-[257mm] overflow-x-hidden">
                <div>
                    {/* Top Header */}
                    <div className="w-full mb-[25px] pb-[18px] border-b border-[#e0e0e0]">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="flex sm:table-row">
                                    <td className="w-full sm:w-1/2 align-top p-0 mb-4 sm:mb-0">
                                        <div className="text-[20pt] sm:text-[28pt] font-light tracking-[2px] text-[#111111] uppercase mb-[10px]">Invoice</div>
                                        <div className="text-[9pt] text-[#444444] leading-[1.6] space-y-0.5">
                                            <div><strong className="text-[#111111]">Invoice No:</strong> <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="font-semibold text-[#111111] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-32 print:border-none print:p-0" /></div>
                                            <div><strong className="text-[#111111]">Date:</strong> <input type="text" value={date} onChange={e => setDate(e.target.value)} className="text-[#111111] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-36 print:border-none print:p-0" /></div>
                                            <div><strong className="text-[#111111]">Due Date:</strong> <input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} className="text-[#111111] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-36 print:border-none print:p-0" /></div>
                                        </div>
                                    </td>
                                    <td className="w-full sm:w-1/2 align-top text-left sm:text-right p-0">
                                        {/* Actual SilkShine Logo */}
                                        <div className="inline-flex items-center justify-center bg-[#111111] text-white mb-[15px] sm:mb-[20px]">
                                            <img src={logo} alt="SilkShine Logo" className="h-[70px] sm:h-[120px] w-[70px] sm:w-[120px]" />
                                        </div>
                                        <div className="text-[12pt] font-bold text-[#111111] mb-[3px]">{sellerName}</div>
                                        <div className="text-[8.5pt] text-[#555555] leading-[1.4]">
                                            {sellerAddress}<br/>
                                            Tel: {sellerPhone} | {sellerEmail}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Participants Section: Seller & Buyer Details */}
                    <table className="w-full border-collapse mb-[50px] sm:mb-[90px]">
                        <tbody>
                            <tr className="flex flex-col sm:table-row">
                                <td className="w-full sm:w-1/2 align-top pr-0 sm:pr-[25px] p-0 mb-6 sm:mb-0">
                                    <div className="text-[9pt] font-bold text-[#111111] uppercase tracking-[0.5px] border-b border-[#111111] pb-[4px] mb-[8px]">Issued By (Seller)</div>
                                    <div className="text-[9pt] text-[#444444] leading-[1.5] m-0 space-y-0.5">
                                        <strong className="text-[#111111]">{sellerLegalName}</strong><br/>
                                        {sellerAddress}<br/>
                                        Phone: {sellerPhone}<br/>
                                        NTN / STRN: {sellerNtn}
                                    </div>
                                </td>
                                <td className="w-full sm:w-1/2 align-top pl-0 sm:pl-[25px] p-0">
                                    <div className="text-[9pt] font-bold text-[#111111] uppercase tracking-[0.5px] border-b border-[#111111] pb-[4px] mb-[8px]">Billed To (Buyer)</div>
                                    <div className="text-[9pt] text-[#444444] leading-[1.5] m-0 space-y-1">
                                        <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="w-full font-bold text-[#111111] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none print:border-none print:p-0" placeholder="Buyer Company Name" />
                                        <input type="text" value={buyerAttn} onChange={e => setBuyerAttn(e.target.value)} className="w-full text-[#444444] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none print:border-none print:p-0" placeholder="Attn: Person" />
                                        <input type="text" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} className="w-full text-[#444444] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none print:border-none print:p-0" placeholder="Address" />
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input type="text" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} className="w-full sm:w-1/2 text-[#444444] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none print:border-none print:p-0" placeholder="Phone" />
                                            <input type="text" value={buyerNtn} onChange={e => setBuyerNtn(e.target.value)} className="w-full sm:w-1/2 text-[#444444] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none print:border-none print:p-0" placeholder="NTN" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Items Table - Responsive scroll wrapper */}
                    <div className="overflow-x-auto w-full mb-[30px]">
                        <table className="w-full border-collapse min-w-[600px] sm:min-w-full">
                            <thead>
                                <tr>
                                    <th className="border-t border-b border-[#111111] text-[#111111] font-bold text-left py-[10px] px-[8px] text-[9pt] uppercase tracking-[0.5px] bg-[#fcfcfc] w-[8%]">Item</th>
                                    <th className="border-t border-b border-[#111111] text-[#111111] font-bold text-left py-[10px] px-[8px] text-[9pt] uppercase tracking-[0.5px] bg-[#fcfcfc] w-[44%]">Description</th>
                                    <th className="border-t border-b border-[#111111] text-[#111111] font-bold text-center py-[10px] px-[8px] text-[9pt] uppercase tracking-[0.5px] bg-[#fcfcfc] w-[10%]">Qty</th>
                                    <th className="border-t border-b border-[#111111] text-[#111111] font-bold text-right py-[10px] px-[8px] text-[9pt] uppercase tracking-[0.5px] bg-[#fcfcfc] w-[18%]">Price (PKR)</th>
                                    <th className="border-t border-b border-[#111111] text-[#111111] font-bold text-right py-[10px] px-[8px] text-[9pt] uppercase tracking-[0.5px] bg-[#fcfcfc] w-[20%]">Amount (PKR)</th>
                                    <th className="border-t border-b border-[#111111] bg-[#fcfcfc] w-[5%] print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 print:hover:bg-white">
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] font-medium text-[#111111] align-top">{index + 1}.</td>
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] text-[#333333] align-top space-y-1">
                                            <input 
                                                type="text" 
                                                value={item.description} 
                                                onChange={e => handleItemChange(item.id, 'description', e.target.value)} 
                                                className="w-full font-bold text-[#111111] bg-transparent border border-transparent hover:border-gray-200 focus:border-black p-1 rounded outline-none print:border-none print:p-0" 
                                                placeholder="Item Title"
                                            />
                                            <input 
                                                type="text" 
                                                value={item.subDescription || ''} 
                                                onChange={e => handleItemChange(item.id, 'subDescription', e.target.value)} 
                                                className="w-full text-[8pt] text-[#666666] bg-transparent border border-transparent hover:border-gray-200 focus:border-black p-1 rounded outline-none print:border-none print:p-0" 
                                                placeholder="Item description details..."
                                            />
                                        </td>
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] text-center align-top">
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={item.quantity || ''} 
                                                onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} 
                                                className="w-full text-center bg-transparent border border-transparent hover:border-gray-200 focus:border-black p-1 rounded outline-none print:border-none print:p-0" 
                                            />
                                        </td>
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] text-right align-top">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                value={item.rate || ''} 
                                                onChange={e => handleItemChange(item.id, 'rate', Number(e.target.value))} 
                                                className="w-full text-right bg-transparent border border-transparent hover:border-gray-200 focus:border-black p-1 rounded outline-none print:border-none print:p-0" 
                                            />
                                        </td>
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] text-right font-bold text-[#111111] align-top pt-4">
                                            {((item.quantity || 0) * (item.rate || 0)).toLocaleString()}
                                        </td>
                                        <td className="py-[14px] px-[8px] border-b border-dotted border-[#cccccc] text-center align-top print:hidden">
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={handleAddItem} className="text-black font-semibold mb-[30px] text-xs flex items-center gap-1 hover:underline pt-1 print:hidden">
                        <Plus className="w-4 h-4" /> Add Line Item
                    </button>

                    {/* Bottom Section: Bank Info & Totals */}
                    <table className="w-full border-collapse mb-[30px]">
                        <tbody>
                            <tr className="flex flex-col sm:table-row">
                                <td className="w-full sm:w-[55%] align-top p-0 mb-6 sm:mb-0">
                                    <div className="text-[9pt] text-[#444444] leading-[1.6] mr-0 sm:mr-[20px]">
                                        <strong className="text-[#111111]">Payment Terms & Bank Details:</strong><br/>
                                        Due within 30 days via Online IBFT or Crossed Cheque.<br/>
                                        <strong className="text-[#111111]">Bank Name:</strong> Meezan Bank Limited, Karachi<br/>
                                        <strong className="text-[#111111]">Account Title:</strong> {sellerLegalName}<br/>
                                        <strong className="text-[#111111]">Account No:</strong> PK36MEZN0001234567890123
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell w-[5%] p-0"></td>
                                <td className="w-full sm:w-[40%] align-top p-0">
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="text-right text-[#555555] py-[7px] px-[8px] text-[9pt]">Subtotal:</td>
                                                <td className="text-right font-bold text-[#111111] py-[7px] px-[8px] text-[9pt] w-[45%]">PKR {totals.subtotal.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-right text-[#555555] py-[7px] px-[8px] text-[9pt]">Delivery Charges:</td>
                                                <td className="text-right py-[7px] px-[8px] text-[9pt]">
                                                    <input 
                                                        type="number" 
                                                        min="0" 
                                                        value={deliveryCharge} 
                                                        onChange={e => setDeliveryCharge(Number(e.target.value))} 
                                                        className="w-24 text-right font-bold text-[#111111] bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded px-1 py-0.5 outline-none print:border-none print:bg-transparent print:p-0" 
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-right text-[#555555] py-[7px] px-[8px] text-[9pt]">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span>Tax (GST</span>
                                                        <input 
                                                            type="number" 
                                                            min="0" 
                                                            max="100" 
                                                            value={taxRate} 
                                                            onChange={e => setTaxRate(Number(e.target.value))} 
                                                            className="w-10 text-center font-medium bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded outline-none print:border-none print:bg-transparent print:p-0" 
                                                        />
                                                        <span>%):</span>
                                                    </div>
                                                </td>
                                                <td className="text-right font-bold text-[#111111] py-[7px] px-[8px] text-[9pt]">PKR {totals.taxAmount.toLocaleString()}</td>
                                            </tr>
                                            <tr className="border-t border-b border-[#111111]">
                                                <td className="text-right font-bold text-[11pt] text-[#111111] py-[10px] px-[8px]">Total:</td>
                                                <td className="text-right font-bold text-[11pt] text-[#111111] py-[10px] px-[8px]">PKR {totals.grandTotal.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Gratitude Section */}
                    <div className="text-center py-[18px] border-t border-b border-[#eeeeee] mb-[20px]">
                        <p className="text-[10pt] italic font-medium text-[#222222] m-0">Thank you for your valuable business. It is a pleasure serving you!</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[8pt] text-[#777777] mt-auto pt-4">
                    {sellerLegalName} &bull; {sellerAddress} &bull; www.silkshine.pk
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;