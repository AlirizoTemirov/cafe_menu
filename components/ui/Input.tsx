import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-xl border-2 border-espresso-900/10 bg-cream-50 px-4 text-base text-espresso-900 placeholder:text-espresso-900/35 outline-none transition-colors focus:border-amber-500",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border-2 border-espresso-900/10 bg-cream-50 px-4 py-3 text-base text-espresso-900 placeholder:text-espresso-900/35 outline-none transition-colors focus:border-amber-500 min-h-[96px] resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-espresso-900/50",
        className
      )}
    >
      {children}
    </label>
  );
}
