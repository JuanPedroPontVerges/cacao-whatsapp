import React from 'react';
import { Session } from './session';

export interface SessionContextInterface {
    session: Session;
    setSession: (session: Session) => void;
}

export const SessionContext = React.createContext<SessionContextInterface>({
    session: {},
    setSession: () => {
        /* Nothing to do here*/
    },
});
