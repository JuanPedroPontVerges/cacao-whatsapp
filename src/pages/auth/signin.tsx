import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";


const Signin: NextPage<{ csrfToken: any, providers: any }> = ({ csrfToken, providers }) => {
    console.log({ csrfToken, providers });
    // const { providers, csrfToken } = props;
    return (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
            {/* <Header /> */}
            <div />
            <div>
                <div>
                    {/* <Image src='/katalog_full.svg' width="196px" height="64px" alt='App Logo' style={{ height: '85px', marginBottom: '20px' }} /> */}
                    <div>
                        {providers &&
                            Object.values(providers).map((provider: any) => (
                                <div key={provider?.name} style={{ marginBottom: 0 }}>
                                    <button onClick={() => signIn(provider.id)} >
                                        Sign in with{' '} {provider.name}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img src='/login_pattern.svg' alt='Pattern Background' layout='fill' className={styles.styledPattern} /> */}
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
            csrfToken
        }
    }
}