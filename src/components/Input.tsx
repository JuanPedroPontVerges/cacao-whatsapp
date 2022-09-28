import React from "react"

interface InputPropsInterface {
    placeholder?: string;
    type?: string;
    name: string;
}

const Input: React.FC<InputPropsInterface> = ({ placeholder, type, name }) => {
    return (
        <input name={name} type={type} placeholder={placeholder} className={'p-2.5 text-black text-base border-[2px] rounded-xl border-[#828384] bg-[#f8fafc] font-light w-full placeholder:text-gray-600'} />
    )
}

export default Input;