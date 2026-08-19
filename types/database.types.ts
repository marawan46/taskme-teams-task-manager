export type Json =
     | string
     | number
     | boolean
     | null
     | { [key: string]: Json | undefined }
     | Json[];

export type Database = {
     graphql_public: {
          Tables: {
               [_ in never]: never;
          };
          Views: {
               [_ in never]: never;
          };
          Functions: {
               graphql: {
                    Args: {
                         extensions?: Json;
                         operationName?: string;
                         query?: string;
                         variables?: Json;
                    };
                    Returns: Json;
               };
          };
          Enums: {
               [_ in never]: never;
          };
          CompositeTypes: {
               [_ in never]: never;
          };
     };
     public: {
          Tables: {
               milestones: {
                    Row: {
                         created_at: string | null;
                         created_by: string;
                         description: string | null;
                         due_date: string;
                         id: string;
                         project_id: string;
                         title: string;
                         updated_at: string | null;
                    };
                    Insert: {
                         created_at?: string | null;
                         created_by: string;
                         description?: string | null;
                         due_date: string;
                         id?: string;
                         project_id: string;
                         title: string;
                         updated_at?: string | null;
                    };
                    Update: {
                         created_at?: string | null;
                         created_by?: string;
                         description?: string | null;
                         due_date?: string;
                         id?: string;
                         project_id?: string;
                         title?: string;
                         updated_at?: string | null;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "milestones_created_by_fkey";
                              columns: ["created_by"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "milestones_project_id_fkey";
                              columns: ["project_id"];
                              isOneToOne: false;
                              referencedRelation: "projects";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               my_task_groups: {
                    Row: {
                         created_at: string | null;
                         id: string;
                         name: string;
                         updated_at: string | null;
                         user_id: string;
                    };
                    Insert: {
                         created_at?: string | null;
                         id?: string;
                         name: string;
                         updated_at?: string | null;
                         user_id: string;
                    };
                    Update: {
                         created_at?: string | null;
                         id?: string;
                         name?: string;
                         updated_at?: string | null;
                         user_id?: string;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "my_task_groups_user_id_fkey";
                              columns: ["user_id"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               my_tasks: {
                    Row: {
                         completed: boolean;
                         content: string | null;
                         created_at: string | null;
                         description: string | null;
                         due_date: string;
                         group_id: string;
                         id: string;
                         name: string;
                         priority: number;
                         updated_at: string | null;
                         user_id: string;
                    };
                    Insert: {
                         completed?: boolean;
                         content?: string | null;
                         created_at?: string | null;
                         description?: string | null;
                         due_date: string;
                         group_id: string;
                         id?: string;
                         name: string;
                         priority?: number;
                         updated_at?: string | null;
                         user_id: string;
                    };
                    Update: {
                         completed?: boolean;
                         content?: string | null;
                         created_at?: string | null;
                         description?: string | null;
                         due_date?: string;
                         group_id?: string;
                         id?: string;
                         name?: string;
                         priority?: number;
                         updated_at?: string | null;
                         user_id?: string;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "my_tasks_group_id_fkey";
                              columns: ["group_id"];
                              isOneToOne: false;
                              referencedRelation: "my_task_groups";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "my_tasks_user_id_fkey";
                              columns: ["user_id"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               profiles: {
                    Row: {
                         avatar_url: string | null;
                         email: string | null;
                         full_name: string | null;
                         id: string;
                    };
                    Insert: {
                         avatar_url?: string | null;
                         email?: string | null;
                         full_name?: string | null;
                         id: string;
                    };
                    Update: {
                         avatar_url?: string | null;
                         email?: string | null;
                         full_name?: string | null;
                         id?: string;
                    };
                    Relationships: [];
               };
               project_invitations: {
                    Row: {
                         accepted_at: string | null;
                         created_at: string | null;
                         email: string;
                         expires_at: string;
                         id: string;
                         invited_by: string;
                         project_id: string;
                         role: Database["public"]["Enums"]["project_role"];
                         role_tag: string | null;
                         status: Database["public"]["Enums"]["invitation_status"];
                         token_hash: string;
                    };
                    Insert: {
                         accepted_at?: string | null;
                         created_at?: string | null;
                         email: string;
                         expires_at?: string;
                         id?: string;
                         invited_by: string;
                         project_id: string;
                         role?: Database["public"]["Enums"]["project_role"];
                         role_tag?: string | null;
                         status?: Database["public"]["Enums"]["invitation_status"];
                         token_hash: string;
                    };
                    Update: {
                         accepted_at?: string | null;
                         created_at?: string | null;
                         email?: string;
                         expires_at?: string;
                         id?: string;
                         invited_by?: string;
                         project_id?: string;
                         role?: Database["public"]["Enums"]["project_role"];
                         role_tag?: string | null;
                         status?: Database["public"]["Enums"]["invitation_status"];
                         token_hash?: string;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "project_invitations_invited_by_fkey";
                              columns: ["invited_by"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "project_invitations_project_id_fkey";
                              columns: ["project_id"];
                              isOneToOne: false;
                              referencedRelation: "projects";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               project_member_permissions: {
                    Row: {
                         granted_at: string | null;
                         granted_by: string;
                         permission: Database["public"]["Enums"]["project_permission"];
                         project_id: string;
                         user_id: string;
                    };
                    Insert: {
                         granted_at?: string | null;
                         granted_by: string;
                         permission: Database["public"]["Enums"]["project_permission"];
                         project_id: string;
                         user_id: string;
                    };
                    Update: {
                         granted_at?: string | null;
                         granted_by?: string;
                         permission?: Database["public"]["Enums"]["project_permission"];
                         project_id?: string;
                         user_id?: string;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "project_member_permissions_granted_by_fkey";
                              columns: ["granted_by"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "project_member_permissions_project_id_user_id_fkey";
                              columns: ["project_id", "user_id"];
                              isOneToOne: false;
                              referencedRelation: "project_members";
                              referencedColumns: ["project_id", "user_id"];
                         },
                    ];
               };
               project_members: {
                    Row: {
                         joined_at: string | null;
                         project_id: string;
                         role: Database["public"]["Enums"]["project_role"];
                         role_tag: string | null;
                         user_id: string;
                    };
                    Insert: {
                         joined_at?: string | null;
                         project_id: string;
                         role?: Database["public"]["Enums"]["project_role"];
                         role_tag?: string | null;
                         user_id: string;
                    };
                    Update: {
                         joined_at?: string | null;
                         project_id?: string;
                         role?: Database["public"]["Enums"]["project_role"];
                         role_tag?: string | null;
                         user_id?: string;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "project_members_project_id_fkey";
                              columns: ["project_id"];
                              isOneToOne: false;
                              referencedRelation: "projects";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "project_members_user_id_fkey";
                              columns: ["user_id"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               projects: {
                    Row: {
                         created_at: string | null;
                         created_by: string;
                         description: string | null;
                         due_date: string;
                         id: string;
                         name: string;
                         updated_at: string | null;
                    };
                    Insert: {
                         created_at?: string | null;
                         created_by: string;
                         description?: string | null;
                         due_date: string;
                         id?: string;
                         name: string;
                         updated_at?: string | null;
                    };
                    Update: {
                         created_at?: string | null;
                         created_by?: string;
                         description?: string | null;
                         due_date?: string;
                         id?: string;
                         name?: string;
                         updated_at?: string | null;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "projects_created_by_fkey";
                              columns: ["created_by"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                    ];
               };
               tasks: {
                    Row: {
                         assigned_to: string;
                         created_at: string | null;
                         created_by: string;
                         description: string | null;
                         due_date: string;
                         id: string;
                         parent_milestone_id: string;
                         parent_task_id: string | null;
                         priority: number;
                         project_id: string;
                         status: Database["public"]["Enums"]["task_status"];
                         title: string;
                         updated_at: string | null;
                    };
                    Insert: {
                         assigned_to: string;
                         created_at?: string | null;
                         created_by: string;
                         description?: string | null;
                         due_date: string;
                         id?: string;
                         parent_milestone_id: string;
                         parent_task_id?: string | null;
                         priority?: number;
                         project_id: string;
                         status?: Database["public"]["Enums"]["task_status"];
                         title: string;
                         updated_at?: string | null;
                    };
                    Update: {
                         assigned_to?: string;
                         created_at?: string | null;
                         created_by?: string;
                         description?: string | null;
                         due_date?: string;
                         id?: string;
                         parent_milestone_id?: string;
                         parent_task_id?: string | null;
                         priority?: number;
                         project_id?: string;
                         status?: Database["public"]["Enums"]["task_status"];
                         title?: string;
                         updated_at?: string | null;
                    };
                    Relationships: [
                         {
                              foreignKeyName: "tasks_assigned_to_fkey";
                              columns: ["assigned_to"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "tasks_created_by_fkey";
                              columns: ["created_by"];
                              isOneToOne: false;
                              referencedRelation: "profiles";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "tasks_parent_milestone_id_fkey";
                              columns: ["parent_milestone_id"];
                              isOneToOne: false;
                              referencedRelation: "milestones";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "tasks_parent_task_id_fkey";
                              columns: ["parent_task_id"];
                              isOneToOne: false;
                              referencedRelation: "tasks";
                              referencedColumns: ["id"];
                         },
                         {
                              foreignKeyName: "tasks_project_id_fkey";
                              columns: ["project_id"];
                              isOneToOne: false;
                              referencedRelation: "projects";
                              referencedColumns: ["id"];
                         },
                    ];
               };
          };
          Views: {
               [_ in never]: never;
          };
          Functions: {
               accept_project_invitation: {
                    Args: { p_token: string };
                    Returns: {
                         code: string;
                         invitation: Database["public"]["Tables"]["project_invitations"]["Row"];
                         message: string;
                         ok: boolean;
                    }[];
               };
               get_project_role: {
                    Args: { p_project_id: string };
                    Returns: Database["public"]["Enums"]["project_role"];
               };
               has_permission: {
                    Args: {
                         p_permission: Database["public"]["Enums"]["project_permission"];
                         p_project_id: string;
                    };
                    Returns: boolean;
               };
               sweep_expired_project_invitations: {
                    Args: never;
                    Returns: number;
               };
               update_member_info: {
                    Args: {
                         p_project_id: string;
                         p_role_tag: string;
                         p_user_id: string;
                    };
                    Returns: undefined;
               };
               update_task_status: {
                    Args: {
                         p_status: Database["public"]["Enums"]["task_status"];
                         p_task_id: string;
                    };
                    Returns: {
                         assigned_to: string;
                         created_at: string | null;
                         created_by: string;
                         description: string | null;
                         due_date: string;
                         id: string;
                         parent_milestone_id: string;
                         parent_task_id: string | null;
                         priority: number;
                         project_id: string;
                         status: Database["public"]["Enums"]["task_status"];
                         title: string;
                         updated_at: string | null;
                    };
                    SetofOptions: {
                         from: "*";
                         to: "tasks";
                         isOneToOne: true;
                         isSetofReturn: false;
                    };
               };
               verified_email_for_current_user: {
                    Args: never;
                    Returns: string;
               };
               void_project_invitation: {
                    Args: { p_invitation_id: string };
                    Returns: boolean;
               };
          };
          Enums: {
               invitation_status: "PENDING" | "ACCEPTED" | "EXPIRED";
               project_permission:
                    | "update:project"
                    | "delete:project"
                    | "invite:members"
                    | "remove:members"
                    | "update:members"
                    | "read:milestones"
                    | "add:milestones"
                    | "update:milestones"
                    | "delete:milestones"
                    | "read:tasks"
                    | "add:tasks"
                    | "update:tasks"
                    | "delete:tasks"
                    | "approve:tasks";
               project_role: "OWNER" | "MANAGER" | "COLLABORATOR";
               task_status: "TODO" | "IN_PROGRESS" | "UNDER_REVIEW" | "DONE";
          };
          CompositeTypes: {
               [_ in never]: never;
          };
     };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
     keyof Database,
     "public"
>];

export type Tables<
     DefaultSchemaTableNameOrOptions extends
          | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
          | { schema: keyof DatabaseWithoutInternals },
     TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof DatabaseWithoutInternals;
     }
          ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
                 DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
          : never = never,
> = DefaultSchemaTableNameOrOptions extends {
     schema: keyof DatabaseWithoutInternals;
}
     ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R;
       }
          ? R
          : never
     : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
              DefaultSchema["Views"])
       ? (DefaultSchema["Tables"] &
              DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
              Row: infer R;
         }
            ? R
            : never
       : never;

export type TablesInsert<
     DefaultSchemaTableNameOrOptions extends
          | keyof DefaultSchema["Tables"]
          | { schema: keyof DatabaseWithoutInternals },
     TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof DatabaseWithoutInternals;
     }
          ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
          : never = never,
> = DefaultSchemaTableNameOrOptions extends {
     schema: keyof DatabaseWithoutInternals;
}
     ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I;
       }
          ? I
          : never
     : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
       ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
              Insert: infer I;
         }
            ? I
            : never
       : never;

export type TablesUpdate<
     DefaultSchemaTableNameOrOptions extends
          | keyof DefaultSchema["Tables"]
          | { schema: keyof DatabaseWithoutInternals },
     TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof DatabaseWithoutInternals;
     }
          ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
          : never = never,
> = DefaultSchemaTableNameOrOptions extends {
     schema: keyof DatabaseWithoutInternals;
}
     ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U;
       }
          ? U
          : never
     : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
       ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
              Update: infer U;
         }
            ? U
            : never
       : never;

export type Enums<
     DefaultSchemaEnumNameOrOptions extends
          | keyof DefaultSchema["Enums"]
          | { schema: keyof DatabaseWithoutInternals },
     EnumName extends DefaultSchemaEnumNameOrOptions extends {
          schema: keyof DatabaseWithoutInternals;
     }
          ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
          : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
     schema: keyof DatabaseWithoutInternals;
}
     ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
     : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
       ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
       : never;

export type CompositeTypes<
     PublicCompositeTypeNameOrOptions extends
          | keyof DefaultSchema["CompositeTypes"]
          | { schema: keyof DatabaseWithoutInternals },
     CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
          schema: keyof DatabaseWithoutInternals;
     }
          ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
          : never = never,
> = PublicCompositeTypeNameOrOptions extends {
     schema: keyof DatabaseWithoutInternals;
}
     ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
     : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
       ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
       : never;

export const Constants = {
     graphql_public: {
          Enums: {},
     },
     public: {
          Enums: {
               invitation_status: ["PENDING", "ACCEPTED", "EXPIRED"],
               project_permission: [
                    "update:project",
                    "delete:project",
                    "invite:members",
                    "remove:members",
                    "update:members",
                    "read:milestones",
                    "add:milestones",
                    "update:milestones",
                    "delete:milestones",
                    "read:tasks",
                    "add:tasks",
                    "update:tasks",
                    "delete:tasks",
                    "approve:tasks",
               ],
               project_role: ["OWNER", "MANAGER", "COLLABORATOR"],
               task_status: ["TODO", "IN_PROGRESS", "UNDER_REVIEW", "DONE"],
          },
     },
} as const;
