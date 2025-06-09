import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyA4RL2bIkc98YzFEL7vvwKWGwd01ScsFDg",
  authDomain: "sonehaat-2a690.firebaseapp.com",
  projectId: "sonehaat-2a690",
  storageBucket: "sonehaat-2a690.firebasestorage.app",
  messagingSenderId: "1059073160975",
  appId: "1:1059073160975:web:01f00974cd91b8430b307a",
  measurementId: "G-QD3BTV2YWW"
};
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const generateToken = async()=>{
  const permission  =  await Notification.requestPermission();
  console.log(permission)
  if(permission=="granted"){
    const token = await getToken(messaging, { vapidKey: 'BJ7v2nsz4P8np9xvgsuYhDrjB7Bek85bb1exWLesVYrLqylJiolh5BOAbc6O8htQ_B8hjbse9VW4RhOGQh7Fhgg' })
    console.log(token)
    localStorage.setItem("deviceId", token)
  }
}