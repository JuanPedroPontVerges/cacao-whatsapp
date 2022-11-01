import { useContext } from 'react';
import { Session } from './session';
import { SessionContext } from './session.context';

export const SESSION_STORAGE_SESSION_KEY = 'SESSION_STORAGE_SESSION_KEY';

export type SessionHook = () => [Session, (session: Session) => void, () => void];

export const useLocalSession: SessionHook = () => {
    const { session, setSession } = useContext(SessionContext);

    const setSessionOnLocalStorage = (session: Session) => {
        window.sessionStorage.setItem(SESSION_STORAGE_SESSION_KEY, JSON.stringify(session));

        setSession(session);
    };

    const killSession = () => {
        window.sessionStorage.removeItem(SESSION_STORAGE_SESSION_KEY);
        setSession({});
    };

    const getSession = (): Session => {
        return session;
    };

    return [getSession(), setSessionOnLocalStorage, killSession];
};
