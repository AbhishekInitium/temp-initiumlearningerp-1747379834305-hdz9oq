
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CreditCard, Download, ExternalLink } from "lucide-react";
import { Payment } from "@/types/payment";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface StudentPaymentHistoryProps {
  payments: Payment[];
}

const StudentPaymentHistory = ({ payments }: StudentPaymentHistoryProps) => {
  // Sort payments by date (newest first)
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  if (payments.length === 0) {
    return (
      <div className="bg-muted/30 p-8 rounded-md flex flex-col items-center justify-center text-center">
        <CreditCard size={48} className="text-muted-foreground mb-4" />
        <h4 className="text-lg font-medium">No Payments Yet</h4>
        <p className="text-muted-foreground">This student hasn't made any payments yet</p>
        <Button className="mt-4">Record First Payment</Button>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell className="font-medium">${payment.amount.toLocaleString()}</TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell>{payment.reference}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {/* Total row */}
          <TableRow className="bg-muted/20">
            <TableCell className="font-medium">Total Paid</TableCell>
            <TableCell className="font-medium">
              ${sortedPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentPaymentHistory;
