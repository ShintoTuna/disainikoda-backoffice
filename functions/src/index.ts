import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as PDFDocument from 'pdfkit';
import * as nodemailer from 'nodemailer';
import { Invoice, Student, InvoiceWithNumber } from './types';
import createInvoice from './invoice';

admin.initializeApp();

export const invoiceCreation = functions.firestore.document('invoice/{id}').onCreate(async (snapshot, context) => {
    const invoice = snapshot.data() as Invoice;
    const number = context.params.id;
    const student = await getStudent(invoice.student);
    const invoiceWithNumber: InvoiceWithNumber = { ...invoice, number };

    console.log(`Creating Invoice nr ${number}`);

    return generatePdf(invoiceWithNumber, student);
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

async function generatePdf(invoice: InvoiceWithNumber, student: Student) {
    const buffers: Buffer[] = [];
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const pdfFile = admin
        .storage()
        .bucket()
        .file(`/invoices/${invoice.number} - ${student.lastName} ${student.firstName}.pdf`);

    createInvoice(doc, student, invoice);

    doc.pipe(pdfFile.createWriteStream());

    const bufferPromise = new Promise<Buffer[]>((resolve, reject) => {
        doc.on('end', () => {
            console.log(`Invoice ${invoice.number} created`);
            resolve(buffers);
        });

        doc.on('error', (error) => {
            console.log(error);
            reject(error);
        });
    });

    doc.on('data', (data) => buffers.push(data));
    doc.end();

    const resolvedBuffers = await bufferPromise;

    return sendEmail(resolvedBuffers, student, invoice.number);
}

async function sendEmail(buffers: Buffer[], student: Student, invoiceNumber: number) {
    const pdfData = Buffer.concat(buffers);

    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: functions.config().mailer.email,
            pass: functions.config().mailer.pass,
        },
    });

    const mailOptions = {
        from: 'Disainikoda <from@example.com>',
        to: student.email,
        subject: `Arve nr ${invoiceNumber}`,
        html: '<p>Your invoice</p>',
        attachments: [
            {
                filename: `Arve nr ${invoiceNumber} - ${student.lastName} ${student.firstName}.pdf`,
                content: pdfData,
            },
        ],
    };

    try {
        await mailTransport.sendMail(mailOptions);
        console.log(`Mail sent to ${student.email}`);
    } catch (error) {
        console.error(error);
    }
}
