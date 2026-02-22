import { cn } from "../../lib/cn";

export default function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default:
      "bg-slate-900 text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900",
    outline:
      "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-900/40",
  };
  const sizes = {
    sm: "text-sm px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
