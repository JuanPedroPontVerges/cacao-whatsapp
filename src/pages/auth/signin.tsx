import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import WapiLogo from 'public/assets/wapi-logo.svg'
import Image from "next/image";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

const Signin: NextPage<{ csrfToken: any, providers: any }> = ({ providers }) => {
    return (
        <div>
            <header>
                <div className="w-full flex bg-gray-800 min-h-full">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Image src={WapiLogo} alt='Icono de Wapi' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section>
                <div className="flex justify-center items-center h-[400px]">
                    <div className="mt-10 sm:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-6">
                            <div className="mt-5 md:col-span-2 md:mt-0">
                                <div className="overflow-hidden shadow sm:rounded-md">
                                    <div className="bg-white px-4 py-5 sm:p-6">
                                        {providers &&
                                            Object.values(providers).map((provider: any) => (
                                                <div key={provider?.name} style={{ marginBottom: 0 }}>
                                                    <button className='flex items-center gap-2' onClick={() => signIn(provider.id, { callbackUrl: '/' })}  >
                                                        Iniciar sesión con {provider.name} <ArrowRightCircleIcon height={20} width={20} />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signin;

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(ctx)

    return {
        props: {
            session,
            providers,
            csrfToken,
        }
    }
}