import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type FieldProps = {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
};

export default function FormField({ label, id, type, value, onChange, required, placeholder }: FieldProps) {
  return (
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}