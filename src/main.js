// Google
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const google = document.getElementById('google');
const googleCode = document.getElementById('googleCode');
const googleError = document.getElementById('googleError');

// Facebook
const providerFb = new firebase.auth.FacebookAuthProvider();
const fb = document.getElementById('fb');
const fbCode = document.getElementById('fbCode');
const fbError = document.getElementById('fbError');



// 打開登入、刪除的區塊
function openOut() {
  const outBlock = document.getElementById('out');
  outBlock.classList.remove('d-none');
}

// 登出
function signOut() {
  const signOutBtn = document.getElementById('signOut');
  signOutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.alert('登出成功，將重新整理一次頁面！');
      window.location.reload();
    }).catch((error) => {
      document.getElementById('userError').innerHTML = JSON.stringify(error);
    });    
  })
}

// 刪除帳號
function deleteUser() {
  const user = firebase.auth().currentUser;
  if(user !== null) {
    const deleteBtn = document.getElementById('deleteUser');
    deleteBtn.addEventListener('click', () => {
      user.delete().then(function() {
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
    firebase.auth()
      .signInWithPopup(providerGoogle)
      .then((result) => {
        let credential = result.credential;
        let token = credential.accessToken;
        let user = result.user;
        console.log("🚀 ~ file: main.js ~ line 70 ~ .then ~ user", user)
        googleCode.innerHTML = JSON.stringify(user);
        openOut();
        signOut();
        deleteUser();
        fbCode.innerHTML = '登入完後的資料會出現在這'; // 如果有都登入，要清掉 Facebook 的訊息
      }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
        googleError.innerHTML = JSON.stringify(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    firebase.auth().signInWithRedirect(providerGoogle);
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
    firebase
      .auth()
      .signInWithPopup(providerFb)
      .then((result) => {
        let credential = result.credential;
        let accessToken = credential.accessToken;
        let user = result.user;
        console.log("🚀 ~ file: main.js ~ line 113 ~ .then ~ user", user)
        fbCode.innerHTML = JSON.stringify(user);
        openOut();
        signOut();
        deleteUser();
        googleCode.innerHTML = '登入完後的資料會出現在這'; // 如果有都登入，要清掉 Google 的訊息
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    firebase.auth().signInWithRedirect(providerFb);
  }
});



// redirect 回來時抓資料
document.addEventListener('DOMContentLoaded', () => {
  firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if(result.credential) {
        let credential = result.credential;
        let token = credential.accessToken;
      }
      let user = result.user;
      if(user) {
        // 從 providerData 去判斷是由 Google 或 Facebook 登入
        let provider = user.providerData[0].providerId;
        console.log("🚀 ~ file: main.js ~ line 148 ~ .then ~ provider", provider);

        // 是從 Google 回來
        if(provider.indexOf('google') > -1) {
          googleCode.innerHTML = JSON.stringify(user);
        }
        // 是從 Facebook 回來
        else {
          fbCode.innerHTML = JSON.stringify(user);
        }
        openOut();
        signOut();
        deleteUser();
      }
    }).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;
      fbError.innerHTML = JSON.stringify(error);
    });
});