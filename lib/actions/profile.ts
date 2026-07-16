"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Update the signed-in user's display name. */
export async function updateProfileName(fullName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
}
