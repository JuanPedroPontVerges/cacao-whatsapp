import React from "react"
interface ButtonProps {
    type?: "button" | "submit" | "reset" | undefined;
    id?: string;
    children: any;
    className?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, id, children, className, onClick }) => {
    return (
        <button type={type} id={id} onClick={onClick} className={`rounded-lg p-3 px-4 text-white bg-slate-600 text-sm bg-c-yellow font-bold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${className}`}>
            {children}
        </button>
    )
}

export default Button;