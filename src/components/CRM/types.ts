// File: components/CRM/types.ts

export interface Comment {
  id: string;
  text: string;
  image?: string;
  username: string;
  avatar?: string;
}

export interface Task {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  comments: Comment[];
}