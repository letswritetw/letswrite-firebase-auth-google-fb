// Google
const provider = new firebase.auth.GoogleAuthProvider();
const google = document.getElementById('google');

// 登出
function googleSignOut() {
  const googleOut = document.getElementById('googleOut');
  googleOut.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      document.getElementById('googleCode').innerHTML = '您已登出';
      document.getElementById('googleError').innerHTML = '有錯誤的話會出現在這';
    }).catch((error) => {
      document.getElementById('googleError').innerHTML = JSON.stringify(error);
    });    
  })
}

// 登入
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
      .signInWithPopup(provider)
      .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        console.log("🚀 ~ file: main.js ~ line 38 ~ .then ~ user", user)
        document.getElementById('googleCode').innerHTML = JSON.stringify(user);
        googleSignOut();
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        document.getElementById('googleError').innerHTML = JSON.stringify(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    firebase.auth().signInWithRedirect(provider);
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // redirect 回來，就會抓到資料
  firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if(result.credential) {
        var credential = result.credential;
        var token = credential.accessToken;
      }
      var user = result.user;
      if(user) {
        document.getElementById('googleCode').innerHTML = JSON.stringify(user);
        googleSignOut();
      }
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      document.getElementById('googleError').innerHTML = JSON.stringify(error);
    });
})