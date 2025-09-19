import { ChevronDown } from "lucide-react";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Label } from "./label";

export interface MultiSelectDropdownProps {
  label?: string;
  options: any[];
  selected: any[];
  setSelected: (selected: any[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  setSelected,
  placeholder = "Select options",
  className = "",
  disabled,
}) => (
  <div className={`gap-2 flex flex-col ${className}`}>
    {label && <Label>{label}</Label>}
    <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <button className="relative border-gray-300 border rounded-lg p-3 w-full text-left bg-white flex items-center justify-between outline-none focus-visible:border-0 focus-visible:ring-ring/50 focus-visible:ring-[2px] data-[state=open]:border-0 data-[state=open]:ring-ring/50 data-[state=open]:ring-[2px]">
              {(selected?.length ?? 0) > 0
                ? (selected ?? []).map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")
                : placeholder}
              <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-full">
            {Object.values(options).map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={e => {
                  e.preventDefault();
                  if ((selected ?? []).includes(type)) {
                    setSelected((selected ?? []).filter(t => t !== type));
                  } else {
                    setSelected([...(selected ?? []), type]);
                  }
                }}
                className={(selected ?? []).includes(type) ? "bg-primary text-white" : ""}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
  </div>
);

