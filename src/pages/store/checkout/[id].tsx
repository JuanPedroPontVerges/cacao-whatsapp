import { Disclosure } from "@headlessui/react"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Form from "../../../components/Form"
import StoreNav from "../../../components/layouts/StoreNav"
import { trpc } from "../../../utils/trpc"
import { NextPageWithLayout } from "../../_app"

// TODO
// [] Hacer el on submit del form y crear la orden junto al usario

const Checkout: NextPageWithLayout = ({ query }) => {
    const router = useRouter()
    const paymentTypeQuery = trpc.useQuery(["paymentTypeRouter.findAll"])
    const form = useForm<any>();
    const onSubmitForm = (input: any) => {
        console.log('input', input);
    };
    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <ArrowLeftCircleIcon className="block h-6 w-6 text-white" aria-hidden="true" onClick={() => router.back()} />
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <span className={'text-white'}>
                                            WAPI
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
            <div className='container mx-auto'>
                <div className="flex justify-center">
                    <Form form={form} onSubmitForm={onSubmitForm}>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Nombre y apellido
                            </label>
                            <input
                                {...form.register('fullName')}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className={'mt-4'}>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Teléfono
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                    <span className="text-gray-500 sm:text-sm">+549</span>
                                </div>
                                <input
                                    {...form.register('phoneNumber')}
                                    type="number"
                                    className="block w-full rounded-md border-gray-300 pl-12 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-6">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Lo retiro personalmente
                                </label>
                                <input
                                    {...form.register('pick-up')}
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                    Forma de pago
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                    {paymentTypeQuery.data?.map((type) => (
                                        <option value={type.id} key={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                className="flex items-center justify-center rounded-md border 
                                border-transparent bg-[#128c7e] px-6 py-3 text-base font-medium
                                 text-white shadow-sm"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </Form>
                </div>

            </div>
        </>
    )
}


Checkout.getLayout = function getLayout(page) {
    return (
        <StoreNav>
            {page}
        </StoreNav>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    return {
        props: { query: ctx.query } || {}
    }
}


export default Checkout;