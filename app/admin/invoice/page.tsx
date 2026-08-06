'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Plus, Trash2, CreditCard, DollarSign } from 'lucide-react';

const InvoicePdfDocument = dynamic(
    () => import('../../../src/components/InvoicePdfDocument').then((mod) => mod.default),
    { ssr: false }
);

const InvoicePdfDownloadButton = dynamic(
    () => import('../../../src/components/InvoicePdfDownloadButton').then((mod) => mod.default),
    { ssr: false }
);

const logoPath = '/logo.jpeg';

type InvoiceMetadata = {
    sellerName: string;
    sellerLegalName: string;
    sellerAddress: string;
    sellerPhone: string;
    sellerNtn: string;
    sellerEmail: string;
    bankName: string;
    accountTitle: string;
    accountNo: string;
    paymentTerms: string;
};

type OrderItem = {
    name: string;
    quantity: number;
    size: string;
    price: number;
};

type OrderPayload = {
    _id?: string;
    orderId: string;
    customer: string;
    contact: string;
    address: string;
    city: string;
    items: OrderItem[];
    amount: string;
    totalAmount: number;
    method: 'COD' | 'Card';
};

type LineItem = {
    id: string;
    description: string;
    subDescription: string;
    quantity: number;
    rate: number;
};

type PrepareResponse = {
    metadata: { invoice: InvoiceMetadata };
    nextInvoiceNumber: string;
    order: OrderPayload | null;
};

export default function InvoiceGeneratorPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logoBase64, setLogoBase64] = useState<string>('');

    const [invoiceNo, setInvoiceNo] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [sellerName, setSellerName] = useState('');
    const [sellerLegalName, setSellerLegalName] = useState('');
    const [sellerAddress, setSellerAddress] = useState('');
    const [sellerPhone, setSellerPhone] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [sellerNtn, setSellerNtn] = useState('');

    const [buyerName, setBuyerName] = useState('');
    const [buyerAttn, setBuyerAttn] = useState('');
    const [buyerAddress, setBuyerAddress] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [buyerNtn, setBuyerNtn] = useState('');

    const [items, setItems] = useState<LineItem[]>([
        { id: '1', description: '', subDescription: '', quantity: 1, rate: 0 },
    ]);

    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [bankName, setBankName] = useState('');
    const [accountTitle, setAccountTitle] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');

    const [paymentType, setPaymentType] = useState<'Cash' | 'Card'>('Cash');
    const [cardTransactionId, setCardTransactionId] = useState('');
    const [cardAuthorizationCode, setCardAuthorizationCode] = useState('');
    const [sourceOrderId, setSourceOrderId] = useState<string | null>(null);

    const grossSubtotal = useMemo(
        () => items.filter(item => item.rate >= 0).reduce((total, item) => total + item.quantity * item.rate, 0),
        [items]
    );
    const discountTotal = useMemo(
        () => items.filter(item => item.rate < 0).reduce((total, item) => total + Math.abs(item.quantity * item.rate), 0),
        [items]
    );
    const netSubtotal = grossSubtotal - discountTotal;
    const taxAmount = useMemo(() => (netSubtotal * taxRate) / 100, [netSubtotal, taxRate]);
    const grandTotal = useMemo(() => netSubtotal + taxAmount + deliveryCharge, [netSubtotal, taxAmount, deliveryCharge]);

    // Pre-load local logo as Base64 to eliminate html2canvas async loading issues
    useEffect(() => {
        fetch('/logo.jpeg')
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        setLogoBase64(reader.result);
                    }
                };
                reader.readAsDataURL(blob);
            })
            .catch((err) => console.error('Failed to pre-load logo:', err));
    }, []);

    useEffect(() => {
        const today = new Date();
        const currentDate = today.toISOString().slice(0, 10);
        const due = new Date(today);
        due.setDate(due.getDate() + 30);
        setDate(currentDate);
        setDueDate(due.toISOString().slice(0, 10));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : '';
                const res = await fetch(`/api/admin/invoice/prepare${query}`);
                const payload = (await res.json()) as PrepareResponse | { error?: string };
                if (!res.ok) {
                    throw new Error((payload as any).error || 'Unable to load invoice data');
                }

                const data = payload as PrepareResponse;
                const invoiceData = data.metadata?.invoice;

                setInvoiceNo(data.nextInvoiceNumber ?? `SS-${new Date().getFullYear()}-001`);
                setSellerName(invoiceData?.sellerName ?? '');
                setSellerLegalName(invoiceData?.sellerLegalName ?? '');
                setSellerAddress(invoiceData?.sellerAddress ?? '');
                setSellerPhone(invoiceData?.sellerPhone ?? '');
                setSellerEmail(invoiceData?.sellerEmail ?? '');
                setSellerNtn(invoiceData?.sellerNtn ?? '');
                setBankName(invoiceData?.bankName ?? '');
                setAccountTitle(invoiceData?.accountTitle ?? '');
                setAccountNo(invoiceData?.accountNo ?? '');
                setPaymentTerms(invoiceData?.paymentTerms ?? '');

                if (data.order) {
                    setSourceOrderId(data.order.orderId);
                    setBuyerName(data.order.customer);
                    setBuyerAttn(data.order.contact);
                    setBuyerAddress([data.order.address, data.order.city].filter(Boolean).join(', '));
                    setBuyerPhone(data.order.contact);
                    setBuyerNtn('');
                    setPaymentType(data.order.method === 'Card' ? 'Card' : 'Cash');

                    // Calculate items raw total and compare with order totalAmount to factor in coupon discounts[cite: 3]
                    const rawItemsTotal = data.order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
                    const discountAmount = data.order.totalAmount < rawItemsTotal ? rawItemsTotal - data.order.totalAmount : 0;

                    const mappedItems: LineItem[] = data.order.items.length > 0
                        ? data.order.items.map((item, index) => ({
                            id: `${index + 1}`,
                            description: item.name,
                            subDescription: item.size || '',
                            quantity: item.quantity,
                            rate: item.price,
                        }))
                        : [{ id: '1', description: '', subDescription: '', quantity: 1, rate: 0 }];

                    if (discountAmount > 0) {
                        mappedItems.push({
                            id: `${mappedItems.length + 1}`,
                            description: 'Coupon / Discount Applied',
                            subDescription: '',
                            quantity: 1,
                            rate: -discountAmount,
                        });
                    }

                    setItems(mappedItems);
                    setDeliveryCharge(0);
                    setTaxRate(0);
                }

                // Pre-fill global delivery charge & tax rate from settings
                fetch('/api/settings')
                    .then(r => r.ok ? r.json() : null)
                    .then(s => {
                        if (s) {
                            if (s.deliveryCharge != null) setDeliveryCharge(Number(s.deliveryCharge));
                            if (s.taxRate != null) setTaxRate(Number(s.taxRate));
                        }
                    })
                    .catch(() => { });
            } catch (error) {
                console.error(error);
                setErrorMessage((error as Error).message || 'Failed to load invoice data');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [orderId]);

    const createItem = (): LineItem => ({
        id: Date.now().toString(),
        description: '',
        subDescription: '',
        quantity: 1,
        rate: 0,
    });

    const handleAddItem = () => setItems((prev) => [...prev, createItem()]);
    const handleRemoveItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
    function handleItemChange<K extends keyof LineItem>(id: string, field: K, value: LineItem[K]) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }

    const invoicePdfProps = {
        invoiceNo: invoiceNo || `SS-${new Date().getFullYear()}-001`,
        date,
        dueDate,
        sellerName,
        sellerLegalName,
        sellerAddress,
        sellerPhone,
        sellerEmail,
        sellerNtn,
        buyerName,
        buyerAttn,
        buyerAddress,
        buyerPhone,
        buyerNtn,
        items,
        deliveryCharge,
        taxRate,
        bankName,
        accountTitle,
        accountNo,
        paymentTerms,
        paymentType,
        cardTransactionId,
        cardAuthorizationCode,
        logoUrl: logoBase64 || logoPath,
    };

    const fileName = `Invoice-${invoiceNo.replace(/\s+/g, '_') || 'invoice'}.pdf`;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                                <ArrowLeft className="w-4 h-4" /> Back to dashboard
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Invoice Generator</h1>
                            <p className="text-sm text-slate-500 max-w-2xl">
                                Auto-populates from admin order data and central seller metadata, then exports a readable A4 PDF.
                            </p>
                            {sourceOrderId && (
                                <p className="mt-2 text-sm text-slate-600">Order source: <strong>{sourceOrderId}</strong></p>
                            )}
                        </div>
                    </div>
                </div>

                {(errorMessage || statusMessage) && (
                    <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${errorMessage ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                        {errorMessage || statusMessage}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <section className="rounded-3xl bg-white p-6 shadow-sm">
                        <div className="grid gap-4 lg:grid-cols-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Invoice Number</label>
                                <input
                                    type="text"
                                    value={invoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Invoice Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Seller details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Company Name</label>
                                        <input
                                            type="text"
                                            value={sellerName}
                                            onChange={(e) => setSellerName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Legal Name</label>
                                        <input
                                            type="text"
                                            value={sellerLegalName}
                                            onChange={(e) => setSellerLegalName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Address</label>
                                        <textarea
                                            rows={3}
                                            value={sellerAddress}
                                            onChange={(e) => setSellerAddress(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 resize-none"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600">Phone</label>
                                            <input
                                                type="text"
                                                value={sellerPhone}
                                                onChange={(e) => setSellerPhone(e.target.value)}
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600">Email</label>
                                            <input
                                                type="email"
                                                value={sellerEmail}
                                                onChange={(e) => setSellerEmail(e.target.value)}
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">NTN / STRN</label>
                                        <input
                                            type="text"
                                            value={sellerNtn}
                                            onChange={(e) => setSellerNtn(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Buyer details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Name</label>
                                        <input
                                            type="text"
                                            value={buyerName}
                                            onChange={(e) => setBuyerName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Contact / Attn</label>
                                        <input
                                            type="text"
                                            value={buyerAttn}
                                            onChange={(e) => setBuyerAttn(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Address</label>
                                        <textarea
                                            rows={3}
                                            value={buyerAddress}
                                            onChange={(e) => setBuyerAddress(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 resize-none"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600">Phone</label>
                                            <input
                                                type="text"
                                                value={buyerPhone}
                                                onChange={(e) => setBuyerPhone(e.target.value)}
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600">NTN</label>
                                            <input
                                                type="text"
                                                value={buyerNtn}
                                                onChange={(e) => setBuyerNtn(e.target.value)}
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Payment type</p>
                                    <p className="text-xs text-slate-500">Choose the payment workflow for the invoice.</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 md:w-[52%]">
                                    {['Cash', 'Card'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setPaymentType(type as 'Cash' | 'Card')}
                                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${paymentType === type ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                {type === 'Card' ? <CreditCard className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                                {type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {paymentType === 'Card' && (
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Transaction ID</label>
                                        <input
                                            type="text"
                                            value={cardTransactionId}
                                            onChange={(e) => setCardTransactionId(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            placeholder="Card transaction reference"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600">Authorization Code</label>
                                        <input
                                            type="text"
                                            value={cardAuthorizationCode}
                                            onChange={(e) => setCardAuthorizationCode(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            placeholder="Auth code / receipt number"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Invoice line items</h2>
                                    <p className="text-sm text-slate-500">Manage the itemized services or products included in the invoice.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-sm font-semibold text-slate-700">Item {index + 1}</div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-slate-400 transition hover:text-rose-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600">Description</label>
                                                <textarea
                                                    rows={2}
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600">Details</label>
                                                <textarea
                                                    rows={2}
                                                    value={item.subDescription}
                                                    onChange={(e) => handleItemChange(item.id, 'subDescription', e.target.value)}
                                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 resize-none"
                                                />
                                            </div>
                                            <div className="grid gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600">Qty</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value) || 1)}
                                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600">Unit Price</label>
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value) || 0)}
                                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Summary settings</h2>
                            <div className="grid gap-4 xl:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Delivery charge</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={deliveryCharge}
                                        onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Tax rate (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Payment terms</label>
                                    <input
                                        type="text"
                                        value={paymentTerms}
                                        onChange={(e) => setPaymentTerms(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 xl:grid-cols-2 mt-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Bank name</label>
                                    <input
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Account title</label>
                                    <input
                                        type="text"
                                        value={accountTitle}
                                        onChange={(e) => setAccountTitle(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-medium text-slate-600">Account number</label>
                                <input
                                    type="text"
                                    value={accountNo}
                                    onChange={(e) => setAccountNo(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-3xl bg-white p-6 shadow-sm">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Invoice preview</h2>
                            <div className="mt-5 space-y-4 text-sm text-slate-700">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Invoice</p>
                                        <p className="mt-2 font-semibold text-slate-900">{invoiceNo}</p>
                                        <p className="text-slate-600">{date}</p>
                                        <p className="text-slate-600">Due {dueDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Buyer</p>
                                        <p className="mt-2 font-semibold text-slate-900">{buyerName}</p>
                                        <p className="text-slate-600">{buyerAttn}</p>
                                        <p className="text-slate-600">{buyerPhone}</p>
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span>PKR {grossSubtotal.toLocaleString()}</span>
                                    </div>
                                    {discountTotal > 0 && (
                                        <div className="flex items-center justify-between text-emerald-600">
                                            <span>Discount</span>
                                            <span>- PKR {discountTotal.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Delivery</span>
                                        <span>PKR {deliveryCharge.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Tax</span>
                                        <span>PKR {taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
                                        <span>Total</span>
                                        <span>PKR {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <InvoicePdfDownloadButton
                        documentProps={invoicePdfProps}
                        fileName={fileName}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </span>
                    </InvoicePdfDownloadButton>
                </div>
            </div>
        </div>
    );
}