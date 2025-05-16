
import { StudentDetail, Payment, PaymentSchedule, StudentFinancials, PaymentStatus, StudentStatus, LeadSource, TrainingMode } from '@/types/payment';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface EducationTrackerDB extends DBSchema {
  students: {
    key: string;
    value: Omit<StudentDetail, 'financials'>;
  };
  student_financials: {
    key: string;
    value: Omit<StudentFinancials, 'schedules' | 'payments'>;
    indexes: { 'by-student': string };
  };
  payment_schedules: {
    key: string;
    value: PaymentSchedule;
    indexes: { 'by-student': string };
  };
  payments: {
    key: string;
    value: Payment;
    indexes: { 'by-student': string };
  };
}

let dbInstance: IDBPDatabase<EducationTrackerDB> | null = null;

const dbPromise = openDB<EducationTrackerDB>('education-tracker', 1, {
  upgrade(db) {
    // Create stores
    if (!db.objectStoreNames.contains('students')) {
      db.createObjectStore('students', { keyPath: 'id' });
    }
    
    if (!db.objectStoreNames.contains('student_financials')) {
      const store = db.createObjectStore('student_financials', { keyPath: 'id' });
      store.createIndex('by-student', 'studentId');
    }
    
    if (!db.objectStoreNames.contains('payment_schedules')) {
      const store = db.createObjectStore('payment_schedules', { keyPath: 'id' });
      store.createIndex('by-student', 'studentId');
    }
    
    if (!db.objectStoreNames.contains('payments')) {
      const store = db.createObjectStore('payments', { keyPath: 'id' });
      store.createIndex('by-student', 'studentId');
    }
    
    console.log('Database schema created');
  }
});

// Get a database instance and cache it
const getDB = async (): Promise<IDBPDatabase<EducationTrackerDB>> => {
  if (dbInstance) return dbInstance;
  dbInstance = await dbPromise;
  return dbInstance;
};

// Seed sample data
const seedDatabase = async () => {
  const db = await getDB();
  const tx = db.transaction(['students', 'student_financials', 'payment_schedules', 'payments'], 'readwrite');
  
  // Clear existing data
  await tx.objectStore('payment_schedules').clear();
  await tx.objectStore('payments').clear();
  await tx.objectStore('student_financials').clear();
  await tx.objectStore('students').clear();

  // Sample students
  const sampleStudents = [
    {
      id: "S001",
      name: "Alex Johnson",
      email: "alex.j@example.com",
      phone: "+1 555-1234",
      joinDate: "2023-08-15",
      batch: "Python Batch 23",
      course: "Python Full Stack Development",
      attendance: 92,
      progress: 78,
      placementStatus: "searching" as const,
      location: "New York",
      leadSource: "Website" as LeadSource,
      scc: "NYC001",
      market: "US East",
      year: 2023,
      month: 8,
      mode: "Online" as TrainingMode,
      module: "Full Stack Python",
      status: "active" as StudentStatus,
      quoted: 3500,
      dateExpected: "2023-09-01",
      expectedMonth: "Sep-23",
      totalCollected: 2000,
      balance: 1500,
      comments: "Student requesting extension for final payment"
    },
    {
      id: "S002",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "+1 555-2345",
      joinDate: "2023-07-10",
      batch: "Data Science Batch 14",
      course: "Data Science & Machine Learning",
      attendance: 85,
      progress: 65,
      placementStatus: "searching" as const,
      location: "Chicago",
      leadSource: "Social Media" as LeadSource,
      scc: "CHI002",
      market: "US Central",
      year: 2023,
      month: 7,
      mode: "Hybrid" as TrainingMode,
      module: "Data Science",
      status: "active" as StudentStatus,
      quoted: 4000,
      dateExpected: "2023-07-15",
      expectedMonth: "Jul-23",
      totalCollected: 3000,
      balance: 1000,
      comments: null
    },
    {
      id: "S003",
      name: "Ryan Martinez",
      email: "ryan.m@example.com",
      phone: "+1 555-3456",
      joinDate: "2023-09-01",
      batch: "Web Dev Batch 31",
      course: "Modern Web Development",
      attendance: 98,
      progress: 92,
      placementStatus: "placed" as const,
      location: "San Francisco",
      leadSource: "Referral" as LeadSource,
      scc: "SF003",
      market: "US West",
      year: 2023,
      month: 9,
      mode: "Online" as TrainingMode,
      module: "Frontend Development",
      status: "active" as StudentStatus,
      quoted: 3000,
      dateExpected: "2023-09-05",
      expectedMonth: "Sep-23",
      totalCollected: 3000,
      balance: 0,
      comments: null
    }
  ];

  for (const student of sampleStudents) {
    await tx.objectStore('students').put(student);
    
    // Student 1 financials
    if (student.id === "S001") {
      await tx.objectStore('student_financials').put({
        id: "FIN001",
        studentId: "S001",
        totalFee: 3500,
        totalPaid: 2000,
        balance: 1500,
        nextPaymentDate: "2023-10-15",
        paymentTerms: "Monthly installments of $500"
      });

      // Payment schedules
      const schedules = [
        { id: "SCH001", studentId: "S001", dueDate: "2023-08-15", amount: 1000, status: "paid" as PaymentStatus, actualPaymentDate: "2023-08-15", paymentId: "PAY001" },
        { id: "SCH002", studentId: "S001", dueDate: "2023-09-15", amount: 500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-09-16", paymentId: "PAY002" },
        { id: "SCH003", studentId: "S001", dueDate: "2023-10-15", amount: 500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-10-14", paymentId: "PAY003" },
        { id: "SCH004", studentId: "S001", dueDate: "2023-11-15", amount: 500, status: "pending" as PaymentStatus, actualPaymentDate: null, paymentId: null },
        { id: "SCH005", studentId: "S001", dueDate: "2023-12-15", amount: 500, status: "pending" as PaymentStatus, actualPaymentDate: null, paymentId: null },
        { id: "SCH006", studentId: "S001", dueDate: "2024-01-15", amount: 500, status: "pending" as PaymentStatus, actualPaymentDate: null, paymentId: null }
      ];
      
      for (const schedule of schedules) {
        await tx.objectStore('payment_schedules').put(schedule);
      }

      // Payments
      const payments = [
        { id: "PAY001", studentId: "S001", amount: 1000, date: "2023-08-15", paymentMethod: "Credit Card", reference: "CC-98765", notes: null },
        { id: "PAY002", studentId: "S001", amount: 500, date: "2023-09-16", paymentMethod: "Bank Transfer", reference: "BT-12345", notes: null },
        { id: "PAY003", studentId: "S001", amount: 500, date: "2023-10-14", paymentMethod: "Credit Card", reference: "CC-54321", notes: null }
      ];
      
      for (const payment of payments) {
        await tx.objectStore('payments').put(payment);
      }
    }

    // Student 2 financials
    if (student.id === "S002") {
      await tx.objectStore('student_financials').put({
        id: "FIN002",
        studentId: "S002",
        totalFee: 4000,
        totalPaid: 3000,
        balance: 1000,
        nextPaymentDate: "2023-11-10",
        paymentTerms: "Initial payment + 5 installments"
      });

      // Payment schedules
      const schedules = [
        { id: "SCH007", studentId: "S002", dueDate: "2023-07-15", amount: 1500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-07-15", paymentId: "PAY004" },
        { id: "SCH008", studentId: "S002", dueDate: "2023-08-15", amount: 500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-08-14", paymentId: "PAY005" },
        { id: "SCH009", studentId: "S002", dueDate: "2023-09-15", amount: 500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-09-15", paymentId: "PAY006" },
        { id: "SCH010", studentId: "S002", dueDate: "2023-10-15", amount: 500, status: "paid" as PaymentStatus, actualPaymentDate: "2023-10-16", paymentId: "PAY007" },
        { id: "SCH011", studentId: "S002", dueDate: "2023-11-15", amount: 500, status: "pending" as PaymentStatus, actualPaymentDate: null, paymentId: null },
        { id: "SCH012", studentId: "S002", dueDate: "2023-12-15", amount: 500, status: "pending" as PaymentStatus, actualPaymentDate: null, paymentId: null }
      ];
      
      for (const schedule of schedules) {
        await tx.objectStore('payment_schedules').put(schedule);
      }

      // Payments
      const payments = [
        { id: "PAY004", studentId: "S002", amount: 1500, date: "2023-07-15", paymentMethod: "Credit Card", reference: "CC-12345", notes: null },
        { id: "PAY005", studentId: "S002", amount: 500, date: "2023-08-14", paymentMethod: "Credit Card", reference: "CC-23456", notes: null },
        { id: "PAY006", studentId: "S002", amount: 500, date: "2023-09-15", paymentMethod: "Bank Transfer", reference: "BT-34567", notes: null },
        { id: "PAY007", studentId: "S002", amount: 500, date: "2023-10-16", paymentMethod: "Bank Transfer", reference: "BT-45678", notes: null }
      ];
      
      for (const payment of payments) {
        await tx.objectStore('payments').put(payment);
      }
    }

    // Student 3 financials
    if (student.id === "S003") {
      await tx.objectStore('student_financials').put({
        id: "FIN003",
        studentId: "S003",
        totalFee: 3000,
        totalPaid: 3000,
        balance: 0,
        nextPaymentDate: null,
        paymentTerms: "Full payment"
      });

      // Payment schedules
      await tx.objectStore('payment_schedules').put({
        id: "SCH013",
        studentId: "S003",
        dueDate: "2023-09-05",
        amount: 3000,
        status: "paid" as PaymentStatus,
        actualPaymentDate: "2023-09-05",
        paymentId: "PAY008"
      });

      // Payments
      await tx.objectStore('payments').put({
        id: "PAY008",
        studentId: "S003",
        amount: 3000,
        date: "2023-09-05",
        paymentMethod: "Bank Transfer",
        reference: "BT-56789",
        notes: null
      });
    }
  }

  await tx.done;
  console.log('Database seeded with sample data');
};

// Initialize database
(async () => {
  try {
    const db = await getDB();
    const numStudents = await db.count('students');
    
    if (numStudents === 0) {
      await seedDatabase();
    } else {
      console.log('Database already contains data, skipping seed');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();

// CRUD Operations
// Students
const getAllStudents = async (): Promise<StudentDetail[]> => {
  const db = await getDB();
  const students = await db.getAll('students');
  
  const result: StudentDetail[] = [];
  
  for (const student of students) {
    const financials = await db.getFromIndex('student_financials', 'by-student', student.id);
    const schedules = await db.getAllFromIndex('payment_schedules', 'by-student', student.id);
    const payments = await db.getAllFromIndex('payments', 'by-student', student.id);
    
    result.push({
      ...student,
      financials: {
        ...financials,
        schedules,
        payments
      }
    });
  }
  
  return result;
};

const getStudentById = async (id: string): Promise<StudentDetail | null> => {
  const db = await getDB();
  const student = await db.get('students', id);
  
  if (!student) return null;
  
  const financials = await db.getFromIndex('student_financials', 'by-student', id);
  const schedules = await db.getAllFromIndex('payment_schedules', 'by-student', id);
  const payments = await db.getAllFromIndex('payments', 'by-student', id);
  
  return {
    ...student,
    financials: {
      ...financials,
      schedules,
      payments
    }
  };
};

// Add new student with financials
const addStudent = async (student: Omit<StudentDetail, 'financials'> & { financials: Omit<StudentFinancials, 'schedules' | 'payments'> }, schedules: Omit<PaymentSchedule, 'id'>[], payments: Omit<Payment, 'id'>[]) => {
  const db = await getDB();
  const tx = db.transaction(['students', 'student_financials', 'payment_schedules', 'payments'], 'readwrite');
  
  // Insert student
  await tx.objectStore('students').put(student);
  
  // Insert financials
  await tx.objectStore('student_financials').put({
    ...student.financials,
    studentId: student.id
  });
  
  // Insert payment schedules
  for (let i = 0; i < schedules.length; i++) {
    const schedule = schedules[i];
    const scheduleId = `SCH${Date.now()}${i}`;
    
    await tx.objectStore('payment_schedules').put({
      id: scheduleId,
      ...schedule,
      studentId: student.id
    });
  }
  
  // Insert payments
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    const paymentId = `PAY${Date.now()}${i}`;
    
    await tx.objectStore('payments').put({
      id: paymentId,
      ...payment,
      studentId: student.id
    });
  }
  
  await tx.done;
  return getStudentById(student.id);
};

// Update student
const updateStudent = async (id: string, updates: Partial<Omit<StudentDetail, 'id' | 'financials'>>) => {
  const db = await getDB();
  const student = await db.get('students', id);
  
  if (!student) return null;
  
  const updatedStudent = {
    ...student,
    ...updates
  };
  
  await db.put('students', updatedStudent);
  return getStudentById(id);
};

// Update student financials
const updateStudentFinancials = async (id: string, updates: Partial<Omit<StudentFinancials, 'id' | 'studentId' | 'schedules' | 'payments'>>) => {
  const db = await getDB();
  const financials = await db.getFromIndex('student_financials', 'by-student', id);
  
  if (!financials) return null;
  
  const updatedFinancials = {
    ...financials,
    ...updates
  };
  
  await db.put('student_financials', updatedFinancials);
  return getStudentById(id);
};

// Add payment
const addPayment = async (payment: Omit<Payment, 'id'>) => {
  const db = await getDB();
  const tx = db.transaction(['payments', 'student_financials', 'payment_schedules', 'students'], 'readwrite');
  
  // Generate payment ID
  const paymentId = `PAY${Date.now()}`;
  const fullPayment = {
    id: paymentId,
    ...payment
  };
  
  // Insert payment
  await tx.objectStore('payments').put(fullPayment);
  
  // Update student financials
  const studentFinancialsStore = tx.objectStore('student_financials');
  const financials = await db.getFromIndex('student_financials', 'by-student', payment.studentId);
  
  if (financials) {
    await studentFinancialsStore.put({
      ...financials,
      totalPaid: financials.totalPaid + payment.amount,
      balance: financials.balance - payment.amount
    });
  }
  
  // Update payment schedule
  const paymentSchedulesStore = tx.objectStore('payment_schedules');
  const schedules = await db.getAllFromIndex('payment_schedules', 'by-student', payment.studentId);
  
  const pendingSchedule = schedules.find(s => s.status === 'pending');
  if (pendingSchedule) {
    await paymentSchedulesStore.put({
      ...pendingSchedule,
      status: 'paid' as PaymentStatus,
      actualPaymentDate: payment.date,
      paymentId
    });
  }
  
  // Update student total collected and balance
  const studentsStore = tx.objectStore('students');
  const student = await db.get('students', payment.studentId);
  if (student) {
    await studentsStore.put({
      ...student,
      totalCollected: student.totalCollected + payment.amount,
      balance: student.balance - payment.amount
    });
  }
  
  await tx.done;
  return fullPayment;
};

// Add payment schedule
const addPaymentSchedule = async (schedule: Omit<PaymentSchedule, 'id'>) => {
  const db = await getDB();
  const scheduleId = `SCH${Date.now()}`;
  
  const fullSchedule = {
    id: scheduleId,
    ...schedule
  };
  
  await db.put('payment_schedules', fullSchedule);
  return fullSchedule;
};

export default {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  updateStudentFinancials,
  addPayment,
  addPaymentSchedule
};
