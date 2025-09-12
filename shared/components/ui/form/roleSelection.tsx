// components/RoleSelector.tsx

import { UserRole } from "../../../api/models/UserRole";
import { Button } from "../button";
import { Label } from "./label";

interface RoleSelectorProps {
  role: UserRole | undefined;
  setRole: (role: UserRole) => void;
}

export default function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label>Role*</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={role === UserRole.ADMIN ? "default" : "secondary"}
          onClick={() => setRole(UserRole.ADMIN)}
          className={
            role === UserRole.ADMIN
              ? "flex-1 bg-secondary hover:bg-secondary-hover"
              : "flex-1 border-secondary text-secondary hover:bg-secondary/10"
          }
        >
          Couple
        </Button>

        <Button
          type="button"
          variant={role === UserRole.VENDOR ? "default" : "secondary"}
          onClick={() => setRole(UserRole.VENDOR)}
          className={
            role === UserRole.VENDOR
              ? "flex-1 bg-secondary hover:bg-secondary-hover"
              : "flex-1 border-secondary text-secondary hover:bg-secondary/10"
          }
        >
          Vendor
        </Button>
      </div>
    </div>
  );
}
