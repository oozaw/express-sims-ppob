export interface LoginDto {
   email: string;
   password: string;
}

export interface RegisterDto {
   email: string;
   password: string;
   first_name: string;
   last_name?: string | null;
   profile_image?: string | null;
}