import { NavUser } from "./nav-user";
import { NotificationDropdown } from "./notification-dropdown";
import { SidebarTrigger } from "./ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function DashboardHeader() {
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     const {
          data: { user },
     } = await supabase.auth.getUser();

     let profile = null;
     if (user) {
          const { data } = await supabase
               .from("profiles")
               .select("*")
               .eq("id", user.id)
               .maybeSingle();
          profile = data;
     }

     const fullName =
          profile?.full_name ??
          (user?.user_metadata?.full_name as string | undefined) ??
          user?.email?.split("@")[0] ??
          "User";

     const email = profile?.email ?? user?.email ?? "";
     const avatarUrl =
          profile?.avatar_url ??
          (user?.user_metadata?.avatar_url as string | undefined) ??
          "";

     const userData = {
          id: user?.id,
          name: fullName,
          email,
          avatar: avatarUrl,
     };

     return (
          <header className="border-b *:border-border sticky top-0 z-40 bg-background">
               <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                         <SidebarTrigger className="-ml-1" />
                    </div>
                    <div className="flex items-center gap-4">
                         <NotificationDropdown />
                         <NavUser user={userData} />
                    </div>
               </div>
          </header>
     );
}
