import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAGSNkkCvV3UFDX4pjlv4wjhKo64f6xOII",
    authDomain: "pdf-genie-8e0f1.firebaseapp.com",
    projectId: "pdf-genie-8e0f1",
    storageBucket: "pdf-genie-8e0f1.appspot.com",
    messagingSenderId: "1054240913974",
    appId: "1:1054240913974:web:1402b1f8d6a2e29bb53697",
    measurementId: "G-YJSBL5VWDS",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
