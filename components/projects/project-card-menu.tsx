"use client";

import { useState } from "react";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, InfoIcon } from "lucide-react";
import { ProjectInfoDialog } from "./project-info-dialog";

interface ProjectCardMenuMember {
     full_name: string | null;
     avatar_url: string | null;
     role: string;
}

interface ProjectCardMenuProps {
     project: {
          id: string;
          name: string;
          description: string | null;
          created_at: string | null;
          due_date: string | null;
     };
     members?: ProjectCardMenuMember[];
     memberCount?: number;
}

export function ProjectCardMenu({
     project,
     members = [],
     memberCount = 0,
}: ProjectCardMenuProps) {
     const [infoOpen, setInfoOpen] = useState(false);

     return (
          <>
               <DropdownMenu>
                    <DropdownMenuTrigger
                         render={
                              <Button
                                   variant="ghost"
                                   size="icon-sm"
                                   onClick={(e) => e.stopPropagation()}
                              />
                         }
                    >
                         <MoreHorizontal className="size-4" />
                         <span className="sr-only">More options</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={8}>
                         <DropdownMenuItem onClick={() => {setInfoOpen(true)}}>
                              <InfoIcon className="size-4" />
                              Info
                         </DropdownMenuItem>
                    </DropdownMenuContent>
               </DropdownMenu>

               <ProjectInfoDialog
                    open={infoOpen}
                    onOpenChange={setInfoOpen}
                    project={project}
                    members={members}
                    memberCount={memberCount}
               />
          </>
     );
}
