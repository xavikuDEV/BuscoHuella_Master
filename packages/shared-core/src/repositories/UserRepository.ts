import { SupabaseClient } from "@supabase/supabase-js";
import { UserProfile } from "../models/user.js";

export class UserRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(): Promise<{ data: UserProfile[]; error: any }> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return { data: (data as UserProfile[]) || [], error };
  }

  async findById(
    id: string,
  ): Promise<{ data: UserProfile | null; error: any }> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as UserProfile, error };
  }

  async delete(id: string): Promise<{ error: any }> {
    return await this.client.from("profiles").delete().eq("id", id);
  }

  async update(
    id: string,
    userData: Partial<UserProfile>,
  ): Promise<{ error: any }> {
    return await this.client.from("profiles").update(userData).eq("id", id);
  }
}
