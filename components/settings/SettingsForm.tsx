"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { updateProfileName } from "@/lib/actions/profile";

const FIELD_LABEL = "text-xs font-semibold uppercase tracking-wider text-muted";

export function SettingsForm({
  initialName,
  email,
}: {
  initialName: string | null;
  email: string | null;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(initialName ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateProfileName(name);
      toast("Profile updated", { variant: "success" });
    } catch {
      toast("Couldn't save changes", { variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className={FIELD_LABEL}>Full name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className={FIELD_LABEL}>Email</label>
        <Input value={email ?? ""} disabled />
      </div>
      <Button onClick={save} loading={saving} disabled={!name.trim()}>
        Save changes
      </Button>
    </div>
  );
}
