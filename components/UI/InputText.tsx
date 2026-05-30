"use client";

import { User } from "@/types/user/types";
import { memo, useEffect } from "react";

interface InputProps {
  placeholder?: string;
  id: string;
  name?: string;
  value: string | number;
  onInput: (val: string, key: string) => void;
  onClear?: () => void;
}

export const InputText = memo(
  ({
    placeholder = "Placeholder",
    id,
    name,
    value,
    onInput,
    onClear,
  }: InputProps) => {
    return (
      <div className="relative">
        <input
          type="text"
          className={` h-10 rounded px-4 w-full outline-none`}
          placeholder={placeholder}
          id={id}
          name={name}
          value={value}
          onInput={(e: React.InputEvent<HTMLInputElement>) => {
            onInput(e.currentTarget.value, id);
          }}
        />
        {value && onClear && (
          <span
            className="absolute right-2 top-2.5 cursor-pointer font-semibold"
            onClick={onClear}
          >
            X
          </span>
        )}
      </div>
    );
  },
);

InputText.displayName = "InputText";