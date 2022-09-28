import React from "react"
interface FormErrorMessageProps {
    children: any;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ children }) => {
    return (
        <div className={'text-xl text-left pb-2 text-red-600 whitespace-pre-line'}>
            {children}
        </div>
    )
}

export default FormErrorMessage;