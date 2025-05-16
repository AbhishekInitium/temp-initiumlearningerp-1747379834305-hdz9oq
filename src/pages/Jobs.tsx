import { useState } from "react";
import { 
  Briefcase, 
  Building, 
  Clock, 
  Filter, 
  Map, 
  Plus, 
  Search, 
  Star 
} from "lucide-react";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import StatusBadge from "../components/shared/StatusBadge";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  salary: string;
  postedDate: string;
  applicants: number;
  status: "open" | "filled" | "closed";
  description: string;
  skills: string[];
}

const sampleJobs: Job[] = [
  {
    id: "J001",
    title: "Python Full Stack Developer",
    company: "TechSolutions Inc.",
    location: "San Francisco, CA",
    jobType: "full-time",
    salary: "$90,000 - $120,000",
    postedDate: "2023-10-10",
    applicants: 18,
    status: "open",
    description: "We are looking for a Python Full Stack Developer to join our team...",
    skills: ["Python", "Django", "React", "PostgreSQL"],
  },
  {
    id: "J002",
    title: "Data Scientist",
    company: "AI Innovations",
    location: "Remote",
    jobType: "full-time",
    salary: "$110,000 - $140,000",
    postedDate: "2023-10-05",
    applicants: 25,
    status: "open",
    description: "Join our team of data scientists working on cutting-edge AI solutions...",
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
  },
  {
    id: "J003",
    title: "Frontend Developer Intern",
    company: "WebDesign Co.",
    location: "Austin, TX",
    jobType: "internship",
    salary: "$25 - $30 per hour",
    postedDate: "2023-10-12",
    applicants: 12,
    status: "open",
    description: "Great opportunity for a frontend developer to gain real-world experience...",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "J004",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Chicago, IL",
    jobType: "full-time",
    salary: "$95,000 - $125,000",
    postedDate: "2023-09-28",
    applicants: 15,
    status: "open",
    description: "Looking for a DevOps engineer to help us scale our cloud infrastructure...",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
  },
  {
    id: "J005",
    title: "UI/UX Designer",
    company: "Creative Designs",
    location: "New York, NY",
    jobType: "contract",
    salary: "$70 - $90 per hour",
    postedDate: "2023-10-01",
    applicants: 30,
    status: "filled",
    description: "We need a creative UI/UX designer for a 6-month project...",
    skills: ["Figma", "Adobe XD", "Sketch", "User Research"],
  },
];

const JobTypeComponent = ({ type }: { type: Job['jobType'] }) => {
  const typeConfig = {
    "full-time": { status: "success", text: "Full-time" },
    "part-time": { status: "info", text: "Part-time" },
    "contract": { status: "warning", text: "Contract" },
    "internship": { status: "default", text: "Internship" },
  };
  
  const config = typeConfig[type];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const StatusComponent = ({ status }: { status: Job['status'] }) => {
  const statusConfig = {
    open: { status: "success", text: "Open" },
    filled: { status: "info", text: "Filled" },
    closed: { status: "default", text: "Closed" },
  };
  
  const config = statusConfig[status];
  
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

const daysSincePosted = (dateString: string): number => {
  const postedDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const Jobs = () => {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  
  const columns = [
    {
      header: "Job Details",
      accessor: (row: Job) => (
        <div>
          <p className="font-medium">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: (row: Job) => (
        <div className="flex items-center">
          <Map size={16} className="mr-2 text-muted-foreground" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      header: "Job Type",
      accessor: (row: Job) => (
        <JobTypeComponent type={row.jobType} />
      ),
    },
    {
      header: "Salary",
      accessor: "salary" as keyof Job,
    },
    {
      header: "Posted",
      accessor: (row: Job) => (
        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-muted-foreground" />
          <span>{daysSincePosted(row.postedDate)} days ago</span>
        </div>
      ),
    },
    {
      header: "Applicants",
      accessor: (row: Job) => `${row.applicants} applicants`,
    },
    {
      header: "Status",
      accessor: (row: Job) => (
        <StatusComponent status={row.status} />
      ),
    },
  ];

  const jobCards = sampleJobs
    .filter(job => job.status === "open")
    .map((job) => (
      <div 
        key={job.id}
        className="glass-card rounded-xl p-6 card-transition"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <div className="flex items-center mt-1 text-sm">
              <Building size={16} className="mr-1 text-muted-foreground" />
              <span>{job.company}</span>
            </div>
          </div>
          <JobTypeComponent type={job.jobType} />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Map size={16} className="mr-2 text-muted-foreground" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase size={16} className="mr-2 text-muted-foreground" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-muted-foreground" />
            <span>Posted {daysSincePosted(job.postedDate)} days ago</span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {job.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-muted text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        
        <div className="mt-5 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{job.applicants} applicants</span>
          <div className="flex space-x-2">
            <button className="text-sm bg-muted py-1 px-3 rounded-md hover:bg-muted/80 transition-colors">Save</button>
            <button className="text-sm bg-primary text-white py-1 px-3 rounded-md hover:bg-primary/90 transition-colors">Apply</button>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Placement</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage job postings for students
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} className="mr-2" />
            Post Job
          </button>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "card" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setViewMode("card")}
              >
                Card View
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table" 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={() => setViewMode("table")}
              >
                Table View
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
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            <DataTable
              columns={columns}
              data={sampleJobs}
              searchable
              searchKeys={["title" as keyof Job, "company" as keyof Job, "location" as keyof Job, "skills" as keyof Job]}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobCards}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
