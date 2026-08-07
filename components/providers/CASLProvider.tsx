"use client";

import React, { createContext, useContext, useMemo } from "react";
import { AbilityProvider } from "@casl/react";
import { createAbilityForUser, AppAbility } from "@/lib/auth/ability";

interface CASLProviderProps {
     permissions: string[]; // Fetched server-side and passed down
     children: React.ReactNode;
}

const AbilityContext = createContext<AppAbility | null>(null);

export const CASLProvider = ({ permissions, children }: CASLProviderProps) => {
     // Memoize ability instance so it only recalculates when permissions change
     const ability = useMemo(
          () => createAbilityForUser(permissions),
          [permissions],
     );

     return <AbilityProvider value={ability}>{children}</AbilityProvider>;
};
