"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export interface CreateProjectInput {
  teamId: string;
  name: string;
  key: string;
  color: string;
  description?: string | null;
}

export async function createProject(input: CreateProjectInput) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      team_id: input.teamId,
      name: input.name.trim(),
      key: input.key.trim().toUpperCase(),
      color: input.color,
      description: input.description ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  redirect(`/projects/${(data as { id: string }).id}`);
}

export async function updateProject(
  id: string,
  patch: { name?: string; color?: string; description?: string | null },
) {
  const { supabase } = await requireUser();
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name.trim();
  if (patch.color !== undefined) update.color = patch.color;
  if (patch.description !== undefined) update.description = patch.description;

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  redirect("/projects");
}
