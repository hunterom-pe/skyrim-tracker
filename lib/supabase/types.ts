export type Skill = {
  id: string;
  slug: string;
  name: string;
  description: string;
  current_level: number;
  current_xp: number;
  created_at: string;
};

export type XpEvent = {
  id: string;
  skill_id: string;
  duration_minutes: number;
  note: string | null;
  xp_awarded: number;
  created_at: string;
};

export type Perk = {
  id: string;
  skill_id: string;
  unlock_level: number;
  name: string;
  description: string;
  is_unlocked: boolean;
};

export type Database = {
  public: {
    Tables: {
      skills: {
        Row: Skill;
        Insert: Partial<Skill> & { slug: string; name: string; description: string };
        Update: Partial<Skill>;
        Relationships: [];
      };
      xp_events: {
        Row: XpEvent;
        Insert: Partial<XpEvent> & {
          skill_id: string;
          duration_minutes: number;
          xp_awarded: number;
        };
        Update: Partial<XpEvent>;
        Relationships: [];
      };
      perks: {
        Row: Perk;
        Insert: Partial<Perk> & {
          skill_id: string;
          unlock_level: number;
          name: string;
          description: string;
        };
        Update: Partial<Perk>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
