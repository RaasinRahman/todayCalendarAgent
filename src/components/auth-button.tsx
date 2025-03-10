"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {session.user?.name || session.user?.email}
        </span>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("google")}>
      Sign In with Google
    </Button>
  );
}