import React, { useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ArrowRightOnRectangleIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { Fragment } from "react";
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { trpc } from '../../utils/trpc';
import Image from "next/image";
import WapiLogo from 'public/assets/wapi-logo.svg'
import { useRouter } from 'next/router';

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const userNavigation = [
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type RouterType = 'orders' | 'catalog' | 'reports' | undefined | string

type DashboardProps = {
    children: React.ReactNode;
}
const Dashboard: React.FC<DashboardProps> = ({ children }) => {
    const killSession = () => {
        signOut({ callbackUrl: process.env.NEXTAUTH_URL });
    }
    const router = useRouter()
    const session = useSession();
    const venueQuery = trpc.useQuery(["storeRouter.getVenueByUser", { id: session.data?.user?.id }])
    const currentRouter: RouterType = router.pathname.split('/')[1];
    const navigation = [
        { name: 'Inicio', href: '/', current: !currentRouter ? true : false },
        { name: 'Catálogo', href: '/catalog', current: currentRouter === 'catalog' ? true : false },
        { name: 'Órdenes', href: '/orders', current: currentRouter === 'orders' ? true : false },
        { name: 'Reportes', href: '/reports', current: currentRouter === 'reports' ? true : false },

    ]
    const current = navigation.find((nav) => nav.current === true)
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image src={WapiLogo} alt='Icono de Wapi' />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item, index) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        <div className={`cursor-pointer ${classNames(
                                                            item.current
                                                                ? 'bg-gray-900 text-white'
                                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'px-3 py-2 rounded-md text-sm font-medium'
                                                        )}`}>
                                                            {item.name}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex flex-row align-middle gap-x-6">
                                            <Link href={`/store/${venueQuery.data?.venue?.menus[0]?.id}`} target='_blank' passHref className="text-gray-400 cursor-pointer hover:text-white">
                                                <div className='cursor-pointer gap-x-2 flex items-center bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                                                    <BuildingStorefrontIcon className="w-6 h-6" aria-hidden="true" />
                                                    <p>Ir a la tienda</p>
                                                </div>
                                            </Link>
                                            <div
                                                onClick={killSession}
                                                className="cursor-pointer flex gap-x-2 items-center bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-6 h-6" aria-hidden="true" />
                                                <p>Cerrar sesión</p>
                                            </div>
                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        {/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({ active }) => (
                                                                    <a
                                                                        href={item.href}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block px-3 py-2 rounded-md text-base font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pt-4 pb-3">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            {/* <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" /> */}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                        </div>
                                        <button
                                            type="button"
                                            className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{current?.name}</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Replace with your content */}
                        <div className="px-4 py-6 sm:px-0">
                            {children}
                        </div>
                        {/* /End replace */}
                    </div>
                </main>
            </div>
            <div className=' mt-60'></div>
            <footer className="
            w-full 
            h-16 bg-gray-600 border-t-2 border-white
            fixed left-0 bottom-0
            flex justify-center items-center
            text-white text-2xl
            ">
                <ul className="flex flex-wrap mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link href={`/`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Inicio</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/catalog`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Catálogo</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/orders`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Órdenes</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/reports`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Reportes</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/privacy`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Políticas de privacidad</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/terms`} passHref className="text-gray-400 cursor-pointer hover:text-white">
                            <div className="mr-4 hover:underline md:mr-6 ">Términos y condiciónes</div>
                        </Link>
                    </li>
                </ul>
            </footer>
        </DndProvider>
    )
}

export default Dashboard;
