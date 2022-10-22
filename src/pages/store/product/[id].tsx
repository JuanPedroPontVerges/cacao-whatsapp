import { Disclosure } from "@headlessui/react";
import { Bars3Icon, ShoppingCartIcon, XMarkIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Cursed from 'public/assets/alien.png'
import ProductDetailAction from "../../../components/ProductDetailAction";
const ProductDetail: NextPage = ({ id }) => {
    const router = useRouter()
    const { data } = trpc.useQuery(["storeRouter.getProductDetails", { id }]);
    if (!data) return (<>No data</>)
    console.log('data', data);
    const product = data[0]?.productStore.product
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
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            Aca van las categorias
                                        </div>
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
            <div>
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
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
                    {
                        data?.map((group) => (
                            <div key={group.id}>
                                <ProductDetailAction
                                    amount={group.amount || 1}
                                    displayType={group.displayType}
                                    multipleUnits={group.multipleUnits}
                                    optionGroup={group.optionGroup}
                                />
                            </div>
                        ))
                    }
                </div>
                <footer className="fixed bottom-0 bg-slate-600 w-full">
                    <div className="flex justify-between p-4">
                        <div className="basis-full">
                            <div className="w-full">xx
                                <div className="flex justify-around">
                                    <p>-</p>
                                    <p>1</p>
                                    <p>+</p>
                                </div>
                            </div>
                        </div>
                        <div className="basis-full">
                            <button className="w-full">
                                <div className="flex justify-around ">
                                    <p>Agregar</p>
                                    <p>$2500</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    return {
        props: ctx.params || {}
    }
}


export default ProductDetail;