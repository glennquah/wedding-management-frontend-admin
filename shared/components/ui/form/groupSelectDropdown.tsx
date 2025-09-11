import { ChevronDown, Plus } from "lucide-react";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Input } from "./input";
import { Label } from "./label";

export interface GroupSelectDropdownProps {
  label?: string;
  existingGroups: string[];
  selected: string;
  setSelected: (selected: string) => void;
  placeholder?: string;
  className?: string;
}

export const GroupSelectDropdown: React.FC<GroupSelectDropdownProps> = ({
  label,
  existingGroups,
  selected,
  setSelected,
  placeholder = "Select or add group",
  className = "",
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddNewGroup = () => {
    if (newGroupName.trim()) {
      setSelected(newGroupName.trim());
      setNewGroupName("");
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewGroup();
    } else if (e.key === 'Escape') {
      setIsAddingNew(false);
      setNewGroupName("");
    }
  };

  const handleSelectGroup = (group: string) => {
    setSelected(group);
    setIsOpen(false);
  };

  const handleStartAddingNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingNew(true);
  };

  const handleCancelAddingNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingNew(false);
    setNewGroupName("");
  };

  return (
    <div className={`gap-2 flex flex-col ${className}`}>
      {label && <Label>{label}</Label>}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="relative border-gray-300 border rounded-lg p-3 w-full text-left bg-white shadow flex items-center justify-between">
          {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : placeholder}
          <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-full" onCloseAutoFocus={(e) => e.preventDefault()}>
          {existingGroups.map((group) => (
            <DropdownMenuItem
              key={group}
              onClick={() => handleSelectGroup(group)}
              className={selected === group ? "bg-primary text-white" : ""}
            >
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </DropdownMenuItem>
          ))}
          
          {existingGroups.length > 0 && <DropdownMenuSeparator />}
          
          {!isAddingNew ? (
            <DropdownMenuItem
              onClick={handleStartAddingNew}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Group
            </DropdownMenuItem>
          ) : (
            <div className="p-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  handleKeyPress(e);
                }}
                placeholder="Enter new group name"
                className="w-full"
                autoFocus
              />
              <div className="flex gap-1 mt-2">
                <button
                  type="button"
                  onClick={handleCancelAddingNew}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNewGroup}
                  className="px-2 py-1 text-xs bg-brand-600 text-white rounded hover:bg-brand-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};