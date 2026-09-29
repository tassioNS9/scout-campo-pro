import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils"; // ou ajuste o path

export const NavySelect = SelectPrimitive.Root;
export const NavySelectValue = SelectPrimitive.Value;

export function NavySelectTrigger({
  children,
  className,
  ...props
}: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border-scout-border bg-scout-card text-scout-text hover:bg-scout-card-hover flex w-full items-center gap-3 rounded-lg border px-4 py-2 text-sm transition-colors outline-none",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={14} className="text-scout-dim ml-auto" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function NavySelectContent({
  children,
  ...props
}: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        className="animate-in fade-in-0 zoom-in-95 border-scout-border bg-scout-card z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border shadow-lg"
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function NavySelectItem({
  children,
  ...props
}: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className="text-scout-text hover:bg-scout-card-hover flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors outline-none"
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto">
        <Check size={13} className="text-scout-green" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
