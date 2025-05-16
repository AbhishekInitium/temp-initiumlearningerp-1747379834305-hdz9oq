
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
import { useUpdateStudent } from "@/hooks/useDatabase";
import { X } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

type EditStudentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetail;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  batch: string;
  course: string;
  location: string;
  mode: "Online" | "Offline" | "Hybrid";
}

const EditStudentDrawer: React.FC<EditStudentDrawerProps> = ({ open, onOpenChange, student }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: student.name,
      email: student.email,
      phone: student.phone,
      batch: student.batch,
      course: student.course,
      location: student.location,
      mode: student.mode,
    }
  });

  const updateStudent = useUpdateStudent();

  const handleSubmit = (values: FormValues) => {
    updateStudent.mutate({
      id: student.id,
      updates: values
    }, {
      onSuccess: () => {
        toast.success("Student details updated successfully");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to update student details");
      }
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="text-left flex justify-between items-center">
          <div>
            <DrawerTitle>Edit Student</DrawerTitle>
            <DrawerDescription>Make changes to student information</DrawerDescription>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DrawerFooter className="px-0">
                <Button type="submit" disabled={updateStudent.isPending}>
                  {updateStudent.isPending ? "Saving..." : "Save Changes"}
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

export default EditStudentDrawer;
