/* eslint-disable @typescript-eslint/camelcase */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as PDFDocument from 'pdfkit';
import { Invoice, Student, InvoiceWithNumber } from './types';
import createInvoice from './invoice';
import * as sendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

admin.initializeApp();

export const invoiceCreation = functions.firestore.document('invoice/{id}').onCreate(async (snapshot, context) => {
  const data = snapshot.data() as Invoice;
  const number = context.params.id;
  const invoice: InvoiceWithNumber = { ...data, number };

  try {
    const student = await getStudent(invoice.student);
    const recipientName = getRecipientName(student);
    const filename = `${invoice.number} - ${recipientName}.pdf`;
    const currentYear = new Date().getFullYear();

    console.log(`Creating Invoice nr ${number}`);

    const pdfFile = admin
      .storage()
      .bucket()
      .file(`/invoices/${currentYear}/${filename}`);
    const stream = pdfFile.createWriteStream();

    const pdf = await generatePdf(stream, invoice, student);

    console.log(`PDF created: "${filename}"`);

    await sendEmail(pdf, student, invoice);

    console.log(`Email sent with attachment: "${filename}"`);
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));
  }

  return { success: true };
});

function getStudent(uid: string) {
  return new Promise<Student>((resolve, reject) => {
    admin
      .firestore()
      .doc(`/student/${uid}`)
      .onSnapshot(async (_snapshot) => {
        const student = _snapshot.data() as Student;

        if (student) {
          resolve(student);
        } else {
          reject('No student found');
        }
      });
  });
}

function generatePdf(stream: NodeJS.WritableStream, invoice: InvoiceWithNumber, student: Student) {
  const buffers: Buffer[] = [];
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(stream);

  createInvoice(doc, student, invoice);

  const bufferPromise = new Promise<Buffer[]>((resolve, reject) => {
    doc.on('end', () => {
      resolve(buffers);
    });

    doc.on('error', (error) => {
      reject(error);
    });
  });

  doc.on('data', (data) => buffers.push(data));
  doc.end();

  return bufferPromise;
}

function sendEmail(buffers: Buffer[], student: Student, invoice: InvoiceWithNumber) {
  const pdfData = Buffer.concat(buffers);
  const recipientName = getRecipientName(student);
  const isMc = invoice.company === 'mc';

  const companyName = isMc ? 'Monochrome Art OÜ' : 'Disainikoda MTÜ';
  const apiKey = isMc ? functions.config().monochrome.api_key : functions.config().disainikoda.api_key;
  const templateId = isMc ? functions.config().monochrome.template : functions.config().disainikoda.template;
  const fromEmail = isMc ? functions.config().monochrome.email : functions.config().disainikoda.email;

  const msg: MailDataRequired = {
    personalizations: [
      {
        to: [
          {
            email: student.email,
            name: `${student.firstName} ${student.lastName}`,
          },
        ],
        dynamicTemplateData: {
          invoiceNumber: invoice.number,
          subject: `Arve nr ${invoice.number}`,
        },
      },
    ],
    from: {
      email: fromEmail,
      name: companyName,
    },
    templateId,
    attachments: [
      {
        type: 'application/pdf',
        disposition: 'attachment',
        filename: `Arve nr ${invoice.number} - ${recipientName}.pdf`,
        content: pdfData.toString('base64'),
      },
    ],
  };

  sendGrid.setApiKey(apiKey);

  return sendGrid.send(msg);
}

function getRecipientName(student: Student) {
  return student.billing && student.billing.companyName
    ? student.billing.companyName
    : `${student.lastName} ${student.firstName}`;
}
