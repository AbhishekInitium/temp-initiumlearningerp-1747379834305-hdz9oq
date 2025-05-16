
import { useState } from "react";
import { 
  Download, 
  Filter, 
  GraduationCap, 
  Mail, 
  Phone, 
  Plus, 
  Search, 
  UserPlus 
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import StatusBadge from "../components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  batch: string;
  course: string;
  attendance: number;
  progress: number;
  placementStatus: "placed" | "searching" | "not-started" | "opted-out";
}

const sampleStudents: Student[] = [
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
  },
  {
    id: "S004",
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    phone: "+1 555-4567",
    joinDate: "2023-08-22",
    batch: "DevOps Batch 8",
    course: "DevOps & Cloud Computing",
    attendance: 78,
    progress: 60,
    placementStatus: "not-started",
  },
  {
    id: "S005",
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    phone: "+1 555-5678",
    joinDate: "2023-09-12",
    batch: "Python Batch 23",
    course: "Python Full Stack Development",
    attendance: 95,
    progress: 85,
    placementStatus: "searching",
  },
];

const PlacementStatusComponent = ({ status }: { status: Student['placementStatus'] }) => {
  const statusConfig = {
    placed: { status: "success", text: "Placed" },
    searching: { status: "warning", text: "Searching" },
    "not-started": { status: "info", text: "Not Started" },
    "opted-out": { status: "default", text: "Opted Out" },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const ProgressBar = ({ progress }: { progress: number }) => {
  const getColor = () => {
    if (progress < 50) return "bg-amber-500";
    if (progress < 80) return "bg-blue-500";
    return "bg-green-500";
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${getColor()}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Students = () => {
  const [view, setView] = useState<"all" | "active" | "placed">("all");
  
  const filteredStudents = view === "all" 
    ? sampleStudents 
    : view === "placed" 
      ? sampleStudents.filter(s => s.placementStatus === "placed")
      : sampleStudents.filter(s => s.placementStatus !== "placed");
  
  const columns = [
    {
      header: "Student",
      accessor: (row: Student) => (
        <Link to={`/students/${row.id}`} className="hover:underline">
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </Link>
      ),
    },
    {
      header: "Contact",
      accessor: (row: Student) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-xs">
            <Phone size={14} className="mr-1 text-muted-foreground" />
            <span>{row.phone}</span>
          </div>
          <div className="flex items-center text-xs">
            <Mail size={14} className="mr-1 text-muted-foreground" />
            <button className="text-primary hover:underline">Email</button>
          </div>
        </div>
      ),
    },
    {
      header: "Batch & Course",
      accessor: (row: Student) => (
        <div>
          <p className="font-medium">{row.batch}</p>
          <p className="text-xs text-muted-foreground">{row.course}</p>
        </div>
      ),
    },
    {
      header: "Progress",
      accessor: (row: Student) => (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress: {row.progress}%</span>
            <span>Attendance: {row.attendance}%</span>
          </div>
          <ProgressBar progress={row.progress} />
        </div>
      ),
    },
    {
      header: "Join Date",
      accessor: (row: Student) => formatDate(row.joinDate),
    },
    {
      header: "Placement",
      accessor: (row: Student) => (
        <PlacementStatusComponent status={row.placementStatus} />
      ),
    },
    {
      header: "Actions",
      accessor: (row: Student) => (
        <Button asChild variant="outline" size="sm">
          <Link to={`/students/${row.id}`}>
            View Details
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage student records and track progress
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-primary/90 transition-colors">
            <UserPlus size={18} className="mr-2" />
            Add Student
          </button>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === "all" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setView("all")}
              >
                All Students
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === "active" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setView("active")}
              >
                Active
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === "placed" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setView("placed")}
              >
                Placed
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                <Filter size={18} />
              </button>
              <button className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                <Download size={18} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
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

export default Students;
