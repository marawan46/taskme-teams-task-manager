import { CASLProvider } from "@/components/providers/CASLProvider";
import { getUserPermissions } from "@/lib/auth/permissions";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function ProjectLayout({
     children,
     params,
}: {
     children: React.ReactNode;
     params: Promise<{ projectId: string }>;
}) {
     const { projectId } = await params;
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     // Verify project existence / access first
     const { data: project, error } = await supabase
          .from("projects")
          .select("id")
          .eq("id", projectId)
          .single();

     if (error || !project) {
          notFound();
     }

     // Fetch user permissions for this project context (Zero DB load on UI renders)
     const permissions = await getUserPermissions(supabase, projectId);

     return <CASLProvider permissions={permissions}>{children}</CASLProvider>;
}
