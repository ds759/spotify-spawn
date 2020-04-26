const pauseStuff = ms => new Promise(r => setTimeout(r, ms));
const randomStuff = (max, min) => Math.floor(Math.random() * max + min);
const loginBtnClass = "_2221af4e93029bedeab751d04fab4b8b-scss";
async function run() {
  return new Promise((resolve, reject) => {
    pauseStuff(randomStuff(2000, 1000)).then(() => {
      let loginBtn = document.getElementsByClassName(loginBtnClass)[1];
      loginBtn.click();
      pauseStuff(randomStuff(3000, 1000)).then(() => {
        console.log("setting username");
        let userName = document.getElementById("login-username");
        userName.value = "usrname";
        resolve();
      });
    });
  });
}

const main = () => {
  run().then(() => console.log("complete"));
};

main();
GM_xmlhttpRequest({
  method: "POST",
  url: "http://myserver.org/mysscript.py",
  headers: {
    "Content-Type": "multipart/form-data"
  },
  data: _data,
  onload: function(response) {
    console.log("gut response");
  }
});
