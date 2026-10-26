"use client";

import * as React from "react";

import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
     CircleAlert,
     CircleCheck,
     Info,
     type LucideIcon,
     TriangleAlert,
} from "lucide-react";

export type ConfirmIcon = "warning" | "danger" | "info" | "success";

export interface ConfirmOptions {
     title: string;
     message?: string;
     icon?: ConfirmIcon;
     confirmText?: string;
     cancelText?: string;
     variant?: "default" | "destructive";
}

interface ConfirmState {
     options: ConfirmOptions;
     resolve: (value: boolean) => void;
}

const ConfirmContext = React.createContext<
     (options: ConfirmOptions) => Promise<boolean>
>(() => Promise.resolve(false));

const iconMap: Record<ConfirmIcon, { Icon: LucideIcon; className: string }> = {
     warning: { Icon: TriangleAlert, className: "text-orange-500" },
     danger: { Icon: CircleAlert, className: "text-destructive" },
     info: { Icon: Info, className: "text-primary" },
     success: { Icon: CircleCheck, className: "text-emerald-500" },
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
     const [state, setState] = React.useState<ConfirmState | null>(null);

     const open = state !== null;
     const { options } = state ?? { options: {} as ConfirmOptions };
     const hasConfirm = Boolean(options.confirmText);

     const confirm = React.useCallback((options: ConfirmOptions) => {
          return new Promise<boolean>((resolve) => {
               setState({ options, resolve });
          });
     }, []);

     const settle = React.useCallback(
          (value: boolean) => {
               state?.resolve(value);
               setState(null);
          },
          [state],
     );

     const { Icon, className } = iconMap[options.icon ?? "warning"];
     const confirmButtonVariant = options.variant ?? "default";

     return (
          <ConfirmContext.Provider value={confirm}>
               {children}
               <Dialog
                    open={open}
                    onOpenChange={(next) => {
                         if (!next) settle(false);
                    }}
               >
                    <DialogContent
                         showCloseButton={false}
                         className="max-w-sm text-center"
                    >
                         <Icon
                              className={cn("mx-auto size-11", className)}
                              strokeWidth={1.5}
                         />
                         <DialogHeader className="items-center gap-1.5">
                              <DialogTitle>{options.title}</DialogTitle>
                              {options.message && (
                                   <DialogDescription>
                                        {options.message}
                                   </DialogDescription>
                              )}
                         </DialogHeader>
                         <DialogFooter className="flex-row justify-center gap-2">
                              {hasConfirm && (
                                   <Button
                                        variant="outline"
                                        onClick={() => settle(false)}
                                   >
                                        {options.cancelText ?? "Cancel"}
                                   </Button>
                              )}
                              <Button
                                   variant={
                                        hasConfirm
                                             ? confirmButtonVariant
                                             : "default"
                                   }
                                   onClick={() => settle(true)}
                              >
                                   {hasConfirm ? options.confirmText : "OK"}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </ConfirmContext.Provider>
     );
}

export function useConfirm() {
     return React.useContext(ConfirmContext);
}
