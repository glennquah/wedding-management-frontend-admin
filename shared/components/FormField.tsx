import { Input } from './ui/form/input';
import { Label } from './ui/form/label';

type FieldProps = {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  min?: string;
};

export default function FormField({
  label,
  id,
  type,
  value,
  onChange,
  required,
  placeholder,
  min,
}: FieldProps) {
  return (
    <div className="gap-2 flex flex-col">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
      />
    </div>
  );
}
