import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-espresso-900 text-cream-50 hover:bg-espresso-800 active:bg-espresso-950",
  secondary:
    "bg-amber-500 text-espresso-950 hover:bg-amber-400 active:bg-amber-600",
  ghost: "bg-transparent text-espresso-800 hover:bg-espresso-900/5",
  danger: "bg-brick-500 text-cream-50 hover:bg-brick-600",
  outline:
    "bg-transparent border-2 border-espresso-900/15 text-espresso-900 hover:border-espresso-900/30",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-14 px-6 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-full",
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center gap-2 font-semibold transition-[transform,background-color,border-color,color,opacity] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
