export type Status = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface Record {
  id: string;
  about: {
    name: string;
    status: Status;
    email: string;
  };
  details: {
    date: string;
    invitedBy: string;
  };
}
