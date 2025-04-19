export interface CreateTransactionDto {
   service_code: string;
   type?: string;
   description?: string;
   status?: string;
   total?: number;
   discount?: number;
}