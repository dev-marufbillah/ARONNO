import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import { requireAuth } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  await requireAuth();

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountNav />
        <div className="border border-black/10 bg-[#fbfaf7] p-8">
          <h1 className="text-4xl text-black-deep">Addresses</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
            Bangladesh-ready address architecture is in place with Full Name, Phone Number, Email, Division, District, Area and Full Address fields during checkout.
          </p>
        </div>
      </div>
    </Container>
  );
}
