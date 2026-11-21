import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import ProfileManager from "@/components/account/ProfileManager";
import { requireAuth } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const user = await requireAuth();

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountNav />
        <ProfileManager profile={user} />
      </div>
    </Container>
  );
}
