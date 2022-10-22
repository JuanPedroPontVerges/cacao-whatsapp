import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';

type StoreNavProps = {
    children: React.ReactNode;
}

const StoreNav: React.FC<StoreNavProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

export default StoreNav;
