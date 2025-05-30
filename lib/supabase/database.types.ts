export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          username: string | null
          bio: string | null
          website: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          prompt: string
          description: string | null
          image_url: string | null
          tags: string[] | null
          platform: string
          author_id: string
          likes_count: number
          collections_count: number
          views_count: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          prompt: string
          description?: string | null
          image_url?: string | null
          tags?: string[] | null
          platform: string
          author_id: string
          likes_count?: number
          collections_count?: number
          views_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          prompt?: string
          description?: string | null
          image_url?: string | null
          tags?: string[] | null
          platform?: string
          author_id?: string
          likes_count?: number
          collections_count?: number
          views_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          key_hash: string
          key_prefix: string
          plan_type: "starter" | "pro" | "enterprise"
          total_calls: number
          used_calls: number
          rate_limit: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          key_hash: string
          key_prefix: string
          plan_type: "starter" | "pro" | "enterprise"
          total_calls: number
          used_calls?: number
          rate_limit: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          key_hash?: string
          key_prefix?: string
          plan_type?: "starter" | "pro" | "enterprise"
          total_calls?: number
          used_calls?: number
          rate_limit?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
