
import { useState } from "react";
import { 
  ArrowDownToLine, 
  Calendar, 
  CreditCard, 
  Filter, 
  Plus, 
  Search 
} from "lucide-react";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { StudentDetail } from "@/types/payment";
import { Progress } from "@/components/ui/progress";

// Sample students with payment data
const sampleStudents: StudentDetail[] = [
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
    placementStatus: "searching",
    location: "New York",
    leadSource: "Website",
    scc: "NYC001",
    market: "US East",
    year: 2023,
    month: 8,
    mode: "Online",
    module: "Full Stack Python",
    status: "active",
    quoted: 3500,
    dateExpected: "2023-09-01",
    expectedMonth: "Sep-23",
    totalCollected: 2000,
    balance: 1500,
    comments: "Student requesting extension for final payment",
    financials: {
      id: "FIN001",
      studentId: "S001",
      totalFee: 3500,
      totalPaid: 2000,
      balance: 1500,
      nextPaymentDate: "2023-10-15",
      paymentTerms: "Monthly installments of $500",
      schedules: [
        { id: "SCH001", studentId: "S001", dueDate: "2023-08-15", amount: 1000, status: "paid", actualPaymentDate: "2023-08-15", paymentId: "PAY001" },
        { id: "SCH002", studentId: "S001", dueDate: "2023-09-15", amount: 500, status: "paid", actualPaymentDate: "2023-09-16", paymentId: "PAY002" },
        { id: "SCH003", studentId: "S001", dueDate: "2023-10-15", amount: 500, status: "paid", actualPaymentDate: "2023-10-14", paymentId: "PAY003" },
        { id: "SCH004", studentId: "S001", dueDate: "2023-11-15", amount: 500, status: "pending" },
        { id: "SCH005", studentId: "S001", dueDate: "2023-12-15", amount: 500, status: "pending" },
        { id: "SCH006", studentId: "S001", dueDate: "2024-01-15", amount: 500, status: "pending" }
      ],
      payments: [
        { id: "PAY001", studentId: "S001", amount: 1000, date: "2023-08-15", paymentMethod: "Credit Card", reference: "CC-98765" },
        { id: "PAY002", studentId: "S001", amount: 500, date: "2023-09-16", paymentMethod: "Bank Transfer", reference: "BT-12345" },
        { id: "PAY003", studentId: "S001", amount: 500, date: "2023-10-14", paymentMethod: "Credit Card", reference: "CC-54321" }
      ]
    }
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
    placementStatus: "searching",
    location: "Chicago",
    leadSource: "Social Media",
    scc: "CHI002",
    market: "US Central",
    year: 2023,
    month: 7,
    mode: "Hybrid",
    module: "Data Science",
    status: "active",
    quoted: 4000,
    dateExpected: "2023-07-15",
    expectedMonth: "Jul-23",
    totalCollected: 3000,
    balance: 1000,
    financials: {
      id: "FIN002",
      studentId: "S002",
      totalFee: 4000,
      totalPaid: 3000,
      balance: 1000,
      nextPaymentDate: "2023-11-10",
      paymentTerms: "Initial payment + 5 installments",
      schedules: [
        { id: "SCH007", studentId: "S002", dueDate: "2023-07-15", amount: 1500, status: "paid", actualPaymentDate: "2023-07-15", paymentId: "PAY004" },
        { id: "SCH008", studentId: "S002", dueDate: "2023-08-15", amount: 500, status: "paid", actualPaymentDate: "2023-08-14", paymentId: "PAY005" },
        { id: "SCH009", studentId: "S002", dueDate: "2023-09-15", amount: 500, status: "paid", actualPaymentDate: "2023-09-15", paymentId: "PAY006" },
        { id: "SCH010", studentId: "S002", dueDate: "2023-10-15", amount: 500, status: "paid", actualPaymentDate: "2023-10-16", paymentId: "PAY007" },
        { id: "SCH011", studentId: "S002", dueDate: "2023-11-15", amount: 500, status: "pending" },
        { id: "SCH012", studentId: "S002", dueDate: "2023-12-15", amount: 500, status: "pending" }
      ],
      payments: [
        { id: "PAY004", studentId: "S002", amount: 1500, date: "2023-07-15", paymentMethod: "Credit Card", reference: "CC-12345" },
        { id: "PAY005", studentId: "S002", amount: 500, date: "2023-08-14", paymentMethod: "Credit Card", reference: "CC-23456" },
        { id: "PAY006", studentId: "S002", amount: 500, date: "2023-09-15", paymentMethod: "Bank Transfer", reference: "BT-34567" },
        { id: "PAY007", studentId: "S002", amount: 500, date: "2023-10-16", paymentMethod: "Bank Transfer", reference: "BT-45678" }
      ]
    }
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
    placementStatus: "placed",
    location: "San Francisco",
    leadSource: "Referral",
    scc: "SF003",
    market: "US West",
    year: 2023,
    month: 9,
    mode: "Online",
    module: "Frontend Development",
    status: "active",
    quoted: 3000,
    dateExpected: "2023-09-05",
    expectedMonth: "Sep-23",
    totalCollected: 3000,
    balance: 0,
    financials: {
      id: "FIN003",
      studentId: "S003",
      totalFee: 3000,
      totalPaid: 3000,
      balance: 0,
      paymentTerms: "Full payment",
      schedules: [
        { id: "SCH013", studentId: "S003", dueDate: "2023-09-05", amount: 3000, status: "paid", actualPaymentDate: "2023-09-05", paymentId: "PAY008" }
      ],
      payments: [
        { id: "PAY008", studentId: "S003", amount: 3000, date: "2023-09-05", paymentMethod: "Bank Transfer", reference: "BT-56789" }
      ]
    }
  }
];

const PaymentProgressBar = ({ paid, total }: { paid: number, total: number }) => {
  const progress = Math.round((paid / total) * 100);
  
  const getColor = () => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>${paid} of ${total}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const getNextPaymentDate = (student: StudentDetail) => {
  const pendingPayments = student.financials.schedules.filter(s => s.status === 'pending');
  if (pendingPayments.length === 0) return "Fully Paid";
  return new Date(pendingPayments[0].dueDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const Payments = () => {
  const [filterView, setFilterView] = useState<"all" | "pending" | "paid">("all");
  
  const filteredStudents = filterView === "all" 
    ? sampleStudents 
    : filterView === "paid" 
      ? sampleStudents.filter(s => s.financials.balance === 0)
      : sampleStudents.filter(s => s.financials.balance > 0);
  
  const columns = [
    {
      header: "Student",
      accessor: (row: StudentDetail) => (
        <Link to={`/students/${row.id}`} className="hover:underline">
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </Link>
      ),
    },
    {
      header: "Batch & Course",
      accessor: (row: StudentDetail) => (
        <div>
          <p className="font-medium">{row.batch}</p>
          <p className="text-xs text-muted-foreground">{row.course}</p>
        </div>
      ),
    },
    {
      header: "Payment Progress",
      accessor: (row: StudentDetail) => (
        <PaymentProgressBar 
          paid={row.financials.totalPaid} 
          total={row.financials.totalFee} 
        />
      ),
    },
    {
      header: "Total Fee",
      accessor: (row: StudentDetail) => `$${row.financials.totalFee.toLocaleString()}`,
    },
    {
      header: "Balance",
      accessor: (row: StudentDetail) => (
        <span className={row.financials.balance === 0 ? "text-green-600 font-medium" : "font-medium"}>
          ${row.financials.balance.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Next Payment",
      accessor: (row: StudentDetail) => getNextPaymentDate(row),
    },
    {
      header: "Actions",
      accessor: (row: StudentDetail) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/students/${row.id}`}>
              View
            </Link>
          </Button>
          {row.financials.balance > 0 && (
            <Button size="sm">
              <CreditCard size={16} className="mr-2" />
              Pay
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Manage student payment records and schedules
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowDownToLine size={18} />
              Export
            </Button>
            <Button className="bg-primary text-white flex items-center gap-2">
              <Plus size={18} />
              Record Payment
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterView === "all" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilterView("all")}
              >
                All Payments
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterView === "pending" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilterView("pending")}
              >
                Pending Payments
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterView === "paid" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilterView("paid")}
              >
                Fully Paid
              </button>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
              <button className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredStudents}
            searchable
            searchKeys={["name", "email", "batch", "course"]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
