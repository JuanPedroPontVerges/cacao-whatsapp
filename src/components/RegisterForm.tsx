import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import { trpc } from '../utils/trpc';
import GoogleAutoComplete from './GoogleAutoComplete';

type RegisterFormProps = {
    toggleModalVisibility: () => void;
}

export interface ICreateVenueFormValues {
    name: string;
    address: string;
    googlePlaceId: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleModalVisibility }) => {
    const { status, data: sessionData } = useSession();
    const form = useForm<ICreateVenueFormValues>()
    const { register, handleSubmit } = form

    const venueMutation = trpc.useMutation(["venueRouter.create"]);

    const onSubmitForm: SubmitHandler<ICreateVenueFormValues> = async (input) => {
        console.log('input', input);
        if (sessionData?.user?.id) {
            const venue = await venueMutation.mutate({...input, userId: sessionData?.user.id});
            console.log('venue', venue);
        }
        return;
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
                                                <GoogleAutoComplete />
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Crear sucursal
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