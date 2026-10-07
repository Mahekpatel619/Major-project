require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

// Models
const Therapist = require('../models/Therapist');
const Client = require('../models/Client');
const Availability = require('../models/Availability');
const Session = require('../models/Session');
const Payment = require('../models/Payment');
const Package = require('../models/Package');
const ClientPackage = require('../models/ClientPackage');
const SessionNote = require('../models/SessionNote');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const SubscriptionTierConfig = require('../models/SubscriptionTierConfig');
const Mood = require('../models/Mood');
const Homework = require('../models/Homework');
const Consent = require('../models/Consent');

const seedData = async (shouldClear = true) => {
  if (shouldClear) {
    console.log('🌱 Clearing existing database collections...');
    await Promise.all([
      Therapist.deleteMany({}),
      Client.deleteMany({}),
      Availability.deleteMany({}),
      Session.deleteMany({}),
      Payment.deleteMany({}),
      Package.deleteMany({}),
      ClientPackage.deleteMany({}),
      SessionNote.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      SubscriptionTierConfig.deleteMany({}),
      Mood.deleteMany({}),
      Homework.deleteMany({}),
      Consent.deleteMany({}),
    ]);
  }

  console.log('🌱 Seeding Subscription Tier Configurations...');
  await SubscriptionTierConfig.insertMany([
    {
      tierName: 'Free',
      displayName: 'Free Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'For newly licensed solo therapists launching their private practice.',
      features: [
        'Up to 5 active clients',
        'Standard booking calendar',
        'Freeform clinical session notes',
        'Razorpay UPI payments',
        'Basic client portal',
      ],
      limits: {
        maxActiveClients: 5,
        advancedAnalytics: false,
        advancedNoteTemplates: false,
        sessionPackages: false,
        customBranding: false,
        homeworkSharing: true,
        noShowRiskAI: false,
      },
    },
    {
      tierName: 'Pro',
      displayName: 'Practice Pro',
      monthlyPrice: 1999,
      annualPrice: 19990,
      description: 'For growing practices needing clinical templates, bundles & smart risk insights.',
      features: [
        'Up to 30 active clients',
        'SOAP & DAP clinical note templates',
        'Session package bundles (3, 6, 12 sessions)',
        'Automated PDF invoice generation',
        'Real-time chat & notifications',
        'Smart No-Show Risk Indicator',
        'Advanced analytics & revenue trends',
      ],
      limits: {
        maxActiveClients: 30,
        advancedAnalytics: true,
        advancedNoteTemplates: true,
        sessionPackages: true,
        customBranding: true,
        homeworkSharing: true,
        noShowRiskAI: true,
      },
    },
    {
      tierName: 'Premium',
      displayName: 'Clinical Master',
      monthlyPrice: 3999,
      annualPrice: 39990,
      description: 'For established practitioners and group clinics requiring unlimited scale.',
      features: [
        'Unlimited active clients',
        'Full custom domain & branded links',
        'Multi-practitioner supervision',
        'Priority WhatsApp appointment reminders (API)',
        'Dedicated account manager',
        'All Pro features included',
      ],
      limits: {
        maxActiveClients: -1,
        advancedAnalytics: true,
        advancedNoteTemplates: true,
        sessionPackages: true,
        customBranding: true,
        homeworkSharing: true,
        noShowRiskAI: true,
      },
    },
  ]);

  console.log('🌱 Seeding Primary Therapist: Dr. Neha Sharma...');
  const therapist = await Therapist.create({
    name: 'Dr. Neha Sharma',
    email: 'dr.sharma@unfazed.in',
    password: 'Password123!',
    slug: 'dr-sharma',
    title: 'Senior Clinical Psychologist & Psychotherapist',
    bio: 'Over 8 years of clinical experience specializing in Cognitive Behavioral Therapy (CBT), Mindfulness-Based Cognitive Therapy (MBCT), and anxiety/depression management. Dedicated to creating an empathetic, non-judgmental space for emotional healing.',
    specializations: [
      'Anxiety & Panic Disorders',
      'Clinical Depression',
      'Workplace Stress & Burnout',
      'Relationship & Couples Therapy',
      'Grief & Bereavement',
    ],
    languages: ['English', 'Hindi', 'Kannada'],
    experience: 8,
    consultationFee: 1500,
    phone: '+91 98765 43210',
    clinicAddress: '100 Feet Road, Indiranagar, Bengaluru / Secure Online Video',
    profileImage: 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg',
    qualifications: [
      'M.Phil in Clinical Psychology (NIMHANS, Bengaluru)',
      'M.Sc. in Applied Psychology',
      'Rehabilitation Council of India (RCI) Registered',
    ],
    subscriptionPlan: 'Pro',
    services: [
      {
        name: 'Individual Therapy Consultation',
        duration: 50,
        price: 1500,
        description: 'One-on-one personalized psychotherapy session addressing personal challenges and emotional well-being.',
      },
      {
        name: 'Couples / Relationship Therapy',
        duration: 75,
        price: 2400,
        description: 'Guided joint sessions to improve communication, resolve recurring conflict, and rebuild intimacy.',
      },
      {
        name: 'Mindfulness & Stress Management',
        duration: 45,
        price: 1200,
        description: 'Targeted relaxation exercises, grounding techniques, and stress reduction protocols.',
      },
    ],
  });

  console.log('🌱 Seeding Availability Schedule for Dr. Sharma...');
  await Availability.create({
    therapistId: therapist._id,
    sessionDuration: 50,
    bufferTime: 10,
    blockedDates: [{ date: '2026-10-02', reason: 'National Holiday' }],
    weeklySchedule: [
      { dayOfWeek: 1, dayName: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      { dayOfWeek: 4, dayName: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      { dayOfWeek: 5, dayName: 'Friday', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      { dayOfWeek: 6, dayName: 'Saturday', enabled: true, startTime: '10:00', endTime: '15:00', breakStart: '12:30', breakEnd: '13:00' },
      { dayOfWeek: 0, dayName: 'Sunday', enabled: false, startTime: '10:00', endTime: '13:00' },
    ],
  });

  console.log('🌱 Seeding Practice Clients...');
  const clientAarav = await Client.create({
    therapistId: therapist._id,
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    password: 'Password123!',
    phone: '+91 98450 11223',
    status: 'Active',
    tags: ['Work Burnout', 'Generalized Anxiety'],
    gender: 'Male',
    dateOfBirth: new Date('1994-04-12'),
    emergencyContact: { name: 'Kavita Patel', relationship: 'Spouse', phone: '+91 98450 99887' },
    intakeCompleted: true,
    intakeData: {
      presentingConcern: 'Chronic work-related stress, racing thoughts at night, and imposter syndrome.',
      previousTherapyExperience: 'Attended 3 sessions 2 years ago during college.',
      currentMedications: 'None',
      goalsForTherapy: 'Develop healthy boundary-setting techniques and manage workplace performance anxiety.',
    },
    consentSigned: true,
    consentSignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  });

  const clientPriya = await Client.create({
    therapistId: therapist._id,
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    password: 'Password123!',
    phone: '+91 97312 44556',
    status: 'Active',
    tags: ['CBT', 'Depressive Episode', 'High No-Show Risk'],
    gender: 'Female',
    dateOfBirth: new Date('1998-08-23'),
    emergencyContact: { name: 'Sunil Nair', relationship: 'Father', phone: '+91 97312 11223' },
    intakeCompleted: true,
    intakeData: {
      presentingConcern: 'Persistent low energy, social withdrawal, negative self-talk.',
      previousTherapyExperience: 'First time seeing a psychologist.',
      currentMedications: 'Prescribed SSRI by psychiatrist.',
      goalsForTherapy: 'Structured behavioral activation and emotional regulation.',
    },
    consentSigned: true,
    consentSignedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  });

  const clientRohan = await Client.create({
    therapistId: therapist._id,
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    password: 'Password123!',
    phone: '+91 99001 77889',
    status: 'Active',
    tags: ['Student Stress', 'Relationship Issues'],
    gender: 'Male',
    intakeCompleted: true,
    consentSigned: true,
    consentSignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  });

  const clientAnanya = await Client.create({
    therapistId: therapist._id,
    name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    password: 'Password123!',
    phone: '+91 98112 33445',
    status: 'Lead',
    tags: ['Intake Pending'],
    gender: 'Female',
    intakeCompleted: false,
    consentSigned: false,
  });

  console.log('🌱 Seeding Session Packages...');
  const pkg3 = await Package.create({
    therapistId: therapist._id,
    name: 'Starter Care Bundle (3 Sessions)',
    numberOfSessions: 3,
    price: 4050,
    discountPercentage: 10,
    validityDays: 60,
    description: 'Ideal for short-term goal-oriented cognitive behavioral intervention.',
  });

  await Package.create({
    therapistId: therapist._id,
    name: 'Comprehensive Continuity Bundle (6 Sessions)',
    numberOfSessions: 6,
    price: 7650,
    discountPercentage: 15,
    validityDays: 120,
    description: 'Our most popular care plan for in-depth therapeutic transformation.',
  });

  console.log('🌱 Seeding Client Package Balance...');
  await ClientPackage.create({
    therapistId: therapist._id,
    clientId: clientRohan._id,
    packageId: pkg3._id,
    packageName: pkg3.name,
    totalSessions: 3,
    usedSessions: 1,
    remainingSessions: 2,
    expiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    status: 'Active',
  });

  console.log('🌱 Seeding Sessions & Appointments...');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const past1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const past2 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const past3 = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const sessAarav1 = await Session.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    serviceName: 'Individual Therapy Consultation',
    date: past2,
    startTime: '10:00',
    endTime: '10:50',
    duration: 50,
    status: 'Completed',
    fee: 1500,
    paymentStatus: 'Paid',
  });

  const sessAarav2 = await Session.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    serviceName: 'Individual Therapy Consultation',
    date: past1,
    startTime: '10:00',
    endTime: '10:50',
    duration: 50,
    status: 'Completed',
    fee: 1500,
    paymentStatus: 'Paid',
  });

  const sessAaravUpcoming = await Session.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    serviceName: 'Individual Therapy Consultation',
    date: tomorrow,
    startTime: '10:00',
    endTime: '10:50',
    duration: 50,
    status: 'Upcoming',
    fee: 1500,
    paymentStatus: 'Paid',
  });

  await Session.create({
    therapistId: therapist._id,
    clientId: clientPriya._id,
    serviceName: 'Individual Therapy Consultation',
    date: past3,
    startTime: '15:00',
    endTime: '15:50',
    duration: 50,
    status: 'Completed',
    fee: 1500,
    paymentStatus: 'Paid',
  });

  await Session.create({
    therapistId: therapist._id,
    clientId: clientPriya._id,
    serviceName: 'Individual Therapy Consultation',
    date: past2,
    startTime: '15:00',
    endTime: '15:50',
    duration: 50,
    status: 'No-show',
    fee: 1500,
    paymentStatus: 'Pending',
  });

  await Session.create({
    therapistId: therapist._id,
    clientId: clientPriya._id,
    serviceName: 'Individual Therapy Consultation',
    date: past1,
    startTime: '15:00',
    endTime: '15:50',
    duration: 50,
    status: 'Cancelled',
    cancellationReason: 'Cancelled 2 hours before session due to sudden schedule change.',
    fee: 1500,
    paymentStatus: 'Pending',
  });

  await Session.create({
    therapistId: therapist._id,
    clientId: clientPriya._id,
    serviceName: 'Individual Therapy Consultation',
    date: dayAfter,
    startTime: '15:00',
    endTime: '15:50',
    duration: 50,
    status: 'Upcoming',
    fee: 1500,
    paymentStatus: 'Pending',
  });

  await Session.create({
    therapistId: therapist._id,
    clientId: clientRohan._id,
    serviceName: 'Individual Therapy Consultation',
    date: todayStr,
    startTime: '16:00',
    endTime: '16:50',
    duration: 50,
    status: 'Upcoming',
    fee: 1350,
    paymentStatus: 'PackageCredit',
  });

  console.log('🌱 Seeding Payments & Invoices...');
  const pay1 = await Payment.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    appointmentId: sessAarav1._id,
    amount: 1500,
    paymentStatus: 'Successful',
    orderId: 'order_test_99101',
    transactionId: 'pay_test_aarav_001',
    paymentMethod: 'UPI (Google Pay)',
    invoiceNumber: 'INV-2026-001042',
    paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  });
  sessAarav1.paymentId = pay1._id;
  await sessAarav1.save();

  const pay2 = await Payment.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    appointmentId: sessAarav2._id,
    amount: 1500,
    paymentStatus: 'Successful',
    orderId: 'order_test_99102',
    transactionId: 'pay_test_aarav_002',
    paymentMethod: 'UPI (PhonePe)',
    invoiceNumber: 'INV-2026-001043',
    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  });
  sessAarav2.paymentId = pay2._id;
  await sessAarav2.save();

  const pay3 = await Payment.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    appointmentId: sessAaravUpcoming._id,
    amount: 1500,
    paymentStatus: 'Successful',
    orderId: 'order_test_99103',
    transactionId: 'pay_test_aarav_003',
    paymentMethod: 'HDFC NetBanking',
    invoiceNumber: 'INV-2026-001044',
    paidAt: new Date(),
  });
  sessAaravUpcoming.paymentId = pay3._id;
  await sessAaravUpcoming.save();

  console.log('🌱 Seeding Clinical Notes (SOAP, DAP, Private vs Shared)...');
  await SessionNote.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    sessionId: sessAarav1._id,
    title: 'Session 1: Initial Assessment & Cognitive Conceptualization',
    noteType: 'private',
    templateType: 'soap',
    soap: {
      subjective: 'Client reports feeling overwhelmed by senior management expectations. Sleeps 4-5 hours irregularly. Reports feeling like an imposter.',
      objective: 'Client was well-groomed, attentive, speech coherent and goal-directed. Mild motor restlessness observed in hands when discussing deadlines.',
      assessment: 'Generalized Anxiety symptoms triggered primarily by distorted cognitive appraisals (catastrophizing work evaluations).',
      plan: '1. Psychoeducation on anxiety loop. 2. Introduced ABC cognitive restructuring model. 3. Assigned daily thought log.',
    },
    riskAssessment: {
      suicidalIdeation: false,
      selfHarm: false,
      riskNotes: 'No signs of self-harm or hopelessness.',
    },
  });

  await SessionNote.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    sessionId: sessAarav2._id,
    title: 'Therapeutic Takeaways: Setting Healthy Work Boundaries',
    noteType: 'shared',
    templateType: 'freeform',
    content: 'Key focus from today: Remember the 5-4-3-2-1 grounding exercise when feeling overwhelmed. Before responding to urgent after-hours emails, take 3 deep diaphragmatic breaths and assess if the matter truly requires immediate resolution.',
  });

  await SessionNote.create({
    therapistId: therapist._id,
    clientId: clientPriya._id,
    title: 'Behavioral Activation & Attendance Review',
    noteType: 'private',
    templateType: 'dap',
    dap: {
      data: 'Client attended 1 of 3 scheduled sessions. Expressed feelings of lethargy and avoidance behavior during the week.',
      assessment: 'Avoidance appears to be a defense mechanism against feared emotional vulnerability. High risk for drop-out without active re-engagement.',
      plan: 'Adjust reminder cadence. Send supportive WhatsApp check-in 24 hours in advance. Break behavioral tasks into micro-steps.',
    },
  });

  console.log('🌱 Seeding Mood Tracker Entries...');
  const moodEntries = [
    { mood: 'Happy', energyLevel: 4, note: 'Had a productive morning and kept boundary with work emails.', daysAgo: 1 },
    { mood: 'Okay', energyLevel: 3, note: 'Routine day, did 10 minutes of box breathing.', daysAgo: 2 },
    { mood: 'Stressed', energyLevel: 2, note: 'Tense meeting with VP, felt heart racing.', daysAgo: 3 },
    { mood: 'Okay', energyLevel: 3, note: 'Went for an evening walk, helped clear my head.', daysAgo: 4 },
    { mood: 'Sad', energyLevel: 2, note: 'Felt unmotivated and tired throughout the afternoon.', daysAgo: 5 },
    { mood: 'Happy', energyLevel: 5, note: 'Spent weekend with family in nature, feeling recharged.', daysAgo: 6 },
    { mood: 'Okay', energyLevel: 3, note: 'Back to the work week, feeling composed.', daysAgo: 7 },
  ];

  for (const entry of moodEntries) {
    const entryDate = new Date(Date.now() - entry.daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await Mood.create({
      clientId: clientAarav._id,
      therapistId: therapist._id,
      mood: entry.mood,
      energyLevel: entry.energyLevel,
      note: entry.note,
      date: entryDate,
    });
  }

  console.log('🌱 Seeding Reflective Homework...');
  await Homework.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    title: 'Cognitive Thought Record & Boundary Journal',
    description: 'Whenever you notice an acute surge in anxiety (level > 6/10), pause and record the Automatic Thought, the Evidence For/Against it, and an Alternative Balanced Perspective.',
    dueDate: tomorrow,
    status: 'Pending',
    resources: [
      {
        title: 'CBT Thought Record Worksheet (PDF)',
        type: 'PDF',
        url: 'https://www.psychologytools.com/resource/thought-record/',
        description: 'Standard 5-column cognitive restructuring form.',
      },
      {
        title: 'Box Breathing Guided Exercise (Audio)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=tEmt1Znux58',
        description: '4-4-4-4 diaphragmatic calming technique.',
      },
    ],
  });

  await Homework.create({
    therapistId: therapist._id,
    clientId: clientAarav._id,
    title: 'Daily Sleep Hygiene Checklist',
    description: 'Turn off blue-light screens 45 minutes before sleep. Practice progressive muscle relaxation in bed.',
    dueDate: past1,
    status: 'Completed',
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    clientReflection: 'Following the sleep routine really helped me fall asleep faster without ruminating on my to-do list.',
    resources: [],
  });

  console.log('🌱 Seeding In-App Notifications...');
  await Notification.create({
    recipientId: therapist._id,
    recipientRole: 'therapist',
    type: 'BookingConfirmation',
    title: 'Upcoming Session Confirmed',
    message: 'Aarav Patel has an upcoming session tomorrow at 10:00 AM.',
    link: '/appointments',
    read: false,
  });

  await Notification.create({
    recipientId: therapist._id,
    recipientRole: 'therapist',
    type: 'PaymentConfirmation',
    title: 'Payment Received: ₹1,500',
    message: 'Payment received from Aarav Patel for Consultation (INV-2026-001044).',
    link: '/payments',
    read: true,
  });

  console.log('🌱 Seeding Real-Time Messages...');
  await Message.create({
    senderId: clientAarav._id,
    senderRole: 'client',
    receiverId: therapist._id,
    receiverRole: 'therapist',
    therapistId: therapist._id,
    clientId: clientAarav._id,
    message: 'Hello Dr. Sharma, I have submitted my thought log for this week. Looking forward to our session tomorrow.',
    readStatus: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  });

  await Message.create({
    senderId: therapist._id,
    senderRole: 'therapist',
    receiverId: clientAarav._id,
    receiverRole: 'client',
    therapistId: therapist._id,
    clientId: clientAarav._id,
    message: 'Wonderful work, Aarav! I reviewed your notes and we will discuss the boundary-setting exercise in detail tomorrow at 10:00 AM.',
    readStatus: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  });

  console.log('✅ DATABASE SEEDING COMPLETED');
};

const seedIfEmpty = async () => {
  const count = await Therapist.countDocuments();
  if (count === 0) {
    console.log('⚡ Empty database detected. Auto-seeding starter demo practice...');
    await seedData(false);
  }
};

// If run directly from terminal
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedData(true);
    await disconnectDB();
    process.exit(0);
  })();
}

module.exports = { seedData, seedIfEmpty };
