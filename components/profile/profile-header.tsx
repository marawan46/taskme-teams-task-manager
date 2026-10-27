"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/helpers";
import { Check, Copy, ShieldCheck, Calendar, Mail } from "lucide-react";
import type { Profile } from "@/types/index.types";

interface ProfileHeaderProps {
     profile: Profile | null;
     email: string;
     createdAt?: string | null;
}

export function ProfileHeader({
     profile,
     email,
     createdAt,
}: ProfileHeaderProps) {
     const [copied, setCopied] = useState(false);

     const fullName = profile?.full_name || "User";
     const avatarUrl = profile?.avatar_url || "";
     const initials = getInitials(fullName);

     const formattedDate = createdAt
          ? new Date(createdAt).toLocaleDateString("en-US", {
                 month: "short",
                 day: "numeric",
                 year: "numeric",
            })
          : null;

     const handleCopyId = () => {
          if (!profile?.id) return;
          navigator.clipboard.writeText(profile.id);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     return (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                         <div className="relative group">
                              <Avatar className="size-20 md:size-24 rounded-2xl ring-4 ring-background shadow-md">
                                   <AvatarImage
                                        src={avatarUrl}
                                        alt={fullName}
                                        className="object-cover"
                                   />
                                   <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-xl md:text-2xl font-bold">
                                        {initials}
                                   </AvatarFallback>
                              </Avatar>
                         </div>

                         <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2.5">
                                   <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-heading">
                                        {fullName}
                                   </h1>
                                   <Badge variant="primary" className="gap-1 font-semibold">
                                        <ShieldCheck className="size-3" />
                                        Active Account
                                   </Badge>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                   <span className="flex items-center gap-1.5">
                                        <Mail className="size-4 shrink-0" />
                                        {email}
                                   </span>

                                   {formattedDate && (
                                        <span className="flex items-center gap-1.5">
                                             <Calendar className="size-4 shrink-0" />
                                             Member since {formattedDate}
                                        </span>
                                   )}
                              </div>
                         </div>
                    </div>

                    {profile?.id && (
                         <div className="flex items-center gap-2 self-start md:self-auto bg-muted/50 border border-border/60 rounded-xl px-3 py-2 text-xs">
                              <span className="text-muted-foreground font-mono">
                                   ID: {profile.id.slice(0, 8)}...{profile.id.slice(-4)}
                              </span>
                              <Button
                                   type="button"
                                   variant="ghost"
                                   size="icon-xs"
                                   onClick={handleCopyId}
                                   title="Copy user ID"
                                   className="text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                   {copied ? (
                                        <Check className="size-3 text-emerald-500" />
                                   ) : (
                                        <Copy className="size-3" />
                                   )}
                              </Button>
                         </div>
                    )}
               </div>
          </div>
     );
}
