import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Prevent mobile zoom and adjust for sticky header
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Call the original onFocus if provided
    props.onFocus?.(e);
    
    // On mobile, scroll to account for sticky header
    if (inputRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        if (inputRef.current) {
          const headerHeight = 200; // Sticky header height on mobile
          const elementPosition = inputRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Short delay for mobile keyboard
    }
  };

  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "text-[16px]", // Force 16px on all screens to prevent iOS zoom
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onFocus={handleFocus}
      {...props}
    />
  );
}

export { Input };