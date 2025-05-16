
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Contact, 
  Mail, 
  Phone, 
  Plus, 
  Star 
} from "lucide-react";
import Layout from "../components/Layout";
import DataTable from "../components/shared/DataTable";
import StatusBadge from "../components/shared/StatusBadge";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  joinDate: string;
  activeBatches: number;
  completedBatches: number;
  rating: number;
  status: "active" | "on-leave" | "inactive";
}

const sampleTrainers: Trainer[] = [
  {
    id: "T001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 555-1111",
    expertise: ["Python", "Django", "React"],
    joinDate: "2022-05-10",
    activeBatches: 2,
    completedBatches: 15,
    rating: 4.8,
    status: "active",
  },
  {
    id: "T002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 555-2222",
    expertise: ["Data Science", "Machine Learning", "Python"],
    joinDate: "2022-08-22",
    activeBatches: 1,
    completedBatches: 8,
    rating: 4.7,
    status: "active",
  },
  {
    id: "T003",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1 555-3333",
    expertise: ["JavaScript", "React", "Node.js"],
    joinDate: "2021-11-15",
    activeBatches: 0,
    completedBatches: 12,
    rating: 4.9,
    status: "on-leave",
  },
  {
    id: "T004",
    name: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+1 555-4444",
    expertise: ["DevOps", "AWS", "Docker", "Kubernetes"],
    joinDate: "2023-02-05",
    activeBatches: 1,
    completedBatches: 4,
    rating: 4.6,
    status: "active",
  },
];

const StatusComponent = ({ status }: { status: Trainer['status'] }) => {
  const statusConfig = {
    active: { status: "success", text: "Active" },
    "on-leave": { status: "warning", text: "On Leave" },
    inactive: { status: "default", text: "Inactive" },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusBadge 
      status={config.status as any} 
      text={config.text} 
    />
  );
};

const RatingComponent = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      <span className="font-medium mr-1">{rating}</span>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
          />
        ))}
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

const Trainers = () => {
  const columns = [
    {
      header: "Trainer",
      accessor: (row: Trainer) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: (row: Trainer) => (
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
      header: "Expertise",
      accessor: (row: Trainer) => (
        <div className="flex flex-wrap gap-1">
          {row.expertise.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-muted text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Batches",
      accessor: (row: Trainer) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <BookOpen size={16} className="mr-1 text-primary" />
            <span className="font-medium">{row.activeBatches} Active</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Award size={14} className="mr-1" />
            <span>{row.completedBatches} Completed</span>
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: (row: Trainer) => (
        <RatingComponent rating={row.rating} />
      ),
    },
    {
      header: "Join Date",
      accessor: (row: Trainer) => formatDate(row.joinDate),
    },
    {
      header: "Status",
      accessor: (row: Trainer) => (
        <StatusComponent status={row.status} />
      ),
    },
  ];

  const trainerCards = sampleTrainers.slice(0, 3).map((trainer) => (
    <div 
      key={trainer.id}
      className="glass-card rounded-xl p-6 card-transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{trainer.name}</h3>
          <p className="text-sm text-muted-foreground">{trainer.expertise.join(", ")}</p>
        </div>
        <StatusComponent status={trainer.status} />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-sm">
          <Mail size={16} className="mr-2 text-muted-foreground" />
          <span>{trainer.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone size={16} className="mr-2 text-muted-foreground" />
          <span>{trainer.phone}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar size={16} className="mr-2 text-muted-foreground" />
          <span>Joined {formatDate(trainer.joinDate)}</span>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border flex justify-between items-center">
        <RatingComponent rating={trainer.rating} />
        <div className="flex space-x-4">
          <button className="text-sm text-primary hover:text-primary/80">Schedule</button>
          <button className="text-sm text-primary hover:text-primary/80">View Profile</button>
        </div>
      </div>
    </div>
  ));

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trainers</h1>
            <p className="text-muted-foreground mt-1">
              Manage trainers and their batch assignments
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} className="mr-2" />
            Add Trainer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainerCards}
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">All Trainers</h2>
          <DataTable
            columns={columns}
            data={sampleTrainers}
            searchable
            searchKeys={["name", "email", "expertise"]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Trainers;
