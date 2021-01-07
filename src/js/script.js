"use strict";

{
  // 画面の高さを取得
  // const windowHeight = document.documentElement.clientHeight;
  const mainVisualHeight = document.querySelector(".mainVisual").clientHeight;
  const scrollY = document.documentElement.scrollTop;
  const logoRound = document.querySelector(".header__homeLogo--round");
  const logoText = document.querySelector(".header__homeLogo--text");
  const navBtn = document.querySelector(".nav__button");
  const navTitle = document.querySelector(".nav__title");
  const checkBox = document.getElementById("nav__trigger");
  const navWrapper = document.querySelector(".nav__wrapper");

  window.addEventListener("scroll", () => {
    let y = window.pageYOffset;
    if (y > mainVisualHeight) {
      activate();
    }

    if (y < mainVisualHeight) {
      deActivate();
    }
  });

  navWrapper.addEventListener("click", () => {
    if (checkBox.checked === false) {
      deActivate();
    }
    if (checkBox.checked === true) {
      activate();
    }
  });

  // activeクラスつける
  function activate() {
    logoRound.classList.add("active");
    logoText.classList.add("active");
    navBtn.classList.add("active");
    navTitle.classList.add("active");
  }

  // activeクラス外す
  function deActivate() {
    logoRound.classList.remove("active");
    logoText.classList.remove("active");
    navBtn.classList.remove("active");
    navTitle.classList.remove("active");
  }
}
