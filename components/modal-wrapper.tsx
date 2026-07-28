"use client";

import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";

interface ModalWrapperProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     title: string;
     description?: string;
     children: React.ReactNode;
     footer?: React.ReactNode;
     className?: string;
}

export function ModalWrapper({
     open,
     onOpenChange,
     title,
     description,
     children,
     footer,
     className,
}: ModalWrapperProps) {
     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className={className}>
                    <DialogHeader>
                         <DialogTitle>{title}</DialogTitle>
                         {description && (
                              <DialogDescription>
                                   {description}
                              </DialogDescription>
                         )}
                    </DialogHeader>
                    {children}
                    {footer && <DialogFooter>{footer}</DialogFooter>}
               </DialogContent>
          </Dialog>
     );
}
