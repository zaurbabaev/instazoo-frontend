import { cn } from "../../lib/cn";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-transparent border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700",
        className,
      )}
      {...props}
    />
  );
}
