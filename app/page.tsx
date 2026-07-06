import Link from "next/link";
import Image from "next/image";

export default function Home() {
     return (
          <div className="flex flex-col h-screen items-center">
               <h1 className="m-auto max-w-2xl">Welcome to the Home Page</h1>
               <Link href={"/login"}>Login Page</Link>
          </div>
     );
}
