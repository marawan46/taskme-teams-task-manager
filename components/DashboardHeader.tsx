import { NavUser } from "./nav-user";
import { NotificationDropdown } from "./notification-dropdown";
import { SidebarTrigger } from "./ui/sidebar";

export default function DashboardHeader() {
     const data = {
          user: {
               name: "shadcn",
               email: "m@example.com",
               avatar: "/avatars/shadcn.jpg",
          },
     };
     return (
          <header className="border-b *:border-border sticky top-0 z-40 bg-background">
               <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                         <SidebarTrigger className="-ml-1" />
                    </div>
                    <div className="flex items-center gap-4">
                         <NotificationDropdown />
                         <NavUser user={data.user} />
                    </div>
               </div>
          </header>
     );
}
