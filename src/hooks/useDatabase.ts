
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentDetail, Payment, PaymentSchedule } from '@/types/payment';
import db from '@/services/database';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: db.getAllStudents
  });
}

export function useStudent(id: string | undefined) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => id ? db.getStudentById(id) : null,
    enabled: !!id
  });
}

export function useAddStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      student: Omit<StudentDetail, 'financials'> & { financials: Omit<StudentDetail['financials'], 'schedules' | 'payments'> },
      schedules: Omit<PaymentSchedule, 'id'>[],
      payments: Omit<Payment, 'id'>[]
    }) => db.addStudent(data.student, data.schedules, data.payments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string, updates: Partial<Omit<StudentDetail, 'id' | 'financials'>> }) => 
      db.updateStudent(data.id, data.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.id] });
    }
  });
}

export function useUpdateStudentFinancials() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string, updates: Partial<Omit<StudentDetail['financials'], 'id' | 'studentId' | 'schedules' | 'payments'>> }) => 
      db.updateStudentFinancials(data.id, data.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.id] });
    }
  });
}

export function useAddPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payment: Omit<Payment, 'id'>) => db.addPayment(payment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.studentId] });
    }
  });
}

export function useAddPaymentSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (schedule: Omit<PaymentSchedule, 'id'>) => db.addPaymentSchedule(schedule),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.studentId] });
    }
  });
}
