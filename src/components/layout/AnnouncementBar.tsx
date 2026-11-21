export default function AnnouncementBar({ enabled, text }: { enabled: boolean; text: string }) {
  if (!enabled || !text.trim()) return null;
  return (
    <div className="bg-black-deep flex h-9 items-center justify-center">
      <p className="font-sans text-[11px] tracking-luxury text-ivory/80 uppercase">
        <span className="text-gold mr-2">—</span>
        {text}
        <span className="text-gold ml-2">—</span>
      </p>
    </div>
  );
}
