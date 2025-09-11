import { ChevronDown } from "lucide-react";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Label } from "./label";

export interface SingleSelectDropdownProps {
  label?: string;
  options: any[];
  selected: any;
  setSelected: (selected: any) => void;
  placeholder?: string;
  className?: string;
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  label,
  options,
  selected,
  setSelected,
  placeholder = "Select option",
  className = "",
}) => (
  <div className={`gap-2 flex flex-col ${className}`}>
    {label && <Label>{label}</Label>}
    <DropdownMenu>
      <DropdownMenuTrigger className="relative border-gray-300 border rounded-lg p-3 w-full text-left bg-white shadow flex items-center justify-between">
        {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : placeholder}
        <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
      </DropdownMenuTrigger>
<<<<<<< HEAD
      <DropdownMenuContent className="w-full">
=======
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-full">
>>>>>>> origin/main
        {options && options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => setSelected(opt)}
            className={selected === opt ? "bg-primary text-white" : ""}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
<<<<<<< HEAD
);
=======
);
>>>>>>> origin/main
