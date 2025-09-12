import { Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOpenAICall } from "../hooks/useOpenAICall";
import { Label } from "./ui/form/label";

type TextInputWithAIProps = {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (val: string) => void;
  message: string; 
};

export const TextInputWithAI = ({
  label,
  placeholder,
  value,
  setValue,
  message,
}: TextInputWithAIProps) => {
const { result, loading: llmLoading, error, callLLM } = useOpenAICall();
  const [wandHover, setWandHover] = useState(false);

  const handleRefineBio = async () => {
    await callLLM(message);
  };

  useEffect(() => {
  if (result) {
    setValue(result);
  }
}, [result, setValue]);
  
  return (
      <div className="mt-4 gap-2 flex flex-col relative">
        <Label htmlFor="bio">{label}</Label>
        <textarea
          id={value}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className={`border border-gray-300 rounded-lg p-3 resize-none ${llmLoading && "text-gray-100"} `}
        />
        <button
          type="button"
          onClick={handleRefineBio}
          disabled={llmLoading}
          onMouseEnter={() => setWandHover(true)}
          onMouseLeave={() => setWandHover(false)}
          className={`absolute bottom-2 right-2 flex items-center justify-center bg-primary text-white px-2 py-2 rounded-full shadow transition-all duration-300 ${wandHover && "cursor-pointer shadow-lg"} ${llmLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-hover"}`}
        >
          <Wand2 className="w-5 h-5" />
          <span
            className={` 
              transition-all 
              duration-300 
              ease-in-out 
              whitespace-nowrap 
              overflow-hidden 
              ${wandHover ? "max-w-xs opacity-100 mx-2" : "w-0 opacity-0"}
            `}
          >
            Write your Bio
          </span>
        </button>
        {llmLoading && (
          <span className="absolute bottom-2 left-2 text-xs text-gray-800">Generating...</span>
        )}
        {error && (
          <span className="absolute bottom-2 left-2 text-xs text-red-500">{error}</span>
        )}
      </div>
  );
};
