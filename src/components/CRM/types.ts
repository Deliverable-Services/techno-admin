// components/CRM/types.ts

export type Status = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface Task {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  assignee?: string;
  comments: string[];
}