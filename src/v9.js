import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  deleteUser,
  GoogleAuthProvider,
  FacebookAuthProvider
} from "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCFpMDt4vtV96zycNpJTxo73XvA4q9MIZQ",
  authDomain: "letswrite-helpful-btn.firebaseapp.com",
  databaseURL: "https://letswrite-helpful-btn.firebaseio.com",
  projectId: "letswrite-helpful-btn",
  storageBucket: "letswrite-helpful-btn.appspot.com",
  messagingSenderId: "498690047881",
  appId: "1:498690047881:web:dcb559143db6f145e26b58",
  measurementId: "G-9YZ3G343K3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();



// Google
const providerGoogle = new GoogleAuthProvider();
const google = document.getElementById('google');
const googleCode = document.getElementById('googleCode');
const googleError = document.getElementById('googleError');

// Facebook
const providerFb = new FacebookAuthProvider();
const fb = document.getElementById('fb');
const fbCode = document.getElementById('fbCode');
const fbError = document.getElementById('fbError');



// 打開登入、刪除的區塊
function openOut() {
  const outBlock = document.getElementById('out');
  outBlock.classList.remove('d-none');
}

// 登出
function triggerSignOut() {
  const signOutBtn = document.getElementById('signOut');
  signOutBtn.addEventListener('click', () => {
    signOut().then(() => {
      window.alert('登出成功，將重新整理一次頁面！');
      window.location.reload();
    }).catch((error) => {
      document.getElementById('userError').innerHTML = JSON.stringify(error);
    });    
  })
}

// 刪除帳號
function triggerDeleteUser() {
  const user = auth.currentUser;
  if(user !== null) {
    const deleteBtn = document.getElementById('deleteUser');
    deleteBtn.addEventListener('click', () => {
      deleteUser(user).then(function() {
        window.alert('刪除成功，將重新整理一次頁面！');
        window.location.reload();
      }).catch(function(error) {
        document.getElementById('userError').innerHTML = JSON.stringify(error);
      });
    })
  } else {
    document.getElementById('userError').innerHTML = '請重新登入會員，再執行刪除功能';
  }
}



// Google 登入
google.addEventListener('click', () => {
  let typeRadio = document.getElementsByName('googleType');
  let typeLen = typeRadio.length;
  let type;
  for(let i = 0; i < typeLen; i++) {
    if(typeRadio[i].checked) {
      type = typeRadio[i].value;
      break;
    }
  }

  // popup 的方式
  if(type === 'popup') {
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("🚀 ~ file: v9.js ~ line 90 ~ .then ~ user", user)
        googleCode.innerHTML = JSON.stringify(user);
        openOut();
        triggerSignOut();
        triggerDeleteUser();
        fbCode.innerHTML = '登入完後的資料會出現在這'; // 如果有都登入，要清掉 Facebook 的訊息
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        googleError.innerHTML = JSON.stringify(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    signInWithRedirect(auth, providerGoogle);
  }
});



// Facebook 登入
fb.addEventListener('click', () => {
  let typeRadio = document.getElementsByName('fbType');
  let typeLen = typeRadio.length;
  let type;
  for(let i = 0; i < typeLen; i++) {
    if(typeRadio[i].checked) {
      type = typeRadio[i].value;
      break;
    }
  }

  // popup 的方式
  if(type === 'popup') {
    signInWithPopup(auth, providerFb)
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const user = result.user;
        console.log("🚀 ~ file: v9.js ~ line 131 ~ .then ~ user", user);
        fbCode.innerHTML = JSON.stringify(user);
        openOut();
        triggerSignOut();
        triggerDeleteUser();
        googleCode.innerHTML = '登入完後的資料會出現在這'; // 如果有都登入，要清掉 Google 的訊息
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    signInWithRedirect(auth, providerFb);
  }
});



// redirect 回來時抓資料
document.addEventListener('DOMContentLoaded', () => {
  getRedirectResult(auth)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // 從 providerData 去判斷是由 Google 或 Facebook 登入
      let provider = user.providerData[0].providerId;
      console.log("🚀 ~ file: v9.js ~ line 165 ~ .then ~ provider", provider)

      // 是從 Google 回來
      if(provider.indexOf('google') > -1) {
        googleCode.innerHTML = JSON.stringify(user);
      }
      // 是從 Facebook 回來
      else {
        fbCode.innerHTML = JSON.stringify(user);
      }
      openOut();
      triggerSignOut();
      triggerDeleteUser();

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      fbError.innerHTML = JSON.stringify(error);
    });
});