export type Status = "ACTIVE" | "INVITED" | "BLOCKED";

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
