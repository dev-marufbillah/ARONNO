import Container from "@/components/ui/Container";
import { ForgotPasswordForm } from "@/components/forms/StoreForms";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <Container className="py-16 md:py-20">
      <div className="mx-auto max-w-xl border border-black/10 bg-[#fbfaf7] p-8 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Password Assistance</p>
        <h1 className="mt-4 text-4xl text-black-deep">Forgot Password</h1>
        <p className="mt-3 text-sm leading-7 text-black/60">Password reset email architecture is prepared. Connect the email provider variables to activate delivery.</p>
        <div className="mt-8"><ForgotPasswordForm /></div>
      </div>
    </Container>
  );
}
