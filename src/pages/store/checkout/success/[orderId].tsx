import { Disclosure } from "@headlessui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import StoreNav from "../../../../components/layouts/StoreNav";
import { trpc } from "../../../../utils/trpc";
import { NextPageWithLayout } from "../../../_app";
import WapiLogo from 'public/assets/wapi-logo.svg'
import Image from "next/image";
const Success: NextPageWithLayout = ({ query }) => {
    const orderId = query?.orderId;
    const orderQuery = trpc.useQuery(["orderRouter.findById", { id: orderId }]);
    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <Image src={WapiLogo} alt='Icono de Wapi' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
            <div className='container mx-auto'>
                <div className="flex justify-center">
                    <div className="lg:text-center">
                        <h2 className="text-3xl font-semibold text-green-600 text-center">¡Orden realizada con éxito!</h2>
                        <p className="mt-2 text-2xl font-bold leading-8 tracking-tight text-gray-900 text-center">
                            Gracias, {orderQuery.data?.customer.fullName}
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto text-center">
                            <a
                                target={'_blank'}
                                style={{ color: 'green', fontSize: '20px' }}
                                href={`https://wa.me/${orderQuery.data?.customer?.phoneNumber}`}
                                rel="noreferrer">
                                <button className="bg-green-600 p-4 text-lg rounded text-white">Ir a whatsapp</button>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

Success.getLayout = function getLayout(page) {
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

export default Success;