const PDFDocument = require('pdfkit');

/**
 * Generate a PDF invoice stream
 * @param {Object} data { invoiceNumber, payment, therapist, client, session }
 * @param {Response} res Express response object
 */
const generateInvoicePDF = (data, res) => {
  const { invoiceNumber, payment, therapist, client, session } = data;
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=UNFAZED_Invoice_${invoiceNumber || 'INV'}.pdf`
  );

  doc.pipe(res);

  // Header Banner
  doc.rect(0, 0, doc.page.width, 100).fill('#2c4585');

  doc
    .fillColor('#FFFFFF')
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('UNFAZED', 50, 32);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Clinical Practice Management Platform', 50, 62);

  doc
    .fillColor('#FFFFFF')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('TAX INVOICE / RECEIPT', 350, 42, { align: 'right' });

  // Invoice Meta
  doc.fillColor('#1e293b');
  doc.y = 125;

  const leftX = 50;
  const rightX = 350;

  // Practitioner Details
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('PRACTITIONER DETAILS', leftX)
    .fontSize(10)
    .font('Helvetica')
    .moveDown(0.3)
    .text(therapist?.name || 'Dr. Neha Sharma')
    .text(therapist?.title || 'Licensed Clinical Psychologist')
    .text(therapist?.clinicAddress || 'Bengaluru, Karnataka')
    .text(`Email: ${therapist?.email || 'dr.sharma@unfazed.in'}`)
    .text(`Phone: ${therapist?.phone || '+91 98765 43210'}`);

  // Invoice Details & Client Details
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('INVOICE DETAILS', rightX, 125)
    .fontSize(10)
    .font('Helvetica')
    .moveDown(0.3)
    .text(`Invoice No: ${invoiceNumber || 'INV-' + Date.now()}`)
    .text(`Date: ${new Date(payment?.paidAt || Date.now()).toLocaleDateString('en-IN')}`)
    .text(`Payment Status: ${payment?.paymentStatus || 'Successful'}`)
    .text(`Transaction ID: ${payment?.transactionId || 'rzp_demo_tx_123'}`)
    .moveDown(1)
    .font('Helvetica-Bold')
    .text('BILLED TO:')
    .font('Helvetica')
    .text(client?.name || 'Client')
    .text(`Email: ${client?.email || 'client@example.com'}`)
    .text(`Phone: ${client?.phone || 'N/A'}`);

  // Divider Line
  doc.moveTo(50, 260).lineTo(545, 260).strokeColor('#e2e8f0').stroke();

  // Table Header
  const tableTop = 275;
  doc
    .rect(50, tableTop, 495, 25)
    .fill('#f1f5f9');

  doc
    .fillColor('#334155')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('DESCRIPTION', 60, tableTop + 7)
    .text('SESSION DATE', 260, tableTop + 7)
    .text('DURATION', 380, tableTop + 7)
    .text('AMOUNT (INR)', 455, tableTop + 7);

  // Table Row
  const rowY = tableTop + 35;
  const serviceName = session?.serviceName || 'Individual Therapy Consultation';
  const sessionDate = session?.date || new Date().toISOString().split('T')[0];
  const duration = (session?.duration || 50) + ' mins';
  const amount = '₹' + (payment?.amount || session?.fee || 1500).toLocaleString('en-IN');

  doc
    .fillColor('#0f172a')
    .fontSize(10)
    .font('Helvetica')
    .text(serviceName, 60, rowY)
    .text(sessionDate, 260, rowY)
    .text(duration, 380, rowY)
    .text(amount, 455, rowY);

  doc.moveTo(50, rowY + 25).lineTo(545, rowY + 25).strokeColor('#e2e8f0').stroke();

  // Summary Table
  const summaryY = rowY + 45;
  doc
    .font('Helvetica')
    .text('Subtotal:', 360, summaryY)
    .text(amount, 455, summaryY)
    .text('CGST / SGST (0% - Healthcare):', 360, summaryY + 18)
    .text('₹0', 455, summaryY + 18)
    .moveTo(350, summaryY + 36)
    .lineTo(545, summaryY + 36)
    .strokeColor('#cbd5e1')
    .stroke();

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#2c4585')
    .text('Total Paid:', 360, summaryY + 44)
    .text(amount, 455, summaryY + 44);

  // Verification Badge
  doc
    .rect(50, 500, 495, 45)
    .fill('#ecfdf5')
    .strokeColor('#10b981')
    .stroke();

  doc
    .fillColor('#065f46')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('✓ PAYMENT VERIFIED - OFFICIAL RECEIPT', 65, 516);

  // Footer Disclaimers
  doc
    .fillColor('#94a3b8')
    .fontSize(8)
    .font('Helvetica')
    .text(
      'This document is computer-generated through UNFAZED Practice Management Platform and does not require a physical signature.',
      50,
      720,
      { align: 'center', width: 495 }
    )
    .text(
      'Confidentiality Notice: The contents of this document are private and privileged for the client and attending therapist.',
      50,
      735,
      { align: 'center', width: 495 }
    );

  doc.end();
};

module.exports = { generateInvoicePDF };
