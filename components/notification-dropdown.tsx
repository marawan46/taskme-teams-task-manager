"use client";

import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
     BellIcon,
     CheckCircleIcon,
     AlertTriangleIcon,
     InfoIcon,
     MessageSquareIcon,
     UserPlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType =
     | "success"
     | "warning"
     | "info"
     | "message"
     | "invite";

export interface Notification {
     id: string;
     type: NotificationType;
     title: string;
     description: string;
     timestamp: string;
     read: boolean;
}

const notificationConfig: Record<
     NotificationType,
     { icon: typeof BellIcon; color: string }
> = {
     success: {
          icon: CheckCircleIcon,
          color: "text-emerald-500",
     },
     warning: {
          icon: AlertTriangleIcon,
          color: "text-amber-500",
     },
     info: {
          icon: InfoIcon,
          color: "text-blue-500",
     },
     message: {
          icon: MessageSquareIcon,
          color: "text-purple-500",
     },
     invite: {
          icon: UserPlusIcon,
          color: "text-cyan-500",
     },
};

const mockNotifications: Notification[] = [
     {
          id: "1",
          type: "success",
          title: "Task Completed",
          description: "Design review has been marked as done.",
          timestamp: "2m ago",
          read: false,
     },
     {
          id: "2",
          type: "message",
          title: "New Comment",
          description: "Sarah commented on 'API Integration'.",
          timestamp: "15m ago",
          read: false,
     },
     {
          id: "3",
          type: "warning",
          title: "Deadline Approaching",
          description: "Sprint planning is due tomorrow.",
          timestamp: "1h ago",
          read: false,
     },
     {
          id: "4",
          type: "invite",
          title: "Team Invite",
          description: "You've been added to 'Frontend Team'.",
          timestamp: "3h ago",
          read: true,
     },
     {
          id: "5",
          type: "info",
          title: "System Update",
          description: "Scheduled maintenance on Saturday at 2 AM.",
          timestamp: "1d ago",
          read: true,
     },
];

function NotificationItem({ notification }: { notification: Notification }) {
     const config = notificationConfig[notification.type];
     const Icon = config.icon;

     return (
          <DropdownMenuItem className="flex items-start gap-3 py-3 cursor-pointer">
               <div className={cn("mt-0.5 shrink-0", config.color)}>
                    <Icon className="size-4" />
               </div>
               <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                         <span
                              className={cn(
                                   "text-sm font-medium",
                                   !notification.read && "font-semibold",
                              )}
                         >
                              {notification.title}
                         </span>
                         {!notification.read && (
                              <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                         )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                         {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-1 block">
                         {notification.timestamp}
                    </span>
               </div>
          </DropdownMenuItem>
     );
}

export function NotificationDropdown() {
     const notifications = mockNotifications;
     const unreadCount = notifications.filter((n) => !n.read).length;

     return (
          <DropdownMenu>
               <DropdownMenuTrigger
                    render={
                         <Button
                              variant="ghost"
                              size="icon"
                              className="relative"
                         />
                    }
               >
                    <BellIcon className="size-5" />
                    {unreadCount > 0 && (
                         <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                              {unreadCount > 9 ? "9+" : unreadCount}
                         </span>
                    )}
                    <span className="sr-only">Notifications</span>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                    className="w-80"
                    side="bottom"
                    align="end"
                    sideOffset={8}
               >
                    <DropdownMenuGroup>
                         <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                              <span className="text-sm font-semibold">
                                   Notifications
                              </span>
                              {unreadCount > 0 && (
                                   <span className="text-xs text-muted-foreground">
                                        {unreadCount} unread
                                   </span>
                              )}
                         </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-96 overflow-y-auto p-1">
                         {notifications.length > 0 ? (
                              notifications.map((notification) => (
                                   <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                   />
                              ))
                         ) : (
                              <div className="py-8 text-center text-sm text-muted-foreground">
                                   No notifications
                              </div>
                         )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-sm font-medium text-muted-foreground cursor-pointer">
                         View all notifications
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     );
}
