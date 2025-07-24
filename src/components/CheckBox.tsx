import React from "react";

type Color = "blue" | "red" | "green" | "yellow" | "purple" | "pink" | "teal" | "gray";

interface ColorCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    color?: Color;
}

export const ColorCheckbox: React.FC<ColorCheckboxProps> = ({
    checked,
    onChange,
    label,
    color = "blue",
}) => {
    const colorClass = `text-${color}-600 focus:ring-${color}-500`;
    const borderClass = `border-${color}-500`;

    return (
        <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={`h-5 w-5 rounded border-2 ${borderClass} ${colorClass} focus:ring-2`}
            />
            {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
    );
};
