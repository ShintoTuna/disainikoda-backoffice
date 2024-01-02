import { Student, InvoiceWithNumber } from './types';
import { format, addDays } from 'date-fns';
import { firestore } from 'firebase-admin';

// page width is 596

const fontColor = '#00000';
const fontSizeGeneral = 9;

const topMargin = 130;
const lineHeight = 15;
const sideMargin = 50;

const payPeriod = 10;

interface Company {
  name: string;
  regNr: string;
  address: string;
  email: string;
  phone: string;
  web: string;
  bank: string;
  iban: string;
}

const dk: Company = {
  name: 'Disainikoda MTÜ',
  regNr: '80330013',
  address: 'Jõesuu tee 6-1, Pirita, Tallinn, 11911',
  email: 'info@disainikoda.ee',
  phone: '+372 55 604 000',
  web: 'www.disainikoda.ee',
  bank: 'SEB Pank',
  iban: 'EE701010220199571223',
};

const mc: Company = {
  name: 'Monochrome Art OÜ',
  regNr: '16802055',
  address: 'Jõesuu tee 6-1, Pirita, Tallinn, 11911',
  email: 'art@monochrome.ee',
  phone: '+372 55 604 000',
  web: 'www.monochrome.ee',
  bank: 'LHV Pank',
  iban: 'EE357700771009403005',
};

function createInvoice(doc: PDFKit.PDFDocument, student: Student, invoice: InvoiceWithNumber) {
  doc.fillColor(fontColor);

  logo(doc, invoice);
  paymentDetails(doc, invoice);
  studentDetails(doc, student);
  invoiceDetails(doc, invoice);
  footer(doc, invoice);
}

function logo(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
  if (invoice.company === 'mc') {
    doc.image('mcLogo.png', 350, topMargin - 80, { width: 196 });
  } else {
    doc.image('logo.png', 350, topMargin - 80, { width: 196 });
  }
}

function paymentDetails(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
  const company = invoice.company === 'mc' ? mc : dk;

  doc
    .fontSize(fontSizeGeneral)

    .font('Helvetica')
    .text('Arve nr', 350, topMargin - 15)
    .font('Helvetica-Bold')
    .text(String(invoice.number), 350, topMargin - 15, { align: 'right' })

    .font('Helvetica')
    .text('Arve kuupäev:', 350, topMargin)
    .font('Helvetica-Bold')
    .text(formatDate(invoice.date), 350, topMargin, { align: 'right' })

    .font('Helvetica')
    .text('Maksetingimus:', 350, topMargin + lineHeight)
    .font('Helvetica-Bold')
    .text(`${payPeriod} päeva`, 350, topMargin + lineHeight, { align: 'right' })

    .font('Helvetica')
    .text('Maksetähtaeg:', 350, topMargin + lineHeight * 2)
    .font('Helvetica-Bold')
    .text(formatDate(invoice.date, payPeriod), 350, topMargin + lineHeight * 2, { align: 'right' })

    .font('Helvetica')
    .text(`${company.bank}:`, 350, topMargin + lineHeight * 3)
    .font('Helvetica-Bold')
    .text(company.iban, 350, topMargin + lineHeight * 3, { align: 'right' });
}

function studentDetails(doc: PDFKit.PDFDocument, student: Student) {
  doc
    .font('Helvetica-Bold')
    .text('Maksja', sideMargin, topMargin - 15)
    .font('Helvetica')
    .fontSize(fontSizeGeneral);

  if (student.billing && student.billing.companyName) {
    doc
      .text(student.billing.companyName, sideMargin, topMargin)
      .text(student.billing.companyAddress, sideMargin, topMargin + lineHeight)
      .text(`Reg. ${student.billing.companyRegNumber}`, sideMargin, topMargin + lineHeight * 2);
  } else {
    doc
      .text(`${student.firstName} ${student.lastName}`, sideMargin, topMargin)
      .text(student.email, sideMargin, topMargin + lineHeight);
  }
}

function invoiceDetails(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
  const top = topMargin + 150;

  generateHr(doc, top + 15, 40, 556);
  generateHr(doc, top + 34, 40, 556);
  generateHr(doc, top + 69, 40, 556);

  doc
    .text('Nimetus', sideMargin, top)
    .font('Helvetica-Bold')
    .text(invoice.title, sideMargin, top + 20)

    .font('Helvetica')
    .text('Ühik', 300, top, { align: 'center', width: 50 })
    .text('osa', 300, top + 20, { align: 'center', width: 50 })

    .text('Kogus', 350, top, { align: 'center', width: 50 })
    .text('1', 350, top + 20, { align: 'center', width: 50 })

    .text('Hind', 400, top, { align: 'right', width: 50 })
    .text(formatCurrency(invoice.amount), 400, top + 20, { align: 'right', width: 50 })

    .text('KM', 450, top, { align: 'center', width: 50 })

    .text('Summa', 500, top, { align: 'right', width: 46 })
    .text(formatCurrency(invoice.amount), 500, top + 20, { align: 'right', width: 46 })

    .text('Summa km-ta:', 300, top + 40, { align: 'right', width: 180 })
    .text('Käibemaks 0%:', 300, top + 55, { align: 'right', width: 180 })
    .font('Helvetica-Bold')
    .text('Arve summa kokku EUR', 300, top + 75, { align: 'right', width: 180 })
    .font('Helvetica')
    .text(formatCurrency(invoice.amount), 500, top + 40, { align: 'right', width: 46 })
    .text(formatCurrency(0), 500, top + 55, { align: 'right', width: 46 })
    .font('Helvetica-Bold')
    .text(formatCurrency(invoice.amount), 500, top + 75, { align: 'right', width: 46 });
}

function footer(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
  const top = topMargin + 600;

  generateHr(doc, top - 10, 40, 556);

  const company = invoice.company === 'mc' ? mc : dk;

  doc
    .font('Helvetica')
    .text(company.name, sideMargin, top, { width: 165 })
    .text(`Registrikood: ${company.regNr}`, sideMargin, top + lineHeight, { width: 165 })
    .text(company.address, sideMargin, top + lineHeight * 2, { width: 165 })

    .text(`Tel ${company.phone}`, 265, top, { width: 165 })
    .text(company.email, 265, top + lineHeight, { width: 165 })
    .text(company.web, 265, top + lineHeight * 2, { width: 165 })

    .text('Arveldusarve', 380, top, { align: 'right', width: 161 })
    .text(company.bank, 380, top + lineHeight, { align: 'right', width: 161 })
    .font('Helvetica-Bold')
    .text(company.iban, 380, top + lineHeight * 2, { align: 'right', width: 161 });
}

function generateHr(doc: PDFKit.PDFDocument, y: number, xFrom = 50, xTo = 546) {
  doc
    .strokeColor('#000000')
    .lineWidth(0.1)
    .moveTo(xFrom, y)
    .lineTo(xTo, y)
    .stroke();
}

function formatCurrency(sum: number) {
  return `${sum.toFixed(2)}`;
}

function formatDate(date: firestore.Timestamp, additionInDays = 0) {
  if (additionInDays > 0) {
    const added = addDays(date.toDate(), additionInDays);
    return format(added, 'dd/MM/yyyy');
  }
  return format(date.toDate(), 'dd/MM/yyyy');
}

export default createInvoice;
