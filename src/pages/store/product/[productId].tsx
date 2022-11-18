import { Disclosure } from "@headlessui/react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Cursed from 'public/assets/pizza-margarita.jpg'
import ProductDetailAction from "../../../components/ProductDetailAction";
import Button from "../../../components/Button";
import { DisplayType } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import Form from "../../../components/Form";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import StoreNav from "../../../components/layouts/StoreNav";
import { useLocalSession } from "../../../helpers/session.hooks";
import Loader from "../../../components/Loader";
export type ProductStoreCartFormInput = {
    additionalInfo?: string,
    amount: number,
    finalPrice: number;
    productStoreToOptionGroups: Record<string, {
        option: Record<string, {
            amount: number
        }>
    }>
}
const ProductDetail: NextPageWithLayout = ({ query }) => {
    const router = useRouter()
    const cartMutation = trpc.useMutation(['cartRouter.create']);
    const [{ cartId }, setSession] = useLocalSession();
    const productStoreCartQuery = trpc.useQuery(['productStoreCartRouter.findById', { id: query.productStoreCartId }])
    const productStoreCartMutation = trpc.useMutation(['productStoreCartRouter.create']);
    const productStoreCartUpdate = trpc.useMutation(['productStoreCartRouter.update']);
    const productStoreCartToOptionMutation = trpc.useMutation(['productStoreCartToOptionRouter.create']);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data, isLoading: isQueryLoading } = trpc.useQuery(["storeRouter.getProductDetailsByProductId", { id: query.productId }]);
    const form = useForm<ProductStoreCartFormInput>({
        defaultValues: {
            amount: 1,
        }
    });
    const [productPrice, setProductPrice] = useState<number | null | undefined>(data?.[0]?.productStore.product.price);
    useEffect(() => {
        if (!productPrice && data && data[0]) {
            if (data[0].productStore.product.price) {
                setProductPrice(data?.[0]?.productStore.product.price)
            }
        }
        if (!query.productStoreCartId) {
            form.setValue('finalPrice', data?.[0]?.productStore.product.price || 0);
        }
    }, [data])

    useEffect(() => {
        if (productStoreCartQuery.data) {
            if (!isLoaded) {
                const { additionalInfo, amount, finalPrice, productStoreCartToOptions } = productStoreCartQuery.data
                form.setValue('additionalInfo', additionalInfo as string)
                form.setValue('amount', amount)
                form.setValue('finalPrice', finalPrice)
                const formFields = form.getValues();
                for (const productStoreToOptionGroupId in formFields.productStoreToOptionGroups) {
                    for (const optionId in formFields.productStoreToOptionGroups[productStoreToOptionGroupId]?.option) {
                        const optionInQuery = productStoreCartToOptions.find((option) => option.optionId === optionId);
                        if (optionInQuery) {
                            form.setValue(`productStoreToOptionGroups.${productStoreToOptionGroupId}.option.${optionId}`, { amount: optionInQuery.amount });
                        }
                    }
                }
            }
            setIsLoaded(true)
        }
    }, [productStoreCartQuery])
    if (!data) {
        return <Loader />
    } else if (isQueryLoading || isLoading) {
        return <Loader />
    }

    const product = data[0]?.productStore.product
    const handleDescriptionText = (displayType: DisplayType, amount: number | null): string => {
        if (displayType && amount) {
            if (displayType.name.includes('Fija') && amount > 1) {
                return `Seleccioná ${amount} opciones`;
            } else if (displayType.name.includes('Fija') && amount === 1) {
                return 'Seleccioná 1 opcion';
            }
        } else {
            return 'Seleccioná las opciones que quieras';
        }
        return 'Seleccioná las opciones que quieras';
    };

    const handleSetPrice = (price: number) => {
        const amount = form.getValues('amount');
        if (productPrice) {
            setProductPrice(() => {
                const total = productPrice + price;
                form.setValue('finalPrice', total * amount);
                return total;
            });
        }
    }

    const handleOnClickSubstract = () => {
        const amount = form.getValues('amount')
        if (amount <= 1) {
            return;
        } else if (productPrice) {
            form.setValue('amount', amount - 1)
            const formFinalPrice = form.getValues('finalPrice');
            form.setValue('finalPrice', formFinalPrice - productPrice)
        }
    }

    const handleOnClickAdd = () => {
        if (productPrice) {
            const amount = form.getValues('amount')
            form.setValue('amount', amount + 1);
            form.setValue('finalPrice', (amount + 1) * productPrice)
        }
    }

    const onSubmitForm: SubmitHandler<ProductStoreCartFormInput> = async (input) => {
        setIsLoading(true)
        const { additionalInfo, amount, finalPrice, productStoreToOptionGroups } = input;
        if (query.productStoreCartId) { /* If is edit */
            await productStoreCartUpdate.mutateAsync({ id: query.productStoreCartId, additionalInfo, amount, finalPrice: finalPrice / amount })
            for (const productStoreToOptionGroupId in productStoreToOptionGroups) {
                const options = productStoreToOptionGroups[productStoreToOptionGroupId]?.option
                if (options && query.productStoreCartId) {
                    for (const optionId in options) {
                        const amount = options[optionId]?.amount || 0;
                        await productStoreCartToOptionMutation.mutateAsync({ amount, optionId, productStoreCartId: query.productStoreCartId })
                    }
                }
            }
            await productStoreCartQuery.refetch()
            setIsLoading(false)
            router.back()
            return;
        }
        if (data[0]?.productStoreId) {
            if (cartId) {
                const { id: productStoreCartId } = await productStoreCartMutation.mutateAsync({ cartId, productStoreId: data[0]?.productStoreId, additionalInfo, amount, finalPrice: finalPrice / amount });
                for (const productStoreToOptionGroupId in productStoreToOptionGroups) {
                    const options = productStoreToOptionGroups[productStoreToOptionGroupId]?.option
                    if (options && productStoreCartId) {
                        for (const optionId in options) {
                            const amount = options[optionId]?.amount || 0;
                            await productStoreCartToOptionMutation.mutateAsync({ amount, optionId, productStoreCartId })
                        }
                    }
                }
            } else {
                const { id: cartId } = await cartMutation.mutateAsync({ finalPrice });
                setSession({ cartId });
                const { id: productStoreCartId } = await productStoreCartMutation.mutateAsync({ cartId, productStoreId: data[0]?.productStoreId, additionalInfo, amount, finalPrice: finalPrice / amount });
                for (const productStoreToOptionGroupId in productStoreToOptionGroups) {
                    const options = productStoreToOptionGroups[productStoreToOptionGroupId]?.option
                    if (options && productStoreCartId) {
                        for (const optionId in options) {
                            const amount = options[optionId]?.amount || 0;
                            if (amount > 0) {
                                await productStoreCartToOptionMutation.mutateAsync({ amount, optionId, productStoreCartId })
                            }
                        }
                    }
                }
            }
            setIsLoading(false)
            router.back()
        }
    }
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
            <Form form={form} onSubmitForm={onSubmitForm}>
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 mb-24">
                    <div className="block">
                        <Image
                            src={data[0]?.productStore.product?.imageUrl || Cursed}
                            alt={`Imagen para el product ${product?.name}`}
                            width={'100%'}
                            height={'100%'}
                            layout={'responsive'}
                        />
                    </div>
                    <div className="mt-4">
                        <h1 className="text-2xl font-semibold">{product?.name}</h1>
                        <p className="italic">{product?.description}</p>
                    </div>
                    <div className="my-4">
                        {
                            data?.map((productStoreToOptionGroup, index) => (
                                <div key={productStoreToOptionGroup.id} className="my-2">
                                    <Disclosure as="div" defaultOpen={true}>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-purple-100 px-4 py-2 text-left text-base font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                                    <span>{productStoreToOptionGroup.optionGroup.name}</span>
                                                    <span className="italic text-sm">{handleDescriptionText(productStoreToOptionGroup.displayType, productStoreToOptionGroup.amount)}</span>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                    <ProductDetailAction
                                                        disabled={false}
                                                        form={form}
                                                        name={`productStoreToOptionGroups.${productStoreToOptionGroup.id}`}
                                                        amount={productStoreToOptionGroup.amount || 1}
                                                        displayType={productStoreToOptionGroup.displayType}
                                                        multipleUnits={productStoreToOptionGroup.multipleUnits}
                                                        handleSetPrice={handleSetPrice}
                                                        productOptions={productStoreToOptionGroup.productOptions}
                                                    />
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                </div>
                            ))
                        }
                    </div>

                    <div>
                        <label htmlFor="about" className="block text-lg font-medium text-gray-700">
                            Comentarios
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

                </div>
                <footer className="fixed bottom-0 bg-slate-600 w-full">
                    <div className="flex justify-between p-2 items-center">
                        <div className="basis-full">
                            <div className="w-full p-1">
                                <div className="flex justify-around items-center">
                                    <Button type='button' onClick={handleOnClickSubstract}>-</Button>
                                    <div className="border-2 p-1 border-white basis-1/3">
                                        <input readOnly aria-readonly className="w-full" type="number" {...form.register('amount', { valueAsNumber: true })} />
                                    </div>
                                    <Button type='button' onClick={handleOnClickAdd}>+</Button>
                                </div>
                            </div>
                        </div>
                        <div className="basis-full">
                            <Button className="w-full" type='submit'>
                                <div className="flex justify-around items-center">
                                    <p>Agregar</p>
                                    <input
                                        readOnly
                                        aria-readonly
                                        className="block w-full flex-1 bg-transparent rounded-none border-0 sm:text-sm"
                                        type="number"
                                        {...form.register('finalPrice', { valueAsNumber: true })}
                                    />
                                </div>
                            </Button>
                        </div>
                    </div>
                </footer>
            </Form>
        </>
    )
}

ProductDetail.getLayout = function getLayout(page) {
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


export default ProductDetail;