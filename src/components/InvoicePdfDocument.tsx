'use client';

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

type LineItem = {
  id: string;
  description: string;
  subDescription: string;
  quantity: number;
  rate: number;
};

export type InvoicePdfDocumentProps = {
  invoiceNo: string;
  date: string;
  dueDate: string;
  sellerName: string;
  sellerLegalName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerNtn: string;
  buyerName: string;
  buyerAttn: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerNtn: string;
  items: LineItem[];
  deliveryCharge: number;
  taxRate: number;
  bankName: string;
  accountTitle: string;
  accountNo: string;
  paymentTerms: string;
  paymentType: 'Cash' | 'Card';
  cardTransactionId: string;
  cardAuthorizationCode: string;
  logoUrl: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 9,
    marginBottom: 3,
    color: '#374151',
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  logo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
    marginBottom: 4,
  },
  companyHeaderMeta: {
    alignItems: 'flex-end',
  },
  companyNameRight: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyAddressRight: {
    fontSize: 8,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 1.2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 12,
  },
  partiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  partyBox: {
    width: '48%',
  },
  partyHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    paddingBottom: 3,
  },
  partyContentText: {
    fontSize: 9,
    marginBottom: 2.5,
    color: '#374151',
    lineHeight: 1.3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    borderTopWidth: 1.5,
    borderTopColor: '#111827',
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderStyle: 'dashed',
    alignItems: 'flex-start',
  },
  colItem: { width: '8%', textAlign: 'left', fontSize: 9 },
  colDesc: { width: '52%', textAlign: 'left', paddingRight: 10, fontSize: 9 },
  colQty: { width: '12%', textAlign: 'center', fontSize: 9 },
  colPrice: { width: '14%', textAlign: 'right', fontSize: 9 },
  colAmount: { width: '14%', textAlign: 'right', fontSize: 9, fontWeight: 'bold' },

  itemTitle: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#111111',
  },
  itemSub: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  bankDetailsBox: {
    width: '52%',
  },
  summaryBox: {
    width: '42%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 9,
    color: '#374151',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: '#111827',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  thankYouBanner: {
    marginTop: 25,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 8,
    color: '#1f2937',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 7.5,
    color: '#9ca3af',
  },
});

export default function InvoicePdfDocument({
  invoiceNo,
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
  logoUrl,
}: InvoicePdfDocumentProps) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount + deliveryCharge;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Invoice No:</Text> {invoiceNo}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Date:</Text> {date}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Due Date:</Text> {dueDate}</Text>
          </View>
          <View style={styles.companyHeaderMeta}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <Text style={styles.companyNameRight}>{sellerName}</Text>
            <Text style={styles.companyAddressRight}>{sellerAddress}</Text>
            <Text style={styles.companyAddressRight}>Tel: {sellerPhone} | {sellerEmail}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Seller & Buyer Side-by-Side Details */}
        <View style={styles.partiesRow}>
          <View style={styles.partyBox}>
            <Text style={styles.partyHeader}>ISSUED BY (SELLER)</Text>
            <Text style={[styles.partyContentText, styles.boldLabel]}>{sellerLegalName || sellerName}</Text>
            <Text style={styles.partyContentText}>{sellerAddress}</Text>
            <Text style={styles.partyContentText}>Phone: {sellerPhone}</Text>
            {sellerNtn && <Text style={styles.partyContentText}>NTN/STRN: {sellerNtn}</Text>}
          </View>

          <View style={styles.partyBox}>
            <Text style={styles.partyHeader}>BILLED TO (BUYER)</Text>
            <Text style={[styles.partyContentText, styles.boldLabel]}>{buyerName}</Text>
            {buyerAttn && <Text style={styles.partyContentText}>{buyerAttn}</Text>}
            <Text style={styles.partyContentText}>{buyerAddress}</Text>
            {buyerPhone && <Text style={styles.partyContentText}>{buyerPhone}</Text>}
            {buyerNtn && <Text style={styles.partyContentText}>NTN: {buyerNtn}</Text>}
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colItem, styles.boldLabel]}>ITEM</Text>
          <Text style={[styles.colDesc, styles.boldLabel]}>DESCRIPTION</Text>
          <Text style={[styles.colQty, styles.boldLabel]}>QTY</Text>
          <Text style={[styles.colPrice, styles.boldLabel]}>PRICE (PKR)</Text>
          <Text style={[styles.colAmount, styles.boldLabel]}>AMOUNT (PKR)</Text>
        </View>

        {/* Table Rows */}
        {items.map((item, index) => {
          const lineTotal = item.quantity * item.rate;
          return (
            <View key={item.id || index} style={styles.tableRow} wrap={false}>
              <Text style={styles.colItem}>{index + 1}.</Text>
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>{item.description}</Text>
                {item.subDescription ? <Text style={styles.itemSub}>{item.subDescription}</Text> : null}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.rate.toLocaleString()}</Text>
              <Text style={styles.colAmount}>{lineTotal.toLocaleString()}</Text>
            </View>
          );
        })}

        {/* Bottom Section: Bank Details & Totals Side-by-Side */}
        <View style={styles.bottomSection} wrap={false}>
          <View style={styles.bankDetailsBox}>
            <Text style={[styles.boldLabel, { marginBottom: 4 }]}>Payment Terms & Bank Details:</Text>
            <Text style={styles.metaText}>{paymentTerms}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Bank Name:</Text> {bankName}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Account Title:</Text> {accountTitle}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Account No:</Text> {accountNo}</Text>
            <Text style={styles.metaText}><Text style={styles.boldLabel}>Payment Type:</Text> {paymentType}</Text>
            {paymentType === 'Card' && (
              <>
                <Text style={styles.metaText}><Text style={styles.boldLabel}>Transaction ID:</Text> {cardTransactionId || 'N/A'}</Text>
                <Text style={styles.metaText}><Text style={styles.boldLabel}>Auth Code:</Text> {cardAuthorizationCode || 'N/A'}</Text>
              </>
            )}
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Subtotal:</Text>
              <Text>PKR {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charges:</Text>
              <Text>{deliveryCharge.toLocaleString()}</Text>
            </View>
            {taxRate > 0 && (
              <View style={styles.summaryRow}>
                <Text>Tax (GST {taxRate}%):</Text>
                <Text>PKR {taxAmount.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.summaryTotalRow}>
              <Text>Total:</Text>
              <Text>PKR {grandTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Thank You Note */}
        <View wrap={false}>
          <Text style={styles.thankYouBanner}>
            Thank you for your valuable business. It is a pleasure serving you!
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {sellerName} • {sellerAddress} • {sellerEmail}
        </Text>

      </Page>
    </Document>
  );
}