
import { Calendar, Clock, Users } from "lucide-react";
import DataTable from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";
import { Column } from "../shared/DataTable.d";

// Define the batch data type
interface Batch {
  id: string;
  name: string;
  course: string;
  trainer: string;
  startDate: string;
  endDate: string;
  students: number;
  progress: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
}

// Sample data
const sampleBatches: Batch[] = [
  {
    id: "B001",
    name: "Python Full Stack - Batch 23",
    course: "Python Full Stack Development",
    trainer: "John Smith",
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    students: 25,
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
    students: 18,
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
    students: 30,
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
    students: 15,
    progress: 0,
    status: "upcoming",
  },
];

// Format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Status badge component
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

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => {
  const getColor = () => {
    if (progress < 30) return "bg-blue-500";
    if (progress < 70) return "bg-amber-500";
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

const BatchTable = () => {
  const columns: Column<Batch>[] = [
    {
      header: "Batch Name",
      accessor: "name" as keyof Batch,
      className: "font-medium",
    },
    {
      header: "Trainer",
      accessor: "trainer" as keyof Batch,
    },
    {
      header: "Students",
      accessor: (row: Batch) => (
        <div className="flex items-center">
          <Users size={16} className="mr-2 text-muted-foreground" />
          <span>{row.students}</span>
        </div>
      ),
    },
    {
      header: "Timeline",
      accessor: (row: Batch) => (
        <div className="flex flex-col">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(row.startDate)} - {formatDate(row.endDate)}</span>
          </div>
          <ProgressBar progress={row.progress} />
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: Batch) => <StatusComponent status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Current Batches</h2>
        <button className="text-primary hover:underline text-sm flex items-center">
          View All <Clock className="ml-1" size={14} />
        </button>
      </div>
      <DataTable
        columns={columns}
        data={sampleBatches}
        searchable
        searchKeys={["name" as keyof Batch, "trainer" as keyof Batch, "course" as keyof Batch]}
      />
    </div>
  );
};

export default BatchTable;
