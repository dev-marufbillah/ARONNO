import Link from "next/link";
import Container from "@/components/ui/Container";
import { RegisterForm } from "@/components/forms/StoreForms";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Container className="py-16 md:py-20">
      <div className="mx-auto max-w-xl border border-black/10 bg-[#fbfaf7] p-8 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Create Your Account</p>
        <h1 className="mt-4 text-4xl text-black-deep">Register</h1>
        <p className="mt-3 text-sm leading-7 text-black/60">Create an ARONNO account to track orders, save wishlist items and enjoy a smoother checkout experience.</p>
        <div className="mt-8"><RegisterForm /></div>
        <div className="mt-6 text-sm text-black/55">
          Already have an account? <Link href="/login" className="text-black-deep">Sign in</Link>
        </div>
      </div>
    </Container>
  );
}
