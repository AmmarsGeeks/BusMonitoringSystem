import React, { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';


export const UserProviderContext = React.createContext({
  loading: false,
  user: undefined
});
export const useCurrentUser = () => React.useContext(UserProviderContext);

function UserAuthProvider(props) {
  const { children } = props;

  const [userAuth, loadingAuth] = useAuthState(auth);



  const value = useMemo(() => {
    return { user: userAuth, loading:  loadingAuth };
  }, [userAuth, loadingAuth]);

  return <UserProviderContext.Provider value={value}>{children}</UserProviderContext.Provider>;
}

export default React.memo(UserAuthProvider);
