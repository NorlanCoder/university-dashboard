
import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/context/ThemeContext";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
 
    const { theme } = useTheme();
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className
        )}
        style={{
          "--tw-ring-color": theme.primaryColor,
          color: theme.primaryColor,
        
        }}
        ref={ref}
        {...props}
      />
    )
  } 
) 
Input.displayName = "Input"
export { Input }

// style={{
//   borderColor: theme.borderColor, // Remplace `border-slate-200`
//   backgroundColor: theme.inputBg, // Remplace `bg-white`
//   color: theme.primaryColor, // Texte dynamique
//   outlineColor: theme.primaryColor, // Couleur de l'outline (focus)
//   "--tw-ring-color": theme.focusColor, // Remplace `focus-visible:ring-slate-950`
// }}