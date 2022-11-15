import { NextPageWithLayout } from "../_app";
import StoreNav from "../../components/layouts/StoreNav";
import { trpc } from "../../utils/trpc";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from "next/image";
import Link from "next/link";
import Cursed from 'public/assets/pizza-margarita.jpg'
import ShoppingCart from "../../components/ShoppingCart";
import { useLocalSession } from "../../helpers/session.hooks";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Store: NextPageWithLayout = ({ query }) => {
    const { data } = trpc.useQuery(["storeRouter.getCategoriesByMenuId", { id: query.menuId }]);
    const [selectedCategory, setSelectedCategory] = useState(data?.[0]);
    const [isShoppingCartVisible, setIsShoppingCartVisible] = useState(false);
    const [session, setSession] = useLocalSession();
    const cartQuery = trpc.useQuery(["cartRouter.findProductStoreCartQuantity", { cartId: session.cartId }])
    useEffect(() => {
        if (query.cartId) {
            setSession({ cartId: query.cartId })
        }
    }, [query])

    useEffect(() => {
        if (data?.length) {
            setSelectedCategory(data?.[0]);
        }
    }, [data])
    if (!data) return (<>Loading...</>)
    if (cartQuery.data?.[0]?.cart?.state === 'CANCELLED') return (<>¡Carrito de compras cancelado! Porfavor, genera uno nuevo</>)
    const onClickCategory = (categoryId: string) => {
        const category = data?.find((category) => category.id === categoryId);
        setSelectedCategory(category);
    }
    const toggleShoppingCart = () => {
        setIsShoppingCartVisible(!isShoppingCartVisible)
    }
    return (
        <div className="bg-white">
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <span className={'text-white'}>
                                            WAPI
                                        </span>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {data?.map((item) => (
                                                <a
                                                    onClick={() => onClickCategory(item.id)}
                                                    key={item.name}
                                                    className={classNames(
                                                        item.id === selectedCategory?.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                    aria-current={item.id === selectedCategory?.id ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        {cartQuery.data?.length || 0 > 0 ? (
                                            <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                {cartQuery.data?.length}
                                            </span>
                                        ) : (
                                            null
                                        )}
                                        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" onClick={toggleShoppingCart} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3">
                                {data?.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        onClick={() => onClickCategory(item.id)}
                                        // href={item.href}
                                        className={classNames(
                                            item.id === selectedCategory?.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                        aria-current={item.id === selectedCategory?.id ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <header className="relative bg-white">
                <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
                    Recomendanos con tus amigos y gana $100
                </p>
            </header>
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {
                        selectedCategory?.products.map((product) => {
                            return (
                                <Link key={product.id} href={`product/${product.id}`}>
                                    <div className="group cursor-pointer">
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                            <Image
                                                layout={'fill'}
                                                src={product.imageUrl || Cursed}
                                                alt={`Imagen de ${product.name}`}
                                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <ShoppingCart toggleShoppingCart={toggleShoppingCart} visible={isShoppingCartVisible} />
        </div>
    )
}

Store.getLayout = function getLayout(page) {
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

export default Store;