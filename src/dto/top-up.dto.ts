export interface TopUpDto {
   service_id?: number;
   type?: string;
   description?: string;
   status?: string;
   top_up_amount: number;
   discount?: number;
}