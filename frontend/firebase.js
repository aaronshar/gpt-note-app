import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const alreadyCreatedApps = getApps();
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MEESAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID 
};


const app = alreadyCreatedApps.length ===0
                ? initializeApp(firebaseConfig)
                : alreadyCreatedApps[0];

export const auth = getAuth(app);
export default app;