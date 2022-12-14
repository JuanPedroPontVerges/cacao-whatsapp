import React from 'react';
import { SubmitHandler, FormProvider, UseFormReturn } from 'react-hook-form';

type FormProps = {
    form: UseFormReturn<any, any>;
    children: React.ReactNode;
    onSubmitForm: SubmitHandler<any>
}

const Form: React.FC<FormProps> = ({ form, children, onSubmitForm }) => {
    const { handleSubmit } = form
    return (
        <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <FormProvider {...form} >
                        <form action="#" method="POST" onSubmit={handleSubmit(onSubmitForm)}>
                            {children}
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}

export default Form;