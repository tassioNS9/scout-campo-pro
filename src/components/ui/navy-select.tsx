import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils"; // ou ajuste o path

const C = {
  card: "#1c2438",
  cardHover: "#212b42",
  cardHeader: "#161e30",
  border: "#252f4a",
  green: "#00e676",
  greenDim: "#1a3b2a",
  greenBorder: "#1a4d30",
  text: "#e5e7eb",
  muted: "#8b95b0",
  dim: "#4b5780",
};

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
        "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors outline-none",
        className,
      )}
      style={{
        backgroundColor: C.card,
        color: C.text,
        border: `1px solid ${C.border}`,
      }}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={14} style={{ color: C.dim, marginLeft: "auto" }} />
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
        className="animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden rounded-lg"
        style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          minWidth: "var(--radix-select-trigger-width)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
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
      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors outline-none"
      style={{ color: C.text }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = C.cardHover)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto">
        <Check size={13} style={{ color: C.green }} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
