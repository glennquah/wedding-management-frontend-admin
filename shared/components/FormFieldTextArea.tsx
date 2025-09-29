import { Label } from './ui/form/label';
import { Textarea } from './ui/textarea';

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
};

export default function FormField({
  label,
  id,
  value,
  onChange,
  required,
  placeholder,
  rows = 3,
}: FieldProps) {
  return (
    <div className="gap-2 flex flex-col">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="border border-gray-300 focus:border-0"
      />
    </div>
  );
}
