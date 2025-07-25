import React from "react";

type Color = "blue" | "red" | "green" | "yellow" | "purple" | "pink" | "teal" | "gray";

interface ColorCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export const ColorCheckbox: React.FC<ColorCheckboxProps> = ({
    checked,
    onChange,
    label,
}) => {
    return (
        <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={`h-5 w-5 rounded border-2 accent-superOfficeGreen`}
            />
            {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
    );
};
