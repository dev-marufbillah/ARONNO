import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const styles = {
  primary:
    "inline-flex items-center justify-center border border-gold bg-gold px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-gold",
  secondary:
    "inline-flex items-center justify-center border border-black-deep/20 bg-transparent px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-black-deep transition hover:border-gold hover:text-gold",
  dark:
    "inline-flex items-center justify-center border border-ivory/20 bg-transparent px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-gold hover:text-gold",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <button className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link href={href} className={`${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
