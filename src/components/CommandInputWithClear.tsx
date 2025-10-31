import * as React from "react";
import { Search, X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CommandInputWithClear = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, value, onValueChange, ...props }, ref) => {
  const handleClear = () => {
    if (onValueChange) {
      onValueChange("");
    }
  };

  return (
    <div className="flex items-center border-b px-3 relative">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
});

CommandInputWithClear.displayName = CommandPrimitive.Input.displayName;

export { CommandInputWithClear };