"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signout } from "@/lib/auth-actions"
import { getInitials } from "@/lib/helpers"
import {
  UserIcon,
  ClipboardCheckIcon,
  FolderOpenIcon,
  LogOutIcon,
} from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    id?: string
    name: string
    email: string
    avatar: string
  }
}) {
  const initials = getInitials(user.name)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label="User profile menu"
                className="aria-expanded:bg-muted cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-primary/20 transition-all"
              />
            }
          >
            <Avatar size="lg" className="size-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="font-semibold text-xs bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 rounded-xl p-1.5 shadow-lg"
            side="bottom"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-2.5 py-2 text-start rounded-lg hover:bg-muted/70 transition-colors cursor-pointer group"
                >
                  <Avatar className="size-9 ring-1 ring-border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start leading-tight min-w-0">
                    <span className="truncate font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email || "No email"}
                    </span>
                  </div>
                </Link>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-md hover:bg-accent"
              >
                <UserIcon className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profile & Account</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href="/my-tasks" />}
                className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-md hover:bg-accent"
              >
                <ClipboardCheckIcon className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">My Tasks</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href="/projects" />}
                className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-md hover:bg-accent"
              >
                <FolderOpenIcon className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Projects</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={signout}
              variant="destructive"
              className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-md text-red-600 focus:text-red-600 focus:bg-red-500/10 dark:text-red-400 dark:focus:bg-red-950/40"
            >
              <LogOutIcon className="size-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

