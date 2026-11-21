import type { InputHTMLAttributes } from "react";

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-12 w-full border border-black/10 bg-white px-4 text-sm text-black-deep outline-none transition placeholder:text-black/35 focus:border-gold ${className}`}
      {...props}
    />
  );
}
