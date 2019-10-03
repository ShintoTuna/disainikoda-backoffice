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

function createInvoice(doc: PDFKit.PDFDocument, student: Student, invoice: InvoiceWithNumber) {
    doc.fillColor(fontColor);

    logo(doc);
    paymentDetails(doc, invoice);
    studentDetails(doc, student);
    invoiceDetails(doc, invoice);
    footer(doc);
}

function logo(doc: PDFKit.PDFDocument) {
    doc.image('logo.png', 350, topMargin - 80, { width: 196 });
}

function paymentDetails(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
    doc.fontSize(fontSizeGeneral)

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
        .text('SEB Pank:', 350, topMargin + lineHeight * 3)
        .font('Helvetica-Bold')
        .text('EE701010220199571223', 350, topMargin + lineHeight * 3, { align: 'right' });
}

function studentDetails(doc: PDFKit.PDFDocument, student: Student) {
    doc.font('Helvetica-Bold')
        .text('Maksja', sideMargin, topMargin - 15)
        .font('Helvetica')
        .fontSize(fontSizeGeneral);

    if (student.billing && student.billing.companyName) {
        doc.text(student.billing.companyName, sideMargin, topMargin)
            .text(student.billing.companyAddress, sideMargin, topMargin + lineHeight)
            .text(`Reg. ${student.billing.companyRegNumber}`, sideMargin, topMargin + lineHeight * 2);
    } else {
        doc.text(`${student.firstName} ${student.lastName}`, sideMargin, topMargin).text(
            student.email,
            sideMargin,
            topMargin + lineHeight,
        );
    }
}

function invoiceDetails(doc: PDFKit.PDFDocument, invoice: InvoiceWithNumber) {
    const top = topMargin + 150;

    generateHr(doc, top + 15, 40, 556);
    generateHr(doc, top + 34, 40, 556);
    generateHr(doc, top + 69, 40, 556);

    doc.text('Nimetus', sideMargin, top)
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

function footer(doc: PDFKit.PDFDocument) {
    const top = topMargin + 600;

    generateHr(doc, top - 10, 40, 556);

    doc.font('Helvetica')
        .text('DISAINIKODA MTÜ', sideMargin, top, { width: 165 })
        .text('Registrikood: 80330013', sideMargin, top + lineHeight, { width: 165 })
        .text('Tulika 19, Tallinn, 10165', sideMargin, top + lineHeight * 2, { width: 165 })

        .text('Tel +372 55 604 000', 265, top, { width: 165 })
        .text('info@disainikoda.ee', 265, top + lineHeight, { width: 165 })
        .text('www.disainikoda.ee', 265, top + lineHeight * 2, { width: 165 })

        .text('Arveldusarve', 380, top, { align: 'right', width: 161 })
        .text('SEB Pank', 380, top + lineHeight, { align: 'right', width: 161 })
        .font('Helvetica-Bold')
        .text('EE701010220199571223', 380, top + lineHeight * 2, { align: 'right', width: 161 });
}

function generateHr(doc: PDFKit.PDFDocument, y: number, xFrom = 50, xTo = 546) {
    doc.strokeColor('#000000')
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
