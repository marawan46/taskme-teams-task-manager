import { describe, it, expect, vi } from "vitest";
import { updateProfile, updatePassword } from "@/lib/actions/profile";

vi.mock("next/headers", () => ({
     cookies: vi.fn().mockResolvedValue({
          getAll: vi.fn().mockReturnValue([]),
          set: vi.fn(),
     }),
}));

vi.mock("next/cache", () => ({
     revalidatePath: vi.fn(),
}));

describe("Profile Server Actions", () => {
     describe("updateProfile validation", () => {
          it("rejects empty full name", async () => {
               const res = await updateProfile({
                    full_name: "",
                    avatar_url: null,
               });
               expect(res.status).toBe("error");
               expect(res.error?.message).toMatch(/full name/i);
          });

          it("rejects full name exceeding 100 characters", async () => {
               const res = await updateProfile({
                    full_name: "a".repeat(101),
                    avatar_url: null,
               });
               expect(res.status).toBe("error");
               expect(res.error?.message).toMatch(/100 characters/i);
          });
     });

     describe("updatePassword validation", () => {
          it("rejects password shorter than 6 characters", async () => {
               const res = await updatePassword({
                    password: "123",
               });
               expect(res.status).toBe("error");
               expect(res.error?.message).toMatch(/at least 6 characters/i);
          });
     });
});
