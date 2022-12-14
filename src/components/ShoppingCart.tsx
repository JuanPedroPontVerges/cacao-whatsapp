import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Fragment } from "react";
import Cursed from 'public/assets/alien.png'
import { useLocalSession } from "../helpers/session.hooks";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const ShoppingCart: React.FC<{ visible: boolean, toggleShoppingCart: () => void }> = ({ visible, toggleShoppingCart }) => {
    const [session] = useLocalSession();
    const cartQuery = trpc.useQuery(["cartRouter.findById", { id: session.cartId }])
    const cartProductDelete = trpc.useMutation(["cartRouter.deleteProductStoreCart"], {
        onSuccess: () => cartQuery.refetch()
    })
    if (cartQuery.isLoading) return <>Cargando...</>
    if (cartQuery.error) return <>Error!</>
    const onClickDelete = (e: React.MouseEvent, productStoreCartId: string) => {
        e.preventDefault();
        cartProductDelete.mutate({ productStoreCartId })
    }
    const finalPrice = cartQuery.data?.productStoreCarts.reduce((acc, value) => ((value.finalPrice * value.amount) + acc), 0)
    return (
        <Transition.Root show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={toggleShoppingCart}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={toggleShoppingCart}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {cartQuery.data?.productStoreCarts.length || 0 > 0 ? (
                                                            cartQuery.data?.productStoreCarts.map((productStoreCart) => (
                                                                <Link href={`/store/product/${productStoreCart.productStore.product.id}?productStoreCartId=${productStoreCart.id}`} key={productStoreCart.id} onClick={(e) => e.stopPropagation()}>
                                                                    <li className="flex py-6">
                                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                            <Image
                                                                                src={productStoreCart.productStore.product.imageUrl || Cursed}
                                                                                alt={'Nombre de producto'}
                                                                                width={120}
                                                                                height={120}
                                                                                className="h-full w-full object-cover object-center"
                                                                                layout='responsive'
                                                                            />
                                                                        </div>

                                                                        <div className="ml-4 flex flex-1 flex-col">
                                                                            <div>
                                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                    <h3>
                                                                                        {productStoreCart.productStore.product.name}
                                                                                    </h3>
                                                                                    <p className="ml-4">{productStoreCart.finalPrice}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                                                <p className="text-gray-500">Cant. {productStoreCart.amount}</p>

                                                                                <div className="flex">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                                        onClick={(e) => (onClickDelete(e, productStoreCart.id))}
                                                                                    >
                                                                                        Eliminar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </Link>
                                                            ))
                                                        ) : (
                                                            <p>No has agregado ning??n item</p>
                                                        )}

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">

                                            {cartQuery.data?.productStoreCarts.length || 0 > 0 ? (
                                                <>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <p>Subtotal</p>
                                                        <p>${finalPrice}</p>
                                                    </div>
                                                    <div className="mt-6">
                                                        <Link
                                                            href={`/store/checkout/${session.cartId}`}
                                                        >
                                                            <div
                                                                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                                                                Ir a pagar
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : null}
                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <p>
                                                    or{' '}
                                                    <button
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        onClick={() => toggleShoppingCart()}
                                                    >
                                                        Seguir comprando
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
};
export default ShoppingCart;