import { createContext, useContext, useEffect, useState } from 'react';

import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState();

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const adminRef = db.collection('admin').doc(user.uid);
        const candidateRef = db.collection('candidate').doc(user.uid);

        const admindoc = await adminRef.get();
        const candidatedoc = await candidateRef.get();

        if (admindoc.exists) {
          setUserRole('admin');
        } else if (candidatedoc.exists) {
          setUserRole('candidate');
        } else {
          setUserRole('none');
        }
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
