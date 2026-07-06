"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type FormState = {
  error: string | null
  success: boolean
}

export async function login(prevState: FormState, formData: FormData) {
     const cookieStore = await cookies();

     const supabase = createClient(cookieStore);
     // console.log("FormData: ",formData);
     
     // type-casting here for convenience
     // in practice, you should validate your inputs
     const data = {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
     };

     const { error } = await supabase.auth.signInWithPassword(data);

     if (error) {
          return {
               error: error.message,
               success: false,
          };
     }

     return {
          error: null,
          success: true,
     };
}

export async function signup(prevState: FormState,formData: FormData) {
     const cookieStore = await cookies();

     const supabase = createClient(cookieStore);
     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay of 2 seconds
     // type-casting here for convenience
     // in practice, you should validate your inputs
     const firstName = formData.get("first-name") as string;
     const lastName = formData.get("last-name") as string;
     const data = {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          options: {
               data: {
                    full_name: `${firstName + " " + lastName}`,
                    email: formData.get("email") as string,
               },
          },
     };

     const { error } = await supabase.auth.signUp(data);

     if (error) {
          return {
               error: error.message,
               success: false,
          };
     }
     return {
          error: null,
          success: true,
     };

}

export async function signout() {
     const cookieStore = await cookies();

     const supabase = createClient(cookieStore);
     const { error } = await supabase.auth.signOut();
     if (error) {
          console.log(error);
          redirect("/error");
     }

     redirect("/logout");
}

export async function signInWithGoogle() {
     const cookieStore = await cookies();

     const supabase = createClient(cookieStore);
     const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
               redirectTo: "http://localhost:3000/auth/callback",
               queryParams: {
                    access_type: "offline",
                    prompt: "consent",
               },
          },
     });

     if (error) {
          console.log(error);
          redirect("/error");
     }

     redirect(data.url);
}
