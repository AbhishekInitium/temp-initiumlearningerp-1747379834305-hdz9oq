
import React from "react";
import { useForm } from "react-hook-form";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader,
  DrawerTitle, 
  DrawerDescription,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentDetail } from "@/types/payment";
import { useAddPayment } from "@/hooks/useDatabase";
import { X } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

type RecordPaymentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetail;
}

type FormValues = {
  amount: string;
  date: string;
  paymentMethod: string;
  reference: string;
  notes: string;
}

const RecordPaymentDrawer: React.FC<RecordPaymentDrawerProps> = ({ open, onOpenChange, student }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      reference: '',
      notes: ''
    }
  });

  const addPayment = useAddPayment();

  const handleSubmit = (values: FormValues) => {
    const payment = {
      studentId: student.id,
      amount: parseFloat(values.amount),
      date: values.date,
      paymentMethod: values.paymentMethod,
      reference: values.reference,
      notes: values.notes || null
    };

    addPayment.mutate(payment, {
      onSuccess: () => {
        toast.success("Payment recorded successfully");
        onOpenChange(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to record payment");
      }
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="text-left flex justify-between items-center">
          <div>
            <DrawerTitle>Record Payment</DrawerTitle>
            <DrawerDescription>Add a new payment for {student.name}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DrawerFooter className="px-0">
                <Button type="submit" disabled={addPayment.isPending}>
                  {addPayment.isPending ? "Processing..." : "Record Payment"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RecordPaymentDrawer;
