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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return { success: true, user };
  } catch (error) {
    console.error("登入失敗:", error);
    return { error: error.message, code: error.code };
  }
};

const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 更新用戶顯示名稱
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // 發送驗證信件（可選）
    // await sendEmailVerification(user);
    
    return { success: true, user };
  } catch (error) {
    console.error("註冊失敗:", error);
    return { error: error.message, code: error.code };
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("登出失敗:", error);
    return { error: error.message };
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
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
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("創建短網址失敗:", error);
    return { error: error.message };
  }
};

const getUserUrls = async (userId) => {
  try {
    if (!userId) {
      return { success: true, urls: [] };
    }

    const q = query(
      collection(db, "urlInfo"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const urls = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      // 客戶端排序，最新的在前
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.ptime || 0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.ptime || 0);
      return dateB - dateA;
    });
    
    return { success: true, urls };
  } catch (error) {
    console.error("載入 URLs 失敗:", error);
    return { error: error.message };
  }
};

const deleteShortUrl = async (urlId) => {
  try {
    await deleteDoc(doc(db, "urlInfo", urlId));
    return { success: true };
  } catch (error) {
    console.error("刪除短網址失敗:", error);
    return { error: error.message };
  }
};

const updateShortUrl = async (urlId, updateData) => {
  try {
    await updateDoc(doc(db, "urlInfo", urlId), updateData);
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
    
    return { success: true };
  } catch (error) {
    console.error("更新點擊數失敗:", error);
    return { error: error.message };
  }
};

// 標籤管理函數
const createTag = async (userId, tagData) => {
  try {
    if (!userId) {
      return { error: "用戶ID不能為空" };
    }

    const docRef = await addDoc(collection(db, "tags"), {
      ...tagData,
      userId,
      createdAt: new Date(),
      urlCount: 0
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("創建標籤失敗:", error);
    return { error: error.message };
  }
};

const getUserTags = async (userId) => {
  try {
    if (!userId) {
      return { success: true, tags: [] };
    }

    const q = query(
      collection(db, "tags"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const tags = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      // 客戶端排序，最新的在前
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });
    
    return { success: true, tags };
  } catch (error) {
    console.error("載入標籤失敗:", error);
    return { error: error.message };
  }
};

const updateTag = async (tagId, updateData) => {
  try {
    await updateDoc(doc(db, "tags", tagId), updateData);
    return { success: true };
  } catch (error) {
    console.error("更新標籤失敗:", error);
    return { error: error.message };
  }
};

const deleteTag = async (tagId) => {
  try {
    await deleteDoc(doc(db, "tags", tagId));
    return { success: true };
  } catch (error) {
    console.error("刪除標籤失敗:", error);
    return { error: error.message };
  }
};

const updateTagUrlCount = async (tagId, increment_value = 1) => {
  try {
    const tagRef = doc(db, "tags", tagId);
    await updateDoc(tagRef, {
      urlCount: increment(increment_value)
    });
    
    return { success: true };
  } catch (error) {
    console.error("更新標籤URL計數失敗:", error);
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
  incrementUrlClicks,
  
  // 標籤管理函數
  createTag,
  getUserTags,
  updateTag,
  deleteTag,
  updateTagUrlCount
};