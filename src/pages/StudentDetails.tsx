import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, CreditCard, Download, Edit, FileText, Mail, Phone } from "lucide-react";
import Layout from "../components/Layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import StudentPaymentSchedule from "@/components/students/StudentPaymentSchedule";
import StudentPaymentHistory from "@/components/students/StudentPaymentHistory";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { useStudent } from "@/hooks/useDatabase";
import EditStudentDrawer from "@/components/students/EditStudentDrawer";
import RecordPaymentDrawer from "@/components/students/RecordPaymentDrawer";

const formatDate = (dateString: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString || 'N/A';
  }
};

const calculatePaymentProgress = (totalPaid: number, totalFee: number) => {
  return Math.round((totalPaid / totalFee) * 100);
};

const getNextPayment = (schedules: any[] = []) => {
  const pendingPayments = schedules.filter(s => s.status === 'pending');
  return pendingPayments.length > 0 ? pendingPayments[0] : null;
};

const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  
  const { data: student, isLoading, error } = useStudent(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-lg">Loading student details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-lg text-red-500">Could not load student details.</p>
          <Button onClick={() => navigate('/students')}>
            Back to Students
          </Button>
        </div>
      </Layout>
    );
  }

  const paymentProgress = calculatePaymentProgress(
    student.financials.totalPaid, 
    student.financials.totalFee
  );
  const nextPayment = getNextPayment(student.financials.schedules);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/students')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto gap-2"
            onClick={() => setIsEditDrawerOpen(true)}
          >
            <Edit size={16} />
            Edit Student
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{student.name}</h2>
                  <p className="text-muted-foreground">{student.id}</p>
                </div>
                <StatusBadge 
                  status={student.status === "active" ? "success" : student.status === "on-hold" ? "warning" : "default"}
                  text={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>Joined {formatDate(student.joinDate)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Course & Batch</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Course:</span> {student.course}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Batch:</span> {student.batch}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Mode:</span> {student.mode}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Location:</span> {student.location}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Registration Details</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Lead Source:</span> {student.leadSource}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">SCC:</span> {student.scc}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Market:</span> {student.market}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Financial Summary</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Fee:</span>
                        <span className="font-medium">${student.financials.totalFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid to Date:</span>
                        <span className="font-medium">${student.financials.totalPaid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance:</span>
                        <span className="font-medium">${student.financials.balance}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Payment Progress</span>
                        <span>{paymentProgress}%</span>
                      </div>
                      <Progress value={paymentProgress} className="h-2" />
                    </div>

                    {nextPayment && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Next Payment</h4>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Due Date:</span>
                            <span className="text-sm font-medium">{formatDate(nextPayment.dueDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Amount:</span>
                            <span className="text-sm font-medium">${nextPayment.amount}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="glass-card rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Course Progress</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Module Completion</span>
                          <span>{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Attendance</span>
                          <span>{student.attendance}%</span>
                        </div>
                        <Progress value={student.attendance} className="h-2" />
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Placement Status</h4>
                        <StatusBadge 
                          status={
                            student.placementStatus === "placed" ? "success" : 
                            student.placementStatus === "searching" ? "warning" : 
                            student.placementStatus === "not-started" ? "info" : "default"
                          }
                          text={
                            student.placementStatus === "placed" ? "Placed" : 
                            student.placementStatus === "searching" ? "Searching" : 
                            student.placementStatus === "not-started" ? "Not Started" : "Opted Out"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Comments & Notes</h3>
                    <Button variant="outline" size="sm">
                      <Edit size={16} className="mr-2" /> Add Note
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md space-y-2">
                    <p className="text-sm">{student.comments || "No comments available."}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0">
                <div className="glass-card rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Payment History</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download size={16} className="mr-2" /> Export
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setIsPaymentDrawerOpen(true)}
                      >
                        <CreditCard size={16} className="mr-2" /> Record Payment
                      </Button>
                    </div>
                  </div>
                  
                  <StudentPaymentHistory payments={student.financials.payments} />
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-0">
                <div className="glass-card rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Payment Schedule</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download size={16} className="mr-2" /> Export
                      </Button>
                      <Button size="sm">
                        <Edit size={16} className="mr-2" /> Edit Schedule
                      </Button>
                    </div>
                  </div>
                  
                  <StudentPaymentSchedule 
                    schedules={student.financials.schedules} 
                    totalFee={student.financials.totalFee} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <div className="glass-card rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Documents</h3>
                    <Button size="sm">
                      <FileText size={16} className="mr-2" /> Upload Document
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 p-8 rounded-md flex flex-col items-center justify-center text-center">
                    <FileText size={48} className="text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium">No Documents Yet</h4>
                    <p className="text-muted-foreground">Upload student documents like certificates, agreements, or ID proof</p>
                    <Button className="mt-4">Upload Document</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {student && (
        <>
          <EditStudentDrawer 
            open={isEditDrawerOpen} 
            onOpenChange={setIsEditDrawerOpen} 
            student={student} 
          />
          <RecordPaymentDrawer
            open={isPaymentDrawerOpen}
            onOpenChange={setIsPaymentDrawerOpen}
            student={student}
          />
        </>
      )}
    </Layout>
  );
};

export default StudentDetails;
