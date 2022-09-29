import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import { trpc } from '../utils/trpc';
import GoogleAutoComplete from './GoogleAutoComplete';

type RegisterFormProps = {
    toggleModalVisibility: () => void;
}

export interface IRegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleModalVisibility }) => {
    const form = useForm<IRegisterFormValues>()
    const { register, handleSubmit } = form

    const onSubmitForm: SubmitHandler<IRegisterFormValues> = (input) => {
        console.log('input', input);
        return;
        // userMutation.mutate({ name: 'Juan Pedro', email: 'jppontverges@gmail.com' })
        // toggleModalVisibility();
    }

    return (
        <>
            <div>
                <div className="hidden sm:block" aria-hidden="true">
                    <div className="py-5">
                        <div className="border-t border-gray-200" />
                    </div>
                </div>
                <div className="mt-10 sm:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-6">
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <FormProvider {...form} >
                                <form action="#" method="POST" onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="overflow-hidden shadow sm:rounded-md">
                                        <div className="bg-white px-4 py-5 sm:p-6">
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                                        Nombre
                                                    </label>
                                                    <input
                                                        {...register("firstName")}
                                                        type="text"
                                                        id="first-name"
                                                        autoComplete="given-name"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-6 sm:col-span-3">
                                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                                        Apellido
                                                    </label>
                                                    <input
                                                        {...register("lastName")}
                                                        type="text"
                                                        id="last-name"
                                                        autoComplete="family-name"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-6 sm:col-span-6">
                                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                                        Email
                                                    </label>
                                                    <input
                                                        {...register("email")}
                                                        type="text"
                                                        id="email-address"
                                                        autoComplete="email"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                <GoogleAutoComplete />
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Registrarse
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterForm;