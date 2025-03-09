// client/src/auth.ts
import { app } from './firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};