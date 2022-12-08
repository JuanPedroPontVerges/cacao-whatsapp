import { Disclosure } from "@headlessui/react"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import Form from "../../../components/Form"
import StoreNav from "../../../components/layouts/StoreNav"
import Loader from "../../../components/Loader"
import { trpc } from "../../../utils/trpc"
import { NextPageWithLayout } from "../../_app"

type CheckoutFormInput = {
    fullName: string;
    phoneNumber: string;
    paymentTypeId: string;
    additionalInfo: string;
}

const Checkout: NextPageWithLayout = ({ query }) => {
    const cartId = query.cartId as string;
    const router = useRouter();
    const paymentTypeQuery = trpc.useQuery(["paymentTypeRouter.findAll"])
    const orderMutation = trpc.useMutation(["orderRouter.create"])
    const paymentMutation = trpc.useMutation(["paymentRouter.create"])
    const cartQuery = trpc.useQuery(["cartRouter.findById", { id: cartId }])
    const cartMutation = trpc.useMutation(["cartRouter.updateState"])
    const form = useForm<CheckoutFormInput>();
    useEffect(() => {
        if (cartQuery.data?.order) {
            form.setValue('additionalInfo', cartQuery.data?.order?.additionalInfo || '')
            form.setValue('paymentTypeId', cartQuery.data?.order?.PaymentType.id || '')
        }
        if (cartQuery.data?.customer) {
            form.setValue('fullName', cartQuery.data?.customer?.fullName || '')
            form.setValue('phoneNumber', cartQuery.data?.customer?.phoneNumber || '')
        }
    }, [cartQuery])
    if (cartQuery.isLoading) return <Loader />
    const finalPrice = cartQuery.data?.productStoreCarts.reduce((acc: any, value: any) => ((value.finalPrice * value.amount) + acc), 0)
    const mercadoPagoPaymentTypeId = paymentTypeQuery?.data?.find((paymentType: any) => paymentType.name == 'Mercadopago')?.id
    const onSubmitForm: SubmitHandler<CheckoutFormInput> = async (input) => {
        if (!input.paymentTypeId) input.paymentTypeId = paymentTypeQuery.data?.[0]?.id || '123';
        if (cartQuery.data?.customer?.venue.menus?.[0]?.setting) {
            if (cartQuery.data?.customer?.venue.menus?.[0]?.setting.minPurchaseAmount || 10_000_000 < finalPrice) {
                alert(`Min purchase amount is: ${cartQuery.data?.customer?.venue.menus?.[0]?.setting.minPurchaseAmount}`)
                return;
            }
        }
        const result = await orderMutation.mutateAsync({ ...input, cartId })
        if (mercadoPagoPaymentTypeId !== input.paymentTypeId) {
            await cartMutation.mutateAsync({ cartId, state: 'FINISHED' })
        } else {
            // Cart is not finished yet, will be when user pays with mercadopago
        }
        if (!result.payment) {
            await paymentMutation.mutateAsync({ orderId: result.id })
        }
        router.push(`/store/checkout/success/${result.id}`)
    };
    return (
        <>
            {orderMutation.isLoading ? <Loader /> : (
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
                                        <input
                                            {...form.register('phoneNumber')}
                                            type="number"
                                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Forma de pago
                                        </label>
                                        <select
                                            {...form.register('paymentTypeId')}
                                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        >
                                            {paymentTypeQuery.data?.map((type) => (
                                                <option value={type.id} key={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={'mt-4'}>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                        Comentarios adicionales
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            {...form.register('additionalInfo')}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Deja cualquier aclaración"
                                        />
                                    </div>
                                </div>
                                <div className='mt-2 text-lg'>
                                    Total: ${finalPrice}
                                </div>
                                <div className="my-4 flex justify-center">
                                    <button
                                        type={'submit'}
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
            )}
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