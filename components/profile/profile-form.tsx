"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateProfile } from "@/lib/actions/profile";
import { getInitials } from "@/lib/helpers";
import {
     CheckCircle2,
     AlertCircle,
     Trash2,
     Image as ImageIcon,
} from "lucide-react";
import type { Profile } from "@/types/index.types";

interface ProfileFormProps {
     profile: Profile | null;
     email: string;
}

const PRESET_AVATARS = [
     {
          label: "Atlas",
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
     },
     {
          label: "Alex",
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
     },
     {
          label: "Jordan",
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
     },
     {
          label: "Morgan",
          url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
     },
     {
          label: "Taylor",
          url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
     },
     {
          label: "Robin",
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
     },
];

export function ProfileForm({ profile, email }: ProfileFormProps) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();

     const [fullName, setFullName] = useState(profile?.full_name || "");
     const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
     const [statusMessage, setStatusMessage] = useState<{
          type: "success" | "error";
          text: string;
     } | null>(null);

     const initials = getInitials(fullName || "User");

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setStatusMessage(null);

          startTransition(async () => {
               const res = await updateProfile({
                    full_name: fullName.trim(),
                    avatar_url: avatarUrl.trim() || null,
               });

               if (res.status === "error") {
                    setStatusMessage({
                         type: "error",
                         text: res.error?.message || "Failed to update profile",
                    });
               } else {
                    setStatusMessage({
                         type: "success",
                         text: "Profile updated successfully!",
                    });
                    router.refresh();
               }
          });
     };

     return (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
               <div className="mb-6 pb-4 border-b border-border/60 flex items-center justify-between">
                    <div>
                         <h2 className="text-lg font-bold text-foreground font-heading">
                              Personal Information
                         </h2>
                         <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                              Update your public profile details and avatar.
                         </p>
                    </div>
               </div>

               {statusMessage && (
                    <div
                         className={`mb-6 flex items-center gap-3 rounded-xl p-3.5 text-sm transition-all ${
                              statusMessage.type === "success"
                                   ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                   : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                         }`}
                    >
                         {statusMessage.type === "success" ? (
                              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                         ) : (
                              <AlertCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
                         )}
                         <span className="font-medium">{statusMessage.text}</span>
                    </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Customization Section */}
                    <div className="space-y-3">
                         <FieldLabel className="text-sm font-semibold flex items-center gap-1.5">
                              <ImageIcon className="size-4 text-muted-foreground" />
                              Profile Picture
                         </FieldLabel>

                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-muted/30 border border-border/70">
                              <Avatar className="size-16 rounded-xl ring-2 ring-primary/20 shrink-0">
                                   <AvatarImage
                                        src={avatarUrl}
                                        alt={fullName}
                                        className="object-cover"
                                   />
                                   <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                                        {initials}
                                   </AvatarFallback>
                              </Avatar>

                              <div className="space-y-2 flex-1 w-full">
                                   <p className="text-xs text-muted-foreground">
                                        Select from curated presets or provide an image URL.
                                   </p>

                                   <div className="flex flex-wrap items-center gap-2">
                                        {PRESET_AVATARS.map((preset) => (
                                             <button
                                                  type="button"
                                                  key={preset.url}
                                                  onClick={() => setAvatarUrl(preset.url)}
                                                  className={`size-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                                                       avatarUrl === preset.url
                                                            ? "border-primary ring-2 ring-primary/30"
                                                            : "border-transparent opacity-80 hover:opacity-100"
                                                  }`}
                                                  title={`Preset: ${preset.label}`}
                                             >
                                                  <Avatar className="size-full">
                                                       <AvatarImage
                                                            src={preset.url}
                                                            alt={preset.label}
                                                       />
                                                       <AvatarFallback className="text-[10px]">
                                                            {preset.label[0]}
                                                       </AvatarFallback>
                                                  </Avatar>
                                             </button>
                                        ))}

                                        {avatarUrl && (
                                             <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="xs"
                                                  onClick={() => setAvatarUrl("")}
                                                  className="text-xs text-muted-foreground hover:text-destructive cursor-pointer gap-1"
                                             >
                                                  <Trash2 className="size-3" />
                                                  Clear
                                             </Button>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>

                    <FieldGroup className="space-y-4">
                         {/* Avatar URL Input */}
                         <Field>
                              <FieldLabel htmlFor="avatar_url" className="text-sm font-medium">
                                   Avatar Image URL
                              </FieldLabel>
                              <Input
                                   id="avatar_url"
                                   type="url"
                                   placeholder="https://example.com/avatar.jpg"
                                   value={avatarUrl}
                                   onChange={(e) => setAvatarUrl(e.target.value)}
                                   className="h-10"
                              />
                         </Field>

                         {/* Full Name Input */}
                         <Field>
                              <FieldLabel htmlFor="full_name" className="text-sm font-medium">
                                   Full Name <span className="text-destructive">*</span>
                              </FieldLabel>
                              <Input
                                   id="full_name"
                                   type="text"
                                   required
                                   placeholder="John Doe"
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   className="h-10"
                              />
                         </Field>

                         {/* Email (Readonly) */}
                         <Field>
                              <FieldLabel htmlFor="email" className="text-sm font-medium">
                                   Email Address
                              </FieldLabel>
                              <Input
                                   id="email"
                                   type="email"
                                   disabled
                                   value={email}
                                   className="h-10 bg-muted/50 cursor-not-allowed opacity-80"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                   Email cannot be changed directly from here as it is tied to your login authentication.
                              </p>
                         </Field>
                    </FieldGroup>

                    <div className="flex justify-end pt-2">
                         <Button
                              type="submit"
                              disabled={isPending || !fullName.trim()}
                              className="px-6 h-10 font-semibold cursor-pointer min-w-32"
                         >
                              {isPending ? (
                                   <>
                                        <Spinner className="size-4 mr-2" />
                                        Saving...
                                   </>
                              ) : (
                                   "Save Changes"
                              )}
                         </Button>
                    </div>
               </form>
          </div>
     );
}
