export interface TopUpDto {
   service_id?: string;
   type?: string;
   description?: string;
   status?: string;
   top_up_amount: number;
   discount?: number;
}