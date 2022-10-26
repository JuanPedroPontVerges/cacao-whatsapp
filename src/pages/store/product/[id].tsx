import { Disclosure } from "@headlessui/react";
import { ShoppingCartIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Cursed from 'public/assets/alien.png'
import ProductDetailAction from "../../../components/ProductDetailAction";
import Button from "../../../components/Button";
import { DisplayType } from "@prisma/client";
import { useForm } from "react-hook-form";
import Form from "../../../components/Form";
const ProductDetail: NextPage<Record<string, string>> = ({ id }) => {
    const router = useRouter()
    const { data } = trpc.useQuery(["storeRouter.getProductDetails", { id }]);
    const form = useForm();
    const optionGroups = form.watch('optionGroups');
    console.log('optionGroups', optionGroups);
    const limitedOptionGroups = data?.map((optionGroup: any) => {
        return optionGroup.displayType.name.includes('Cantidad Fija') ? optionGroup.id : null
    }).filter((notNull) => notNull != null)
    for (const optionGroup in optionGroups) {
        if (limitedOptionGroups?.includes(optionGroup)) {
            console.log('optionGroup', optionGroup);
            console.log('data', data);
            const maxAmount = data?.find((data: any) => (data.id == optionGroup))?.amount || 0
            let counter = 0;
            Object.entries(optionGroups[optionGroup].option).map((value) => {
                const amount = value[1].amount;
                counter += amount;
            })
            console.log('maxAmount', maxAmount);
            console.log('counter', counter);
            if (counter > maxAmount) alert('Basta flaco')
            else console.log('no impota, segui')
        }
    }
    if (!data) return (<>No data</>)
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

    const onSubmitForm = (input: any) => {
        console.log('input', input);
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
                                        {/* <img
                                    className="block h-8 w-auto lg:hidden"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                                <img
                                    className="hidden h-8 w-auto lg:block"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                /> */}
                                        <span className={'text-white'}>
                                            WAPI
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
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
                            data?.map((group) => (
                                <div key={group.id} className="my-2">
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-purple-100 px-4 py-2 text-left text-base font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                                    <span>{group.optionGroup.name}</span>
                                                    <span className="italic text-sm">{handleDescriptionText(group.displayType, group.amount)}</span>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                    <ProductDetailAction
                                                        form={form}
                                                        name={`optionGroups.${group.id}`}
                                                        amount={group.amount || 1}
                                                        displayType={group.displayType}
                                                        multipleUnits={group.multipleUnits}
                                                        optionGroup={group.optionGroup}
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
                                    <Button>-</Button>
                                    <div className="border-2 p-1 border-white">
                                        1
                                    </div>
                                    <Button>+</Button>
                                </div>
                            </div>
                        </div>
                        <div className="basis-full">
                            <Button className="w-full" type='submit'>
                                <div className="flex justify-around ">
                                    <p>Agregar</p>
                                    <p>$2500</p>
                                </div>
                            </Button>
                        </div>
                    </div>
                </footer>
            </Form>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    return {
        props: ctx.params || {}
    }
}


export default ProductDetail;