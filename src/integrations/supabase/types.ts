export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievement_activities: {
        Row: {
          achievement_id: string
          activity_type_id: string
          created_at: string
          id: string
        }
        Insert: {
          achievement_id: string
          activity_type_id: string
          created_at?: string
          id?: string
        }
        Update: {
          achievement_id?: string
          activity_type_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_activities_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_activities_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          is_generic: boolean | null
          name: string
          required_points: number
          tier: string | null
          xp_points: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_generic?: boolean | null
          name: string
          required_points?: number
          tier?: string | null
          xp_points?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_generic?: boolean | null
          name?: string
          required_points?: number
          tier?: string | null
          xp_points?: number
        }
        Relationships: []
      }
      activity_types: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_habit_forming: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          is_habit_forming?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_habit_forming?: boolean | null
          name?: string
        }
        Relationships: []
      }
      challenge_messages: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_messages_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          id: string
          is_eliminated: boolean | null
          joined_at: string
          points: number | null
          status: string
          tier_level: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string
          points?: number | null
          status?: string
          tier_level?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string
          points?: number | null
          status?: string
          tier_level?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_progress_photos: {
        Row: {
          challenge_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_photos_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_reminders: {
        Row: {
          challenge_id: string
          created_at: string
          enabled: boolean
          frequency: string
          id: string
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          enabled?: boolean
          frequency?: string
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          enabled?: boolean
          frequency?: string
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_reminders_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_summaries: {
        Row: {
          challenge_id: string
          completion_type: string
          created_at: string
          id: string
          summary_text: string | null
          total_bet_pool: number | null
          total_participants: number
          winner_points: number | null
          winner_user_id: string | null
        }
        Insert: {
          challenge_id: string
          completion_type: string
          created_at?: string
          id?: string
          summary_text?: string | null
          total_bet_pool?: number | null
          total_participants?: number
          winner_points?: number | null
          winner_user_id?: string | null
        }
        Update: {
          challenge_id?: string
          completion_type?: string
          created_at?: string
          id?: string
          summary_text?: string | null
          total_bet_pool?: number | null
          total_participants?: number
          winner_points?: number | null
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_summaries_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          activity_type_id: string | null
          bet_amount: number | null
          completed_at: string | null
          created_at: string
          creator_id: string
          educational_tips: string | null
          elimination_threshold: number | null
          end_date: string
          gradual_progression: boolean | null
          has_bet: boolean
          id: string
          name: string
          point_multiplier: number | null
          reminder_enabled: boolean | null
          rewards: string | null
          start_date: string
          status: string | null
          target_points: number | null
        }
        Insert: {
          activity_type_id?: string | null
          bet_amount?: number | null
          completed_at?: string | null
          created_at?: string
          creator_id: string
          educational_tips?: string | null
          elimination_threshold?: number | null
          end_date: string
          gradual_progression?: boolean | null
          has_bet?: boolean
          id?: string
          name: string
          point_multiplier?: number | null
          reminder_enabled?: boolean | null
          rewards?: string | null
          start_date: string
          status?: string | null
          target_points?: number | null
        }
        Update: {
          activity_type_id?: string | null
          bet_amount?: number | null
          completed_at?: string | null
          created_at?: string
          creator_id?: string
          educational_tips?: string | null
          elimination_threshold?: number | null
          end_date?: string
          gradual_progression?: boolean | null
          has_bet?: boolean
          id?: string
          name?: string
          point_multiplier?: number | null
          reminder_enabled?: boolean | null
          rewards?: string | null
          start_date?: string
          status?: string | null
          target_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          last_block_reset: string | null
          last_streak_update: string | null
          notification_token: string | null
          streak: number | null
          streak_blocks: number | null
          updated_at: string | null
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          last_block_reset?: string | null
          last_streak_update?: string | null
          notification_token?: string | null
          streak?: number | null
          streak_blocks?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          last_block_reset?: string | null
          last_streak_update?: string | null
          notification_token?: string | null
          streak?: number | null
          streak_blocks?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      user_achievement_points: {
        Row: {
          achievement_id: string
          activity_type_id: string | null
          created_at: string
          current_points: number
          id: string
          required_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          activity_type_id?: string | null
          created_at?: string
          current_points?: number
          id?: string
          required_points: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          activity_type_id?: string | null
          created_at?: string
          current_points?: number
          id?: string
          required_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_points_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievement_points_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_points: {
        Row: {
          activity_type_id: string
          created_at: string
          id: string
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type_id: string
          created_at?: string
          id?: string
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type_id?: string
          created_at?: string
          id?: string
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_points_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_checkins: {
        Row: {
          activity_type_id: string | null
          created_at: string
          id: string
          image_url: string | null
          type: string
          user_id: string
        }
        Insert: {
          activity_type_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          type: string
          user_id: string
        }
        Update: {
          activity_type_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checkins_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_activity_achievements: {
        Args: { user_id_param: string; activity_type_id_param: string }
        Returns: undefined
      }
      complete_challenge_automatically: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_challenge_live_ranking: {
        Args: { challenge_id_param: string }
        Returns: {
          user_id: string
          full_name: string
          avatar_url: string
          total_points: number
          rank_position: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
