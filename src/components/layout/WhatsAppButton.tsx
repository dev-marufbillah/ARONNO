import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  const internationalNumber = phoneNumber.replace(/\D/g, "");
  if (!internationalNumber) return null;

  const message = encodeURIComponent("Hello ARONNO, I would like to know more about your products.");

  return (
    <a
      href={`https://wa.me/${internationalNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ARONNO on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/20 transition duration-300 hover:scale-105 hover:bg-[#1FB85A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] lg:bottom-8 lg:right-8"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/35 motion-safe:animate-ping motion-reduce:animate-none" aria-hidden="true" />
      <MessageCircle className="relative h-7 w-7" strokeWidth={2} />
    </a>
  );
}
