import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkpALVveLYASRCw45R2BxVJxqKeDeNh-E",
  authDomain: "comecamp-webside.firebaseapp.com",
  // 你也可以加上 projectId、appId 等其他資訊
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };