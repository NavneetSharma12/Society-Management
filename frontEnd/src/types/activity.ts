
export type ActivityType = 'event' | 'chat' | 'maintenance' | 'announcement' | 'rsvp';

export interface Activity {
  id: string;
  residentId: string;
  residentName: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  details?: {
    eventId?: string;
    requestId?: string;
    announcementId?: string;
  };
}

export interface ActivityFilter {
  type?: ActivityType;
  residentId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
