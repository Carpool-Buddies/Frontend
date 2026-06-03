export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  ride_id?: string | null;
  read: boolean;
  created_at: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  rater_id: string;
  ratee_id: string;
  score: number;
  comment?: string | null;
  created_at: string;
}
