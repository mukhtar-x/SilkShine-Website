'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCcw } from 'lucide-react';

const defaultMetadata = {
  about: {
    hero: {
      title: { en: '', ur: '' },
      subtitle: { en: '', ur: '' },
      image: '/assets/hero-bg.jpg',
    },
    story: {
      title: { en: '', ur: '' },
      content: { en: '', ur: '' },
    },
    stats: [
      { label: { en: '', ur: '' }, value: '' },
      { label: { en: '', ur: '' }, value: '' },
      { label: { en: '', ur: '' }, value: '' },
    ],
  },
  contact: {
    title: { en: '', ur: '' },
    subtitle: { en: '', ur: '' },
    operatingHours: '',
    info: [
      { title: { en: '', ur: '' }, value: { en: '', ur: '' }, icon: 'MapPin' },
      { title: { en: '', ur: '' }, value: { en: '', ur: '' }, icon: 'Mail' },
      { title: { en: '', ur: '' }, value: { en: '', ur: '' }, icon: 'Phone' },
    ],
  },
  invoice: {
    sellerName: '',
    sellerLegalName: '',
    sellerAddress: '',
    sellerPhone: '',
    sellerNtn: '',
    sellerEmail: '',
    bankName: '',
    accountTitle: '',
    accountNo: '',
    paymentTerms: '',
  },
};

export default function SiteMetadataAdminPage() {
  const router = useRouter();
  const [metadata, setMetadata] = useState<any>(defaultMetadata);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/site-metadata');
        const data = await res.json();
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) throw new Error(data?.error || 'Failed to load metadata');
        setMetadata(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load metadata');
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleInputChange = (path: string, value: any) => {
    setMetadata((prev: any) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cursor: any = next;
      while (keys.length > 1) {
        const key = keys.shift();
        if (!key) break;
        if (!cursor[key]) cursor[key] = {};
        cursor = cursor[key];
      }
      const lastKey = keys[0];
      if (lastKey) {
        cursor[lastKey] = value;
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);
      setError(null);

      const res = await fetch('/api/admin/site-metadata', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error(data?.error || 'Unable to save metadata');
      setStatusMessage('Saved successfully.');
      setMetadata(data.metadata || metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save metadata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-gray-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">Loading site metadata…</p>
          <p className="text-sm text-gray-500 mt-2">Fetching the latest content for admin editing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-950">Site Metadata</h1>
          <p className="text-sm text-gray-500">Update homepage, contact, and invoice content from one source.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {statusMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Hero Content</h2>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-600">
                English Title
                <input
                  value={metadata?.about?.hero?.title?.en || ''}
                  onChange={(e) => handleInputChange('about.hero.title.en', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                Urdu Title
                <input
                  value={metadata?.about?.hero?.title?.ur || ''}
                  onChange={(e) => handleInputChange('about.hero.title.ur', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-600">
                English Subtitle
                <input
                  value={metadata?.about?.hero?.subtitle?.en || ''}
                  onChange={(e) => handleInputChange('about.hero.subtitle.en', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                Urdu Subtitle
                <input
                  value={metadata?.about?.hero?.subtitle?.ur || ''}
                  onChange={(e) => handleInputChange('about.hero.subtitle.ur', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-gray-600">
              Hero Background Image URL
              <input
                value={metadata?.about?.hero?.image || ''}
                onChange={(e) => handleInputChange('about.hero.image', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Contact Content</h2>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-600">
                Contact Title (EN)
                <input
                  value={metadata?.contact?.title?.en || ''}
                  onChange={(e) => handleInputChange('contact.title.en', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                Contact Title (UR)
                <input
                  value={metadata?.contact?.title?.ur || ''}
                  onChange={(e) => handleInputChange('contact.title.ur', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-gray-600">
              Contact Subtitle (EN)
              <input
                value={metadata?.contact?.subtitle?.en || ''}
                onChange={(e) => handleInputChange('contact.subtitle.en', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-sm text-gray-600">
              Operating Hours
              <input
                value={metadata?.contact?.operatingHours || ''}
                onChange={(e) => handleInputChange('contact.operatingHours', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Invoice Defaults</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Seller Name', path: 'invoice.sellerName' },
            { label: 'Legal Name', path: 'invoice.sellerLegalName' },
            { label: 'Address', path: 'invoice.sellerAddress' },
            { label: 'Phone', path: 'invoice.sellerPhone' },
            { label: 'NTN', path: 'invoice.sellerNtn' },
            { label: 'Email', path: 'invoice.sellerEmail' },
            { label: 'Bank Name', path: 'invoice.bankName' },
            { label: 'Account Title', path: 'invoice.accountTitle' },
            { label: 'Account No.', path: 'invoice.accountNo' },
            { label: 'Payment Terms', path: 'invoice.paymentTerms' },
          ].map((field) => (
            <label key={field.path} className="space-y-1 text-sm text-gray-600">
              {field.label}
              <input
                value={metadata?.invoice?.[field.path.split('.').pop()!] || ''}
                onChange={(e) => handleInputChange(field.path, e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
