import React from 'react';
import SessionProvider from '../../context/session-provider.component';

type StoreNavProps = {
    children: React.ReactNode;
}

const StoreNav: React.FC<StoreNavProps> = ({ children }) => {
    return (
        <>
            <SessionProvider>
                {children}
            </SessionProvider>
        </>
    )
}

export default StoreNav;
