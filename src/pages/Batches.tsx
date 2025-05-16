import { 
  Calendar, 
  ChevronDown, 
  Clock, 
  Plus, 
  User,
  Users
} from "lucide-react";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import StatusBadge from "../components/shared/StatusBadge";

interface Batch {
  id: string;
  name: string;
  course: string;
  trainer: string;
  startDate: string;
  endDate: string;
  time: string;
  students: number;
  maxCapacity: number;
  progress: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
}

const sampleBatches: Batch[] = [
  {
    id: "B001",
    name: "Python Full Stack - Batch 23",
    course: "Python Full Stack Development",
    trainer: "John Smith",
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    time: "9:00 AM - 12:00 PM",
    students: 25,
    maxCapacity: 30,
    progress: 65,
    status: "active",
  },
  {
    id: "B002",
    name: "Data Science - Batch 14",
    course: "Data Science & Machine Learning",
    trainer: "Sarah Johnson",
    startDate: "2023-11-05",
    endDate: "2024-02-05",
    time: "2:00 PM - 5:00 PM",
    students: 18,
    maxCapacity: 25,
    progress: 42,
    status: "active",
  },
  {
    id: "B003",
    name: "Web Development - Batch 31",
    course: "Modern Web Development",
    trainer: "Michael Chen",
    startDate: "2023-09-01",
    endDate: "2023-12-01",
    time: "10:00 AM - 1:00 PM",
    students: 30,
    maxCapacity: 30,
    progress: 100,
    status: "completed",
  },
  {
    id: "B004",
    name: "DevOps - Batch 8",
    course: "DevOps & Cloud Computing",
    trainer: "Priya Patel",
    startDate: "2023-12-10",
    endDate: "2024-03-10",
    time: "1:00 PM - 4:00 PM",
    students: 15,
    maxCapacity: 20,
    progress: 0,
    status: "upcoming",
  },
  {
    id: "B005",
    name: "UI/UX Design - Batch 5",
    course: "User Interface & Experience Design",
    trainer: "David Wilson",
    startDate: "2023-08-15",
    endDate: "2023-11-15",
    time: "9:00 AM - 12:00 PM",
    students: 20,
    maxCapacity: 20,
    progress: 100,
    status: "completed",
  },
];

const StatusComponent = ({ status }: { status: Batch['status'] }) => {
  const statusConfig = {
    active: { status: "success", text: "Active" },
    upcoming: { status: "info", text: "Upcoming" },
    completed: { status: "default", text: "Completed" },
    cancelled: { status: "error", text: "Cancelled" },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const ProgressBar = ({ progress, showText = true }: { progress: number, showText?: boolean }) => {
  const getColor = () => {
    if (progress < 30) return "bg-blue-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };
  
  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
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

const Batches = () => {
  const columns = [
    {
      header: "Batch Details",
      accessor: (row: Batch) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.course}</p>
        </div>
      ),
    },
    {
      header: "Trainer",
      accessor: "trainer" as keyof Batch,
    },
    {
      header: "Schedule",
      accessor: (row: Batch) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Calendar size={14} className="mr-1 text-muted-foreground" />
            <span>{formatDate(row.startDate)} - {formatDate(row.endDate)}</span>
          </div>
          <div className="flex items-center text-xs">
            <Clock size={14} className="mr-1 text-muted-foreground" />
            <span>{row.time}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Students",
      accessor: (row: Batch) => (
        <div className="flex items-center">
          <Users size={16} className="mr-2 text-muted-foreground" />
          <span>{row.students}/{row.maxCapacity}</span>
        </div>
      ),
    },
    {
      header: "Progress",
      accessor: (row: Batch) => (
        <ProgressBar progress={row.progress} />
      ),
    },
    {
      header: "Status",
      accessor: (row: Batch) => (
        <StatusComponent status={row.status} />
      ),
    },
    {
      header: "",
      accessor: () => (
        <button className="p-1 rounded-md hover:bg-muted transition-colors">
          <ChevronDown size={18} />
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Batches</h1>
            <p className="text-muted-foreground mt-1">
              Manage training batches and schedules
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} className="mr-2" />
            New Batch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-xl p-6 flex items-center card-transition">
            <div className="rounded-full bg-green-100 p-3 mr-4 text-green-700">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Batches</p>
              <p className="text-2xl font-semibold">14</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6 flex items-center card-transition">
            <div className="rounded-full bg-blue-100 p-3 mr-4 text-blue-700">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Batches</p>
              <p className="text-2xl font-semibold">5</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6 flex items-center card-transition">
            <div className="rounded-full bg-amber-100 p-3 mr-4 text-amber-700">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-semibold">234</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6 flex items-center card-transition">
            <div className="rounded-full bg-purple-100 p-3 mr-4 text-purple-700">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trainers Assigned</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">All Batches</h2>
          <DataTable
            columns={columns}
            data={sampleBatches}
            searchable
            searchKeys={["name" as keyof Batch, "course" as keyof Batch, "trainer" as keyof Batch]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Batches;
