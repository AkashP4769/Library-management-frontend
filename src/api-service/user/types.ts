export default interface UserResponse {
  user_id: number;
  name: string;
  email: string;
  contact_number: string | null;
  role: string | null;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  contact_number?: string;
}
