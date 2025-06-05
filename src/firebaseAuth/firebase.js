// src/firebaseAuth/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  getFirestore, 
  addDoc, 
  collection, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  increment
} from "firebase/firestore";

// Firebase 配置
const firebaseConfig = {
  apiKey: process.env.REACT_APP_Firebase_apiKey,
  authDomain: "short-url-system.firebaseapp.com",
  projectId: "short-url-system",
  storageBucket: "short-url-system.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_Firebase_messagingSenderId,
  appId: process.env.REACT_APP_Firebase_appId
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// 身分驗證函數
const signIn = async (email, password) => {
  try {
    console.log("登入中，信箱:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("登入成功:", user.uid);
    return { success: true, user };
  } catch (error) {
    console.error("登入失敗:", error);
    return { error: error.message, code: error.code };
  }
};

const signUp = async (email, password, displayName) => {
  try {
    console.log("註冊中，信箱:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 更新用戶顯示名稱
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // 發送驗證信件（可選）
    // await sendEmailVerification(user);
    
    console.log("註冊成功:", user.uid);
    return { success: true, user };
  } catch (error) {
    console.error("註冊失敗:", error);
    return { error: error.message, code: error.code };
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    console.log("登出成功");
    return { success: true };
  } catch (error) {
    console.error("登出失敗:", error);
    return { error: error.message };
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("密碼重設信件已發送");
    return { success: true };
  } catch (error) {
    console.error("發送密碼重設信件失敗:", error);
    return { error: error.message };
  }
};

// URL 管理函數
const createShortUrl = async (urlData) => {
  try {
    const docRef = await addDoc(collection(db, "urlInfo"), {
      ...urlData,
      createdAt: new Date(),
      clicks: 0,
      status: 'active'
    });
    
    console.log("短網址創建成功:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("創建短網址失敗:", error);
    return { error: error.message };
  }
};

const getUserUrls = async (userId) => {
  try {
    const q = query(
      collection(db, "urlInfo"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const urls = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log("載入用戶 URLs:", urls.length);
    return { success: true, urls };
  } catch (error) {
    console.error("載入 URLs 失敗:", error);
    return { error: error.message };
  }
};

const deleteShortUrl = async (urlId) => {
  try {
    await deleteDoc(doc(db, "urlInfo", urlId));
    console.log("短網址刪除成功:", urlId);
    return { success: true };
  } catch (error) {
    console.error("刪除短網址失敗:", error);
    return { error: error.message };
  }
};

const updateShortUrl = async (urlId, updateData) => {
  try {
    await updateDoc(doc(db, "urlInfo", urlId), updateData);
    console.log("短網址更新成功:", urlId);
    return { success: true };
  } catch (error) {
    console.error("更新短網址失敗:", error);
    return { error: error.message };
  }
};

// 統計函數
const incrementUrlClicks = async (urlId) => {
  try {
    const urlRef = doc(db, "urlInfo", urlId);
    await updateDoc(urlRef, {
      clicks: increment(1),
      lastClicked: new Date()
    });
    
    console.log("點擊數更新成功:", urlId);
    return { success: true };
  } catch (error) {
    console.error("更新點擊數失敗:", error);
    return { error: error.message };
  }
};

export {
  // Firebase 實例
  auth,
  db,
  storage,
  
  // 身分驗證函數
  signIn,
  signUp,
  logOut,
  resetPassword,
  onAuthStateChanged,
  updateProfile,
  
  // URL 管理函數
  createShortUrl,
  getUserUrls,
  deleteShortUrl,
  updateShortUrl,
  incrementUrlClicks
};