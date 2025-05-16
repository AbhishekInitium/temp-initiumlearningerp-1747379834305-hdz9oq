
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
import { useAddPaymentSchedule } from "@/hooks/useDatabase";
import { X } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

type EditScheduleDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetail;
}

type FormValues = {
  dueDate: string;
  amount: string;
}

const EditScheduleDrawer: React.FC<EditScheduleDrawerProps> = ({ open, onOpenChange, student }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      dueDate: new Date().toISOString().split('T')[0],
      amount: ''
    }
  });

  const addSchedule = useAddPaymentSchedule();

  const handleSubmit = (values: FormValues) => {
    const schedule = {
      studentId: student.id,
      dueDate: values.dueDate,
      amount: parseFloat(values.amount),
      status: "pending" as const,
      actualPaymentDate: null,
      paymentId: null
    };

    addSchedule.mutate(schedule, {
      onSuccess: () => {
        toast.success("Payment schedule added successfully");
        onOpenChange(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to add payment schedule");
      }
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="text-left flex justify-between items-center">
          <div>
            <DrawerTitle>Add Payment Schedule</DrawerTitle>
            <DrawerDescription>Add a new payment due date for {student.name}</DrawerDescription>
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <DrawerFooter className="px-0">
                <Button type="submit" disabled={addSchedule.isPending}>
                  {addSchedule.isPending ? "Adding..." : "Add Schedule"}
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

export default EditScheduleDrawer;
