import React, { useEffect, useState } from 'react';
import { Session } from '../helpers/session';
import { SessionContext } from '../helpers/session.context';
import { SESSION_STORAGE_SESSION_KEY } from '../helpers/session.hooks';

const SessionProvider: React.FC<{ children: any }> = (props) => {
    const [session, setSession] = useState<{ cartId?: string }>({});

    useEffect(() => {
        loadSessionFromLocalStorage().finally();
    }, []);

    const loadSessionFromLocalStorage = async () => {
        const storedSession = await window.sessionStorage.getItem(SESSION_STORAGE_SESSION_KEY);
        if (storedSession) {
            const sessionModel = JSON.parse(storedSession) as Session;
            setSession(sessionModel);
        }
    };

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {props.children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;
