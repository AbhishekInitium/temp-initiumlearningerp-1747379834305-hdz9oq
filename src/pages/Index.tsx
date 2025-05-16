
import { BookOpen, Briefcase, CalendarCheck, GraduationCap, Users, UserCog } from "lucide-react";
import Layout from "../components/Layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import BatchTable from "../components/dashboard/BatchTable";

const Index = () => {
  const stats = [
    {
      title: "Active Students",
      value: 234,
      icon: <Users size={24} />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Batches",
      value: 14,
      icon: <BookOpen size={24} />,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Trainer Count",
      value: 18,
      icon: <UserCog size={24} />,
      trend: { value: 2, isPositive: true },
    },
    {
      title: "Job Placements",
      value: 75,
      icon: <Briefcase size={24} />,
      trend: { value: 8, isPositive: true },
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 page-transition">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to Initium Learning LMS
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Today:</span>
            <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className="h-full"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BatchTable />
          </div>
          <div className="glass-card rounded-xl p-6 card-transition">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <CalendarCheck size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Python Batch 23 - Final Project Review</p>
                    <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Placement Stats This Month</h3>
                    <p className="text-3xl font-semibold mt-2">83%</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-2 text-green-700">
                    <GraduationCap size={20} />
                  </div>
                </div>
                <div className="mt-4 w-full bg-muted rounded-full h-1">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: "83%" }} />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>Target: 75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
