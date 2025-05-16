
import { useState } from "react";
import { 
  Calendar, 
  CalendarDays,
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Filter, 
  MapPin, 
  Plus, 
  Search, 
  X 
} from "lucide-react";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import StatusBadge from "../components/shared/StatusBadge";

interface Interview {
  id: string;
  student: string;
  company: string;
  jobTitle: string;
  date: string;
  time: string;
  type: "in-person" | "remote" | "phone";
  location: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  feedback?: string;
  result?: "selected" | "rejected" | "pending";
}

const sampleInterviews: Interview[] = [
  {
    id: "I001",
    student: "Alex Johnson",
    company: "TechSolutions Inc.",
    jobTitle: "Python Full Stack Developer",
    date: "2023-11-15",
    time: "10:00 AM",
    type: "remote",
    location: "Zoom Meeting",
    status: "scheduled",
  },
  {
    id: "I002",
    student: "Emma Wilson",
    company: "AI Innovations",
    jobTitle: "Data Scientist",
    date: "2023-11-12",
    time: "2:00 PM",
    type: "in-person",
    location: "San Francisco Office",
    status: "completed",
    feedback: "Strong technical skills, good communication",
    result: "selected",
  },
  {
    id: "I003",
    student: "Ryan Martinez",
    company: "WebDesign Co.",
    jobTitle: "Frontend Developer Intern",
    date: "2023-11-10",
    time: "11:30 AM",
    type: "remote",
    location: "Google Meet",
    status: "completed",
    feedback: "Needs more experience with React",
    result: "rejected",
  },
  {
    id: "I004",
    student: "Olivia Brown",
    company: "CloudTech Solutions",
    jobTitle: "DevOps Engineer",
    date: "2023-11-18",
    time: "9:00 AM",
    type: "phone",
    location: "Phone Interview",
    status: "scheduled",
  },
  {
    id: "I005",
    student: "Sophia Lee",
    company: "Creative Designs",
    jobTitle: "UI/UX Designer",
    date: "2023-11-09",
    time: "3:00 PM",
    type: "in-person",
    location: "New York Office",
    status: "no-show",
  },
];

const InterviewTypeComponent = ({ type }: { type: Interview['type'] }) => {
  const typeConfig = {
    "remote": { status: "info", text: "Remote" },
    "in-person": { status: "success", text: "In-Person" },
    "phone": { status: "default", text: "Phone" },
  };
  
  const config = typeConfig[type];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const StatusComponent = ({ status }: { status: Interview['status'] }) => {
  const statusConfig = {
    scheduled: { status: "info", text: "Scheduled" },
    completed: { status: "success", text: "Completed" },
    cancelled: { status: "default", text: "Cancelled" },
    "no-show": { status: "error", text: "No Show" },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const ResultComponent = ({ result }: { result?: Interview['result'] }) => {
  if (!result) return null;
  
  const resultConfig = {
    selected: { status: "success", text: "Selected" },
    rejected: { status: "error", text: "Rejected" },
    pending: { status: "warning", text: "Pending" },
  };
  
  const config = resultConfig[result];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
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

const isToday = (dateString: string): boolean => {
  const today = new Date();
  const interviewDate = new Date(dateString);
  return (
    today.getDate() === interviewDate.getDate() &&
    today.getMonth() === interviewDate.getMonth() &&
    today.getFullYear() === interviewDate.getFullYear()
  );
};

const Interviews = () => {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all");
  
  const filteredInterviews = 
    filter === "all" ? sampleInterviews :
    filter === "today" ? sampleInterviews.filter(interview => isToday(interview.date)) :
    filter === "upcoming" ? sampleInterviews.filter(interview => 
      interview.status === "scheduled" && new Date(interview.date) >= new Date()
    ) :
    sampleInterviews.filter(interview => interview.status === "completed");
  
  const columns = [
    {
      header: "Student & Job",
      accessor: (row: Interview) => (
        <div>
          <p className="font-medium">{row.student}</p>
          <p className="text-xs text-muted-foreground">{row.jobTitle} at {row.company}</p>
        </div>
      ),
    },
    {
      header: "Schedule",
      accessor: (row: Interview) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <CalendarDays size={16} className="mr-1 text-muted-foreground" />
            <span>{formatDate(row.date)}</span>
            {isToday(row.date) && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Today</span>}
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-1 text-muted-foreground" />
            <span>{row.time}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: (row: Interview) => (
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-muted-foreground" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: (row: Interview) => (
        <InterviewTypeComponent type={row.type} />
      ),
    },
    {
      header: "Status",
      accessor: (row: Interview) => (
        <StatusComponent status={row.status} />
      ),
    },
    {
      header: "Result",
      accessor: (row: Interview) => (
        row.result ? <ResultComponent result={row.result} /> : "-"
      ),
    },
    {
      header: "",
      accessor: (row: Interview) => (
        <div className="flex space-x-2">
          {row.status === "scheduled" && (
            <>
              <button className="p-1 rounded-md text-green-600 hover:bg-green-100 transition-colors">
                <Check size={16} />
              </button>
              <button className="p-1 rounded-md text-red-600 hover:bg-red-100 transition-colors">
                <X size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const todayInterviews = sampleInterviews.filter(interview => isToday(interview.date));

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage student interviews
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} className="mr-2" />
            Schedule Interview
          </button>
        </div>

        {todayInterviews.length > 0 && (
          <div className="glass-card rounded-xl p-6 bg-blue-50/50 border-blue-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20} />
              Today's Interviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayInterviews.map((interview) => (
                <div 
                  key={interview.id}
                  className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{interview.student}</p>
                      <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
                    </div>
                    <StatusComponent status={interview.status} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock size={14} className="mr-1 text-muted-foreground" />
                      <span>{interview.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="mr-1 text-muted-foreground" />
                      <span>{interview.location}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between">
                    <InterviewTypeComponent type={interview.type} />
                    <div className="flex space-x-1">
                      {interview.status === "scheduled" && (
                        <>
                          <button className="p-1 rounded-md text-green-600 hover:bg-green-100 transition-colors">
                            <Check size={16} />
                          </button>
                          <button className="p-1 rounded-md text-red-600 hover:bg-red-100 transition-colors">
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "all" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "today" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilter("today")}
              >
                Today
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "upcoming" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "completed" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                <Filter size={18} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  className="pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredInterviews}
            searchable
            searchKeys={["student", "company", "jobTitle"]}
          />
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Interview Calendar</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-muted transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="font-medium">November 2023</span>
              <button className="p-2 rounded-md hover:bg-muted transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="text-center p-8 text-muted-foreground">
            Calendar view will display upcoming interviews
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Interviews;
