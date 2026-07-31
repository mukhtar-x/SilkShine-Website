'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdfDocument, { InvoicePdfDocumentProps } from './InvoicePdfDocument';

type InvoicePdfDownloadButtonProps = {
  documentProps: InvoicePdfDocumentProps;
  fileName: string;
  className?: string;
  children?: React.ReactNode;
};

export default function InvoicePdfDownloadButton({ documentProps, fileName, className, children }: InvoicePdfDownloadButtonProps) {
  return (
    <PDFDownloadLink document={<InvoicePdfDocument {...documentProps} />} fileName={fileName} className={className}>
      {({ loading }) => (
        <span className="inline-flex items-center gap-2">
          {children ?? (loading ? 'Preparing PDF…' : 'Download PDF')}
        </span>
      )}
    </PDFDownloadLink>
  );
}
