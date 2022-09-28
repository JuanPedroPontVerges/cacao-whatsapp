import React from "react"

interface SelectPropsInterface {
    name: string;
    options?: { label: string; value: string | number }[];
}

const Select: React.FC<SelectPropsInterface> = ({ options, name }) => {
    return (
        <select name={name} className={'p-2.5 text-gray-600 text-base border-[2px] rounded-xl border-[#828384] bg-[#f8fafc] font-light w-full'}>
            {options?.map(({ label, value }, index) => (
                <option value={value} key={index} className={'text-black'}>{label}</option>
            ))}
        </select>
    )
}

export default Select;