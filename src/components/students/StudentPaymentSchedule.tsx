
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaymentSchedule } from "@/types/payment";
import { format } from "date-fns";

interface StudentPaymentScheduleProps {
  schedules: PaymentSchedule[];
  totalFee: number;
}

const StudentPaymentSchedule = ({ schedules, totalFee }: StudentPaymentScheduleProps) => {
  // Sort schedules by due date
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Calculate running total
  let runningTotal = 0;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getStatusBadge = (status: PaymentSchedule['status']) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Overdue</Badge>;
      case 'partially-paid':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Partial</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Due Date</TableHead>
            <TableHead>Installment</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Running Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSchedules.map((schedule) => {
            // Update running total
            runningTotal += schedule.amount;
            
            return (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{formatDate(schedule.dueDate)}</TableCell>
                <TableCell>
                  {sortedSchedules.indexOf(schedule) === 0 ? "Initial Payment" : `Installment ${sortedSchedules.indexOf(schedule)}`}
                </TableCell>
                <TableCell>${schedule.amount.toLocaleString()}</TableCell>
                <TableCell>
                  ${runningTotal.toLocaleString()} 
                  <span className="text-xs text-muted-foreground ml-1">
                    ({Math.round((runningTotal / totalFee) * 100)}%)
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                <TableCell>
                  {schedule.actualPaymentDate 
                    ? formatDate(schedule.actualPaymentDate)
                    : schedule.status === 'overdue' 
                      ? <span className="text-red-500">Overdue</span>
                      : "-"
                  }
                </TableCell>
              </TableRow>
            );
          })}
          
          {/* Total row */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={2} className="font-medium">Total</TableCell>
            <TableCell className="font-medium">${totalFee.toLocaleString()}</TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentPaymentSchedule;
