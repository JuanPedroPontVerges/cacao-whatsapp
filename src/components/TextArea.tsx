import React from "react"

interface TextAreaPropsInterface {
    name: string;
    placeholder?: string;
    rows?: number;
    cols?: number
}

const TextArea: React.FC<TextAreaPropsInterface> = ({ name, placeholder, rows, cols }) => {
    return (
        <textarea name={name} rows={rows} cols={cols} placeholder={placeholder} className={'placeholder:text-rounded-lg p-2.5 text-gray-600 text-base border-[2px] rounded-[10px] border-[#828384] bg-[#f8fafc] font-light w-full'} />
    )
}

export default TextArea;