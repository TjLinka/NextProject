import { Nullable } from "primereact/ts-helpers";

export interface transferMoneyBetweenUserRequest {
  agent_id: string | number;
  agent2_id: string | number | null;
  idacc: string | number;
  idacc2?: string | number;
  amount: Nullable | number;
  user_id?: string | number;
  comm?: string;
  is_admin?: number;
  password: string;
  check_password: boolean;
}
