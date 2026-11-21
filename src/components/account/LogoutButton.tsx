"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Logout
    </Button>
  );
}
