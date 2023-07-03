// ==UserScript==
// @name         会员购抢票
// @version      0.1
// @author       TakamiChika(17014@163.com)
// @match        https://show.bilibili.com/platform/detail.html*
// @match        https://show.bilibili.com/platform/confirmOrder.html*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// ==/UserScript==

(function () {
  'use strict';

  const screenNo = 2;  // 抢第几场
  const priceNo = 1;  // 抢第几种价格
  const count = 1;  // 抢几张

  const delay = 80;  // 网络延迟阈值，网好的话适当把这个值调小

  function clickBuy1() {
    if ($(".product-buy.enable").length > 0) {
      $(".product-buy.enable").trigger('click');
    }
  }

  function clickAdd() {
    return new Promise((resolve) => {
      if (count == 1) {
        resolve();
        return;
      }
      if ($(".count-plus.active").length > 0) {
        for (let index = 0; index < count - 1; index++) {
          setTimeout(() => {
            $(".count-plus.active").trigger('click');
            if (index === count - 2) {
              resolve();
              return;
            }
          }, index * 70)
        }
      }
    })
  };

  function clickScreen() {
    return new Promise((resolve) => {
      if (screenNo == 1) {
        resolve();
        return;
      };
      let c = 1;
      if ($(".screens").length > 0) {
        $(".screens").children().eq(screenNo - 1).trigger('click');
        resolve();
      } else {
        console.log('not find screens, retry:' + c);
        c++;
        setTimeout(() => {
          if (c === 10) {
            return;
          }
          clickScreen();
        }, 100)
      }
    });
  };

  function clickPrice() {
    return new Promise((resolve) => {
      if (priceNo == 1) {
        resolve();
        return;
      };
      let c = 1;
      if ($(".tickets").length > 0) {
        $(".tickets").children().eq(priceNo - 1).trigger('click');
        resolve();
      } else {
        console.log('not find tickets, retry:' + c);
        c++;
        setTimeout(() => {
          if (c === 10) {
            return;
          }
          clickPrice();
        }, 100)
      }
    });
  };

  function clickBuy2() {
    let c = 1;
    function action() {
      if ($(".confirm-paybtn.active").length > 0) {
        $(".confirm-paybtn.active").trigger('click');
      } else {
        c++;
        setTimeout(() => {
          if (c === 5) {
            return;
          }
          action();
        }, 100)
      }
    }
    action();
  }

  function checkUser() {
    return new Promise((resolve) => {
      if (count === 1) {
        resolve()
        return;
      };
      let c = 1;
      function checkAction() {
        if ($(".card-item-container.user-card-item").length > 0) {
          const len = $(".card-item-container.user-card-item").length;
          $(".card-item-container.user-card-item").each(function (i, e) {
            if (i !== 0) {
              setTimeout(() => {
                e.click();
                if (i === len - 1) {
                  resolve();
                  return;
                }
              }, i * 50)
            }
          })
        } else {
          console.log('not find users, retry:' + c);
          c++;
          setTimeout(() => {
            if (c === 5) {
              return;
            }
            checkAction();
          }, 100)
        }
      }
      checkAction();
    });
  };

  $(document).ready(function () {
    if (location.pathname === '/platform/detail.html') {
      setTimeout(() => {
        Promise.all([clickScreen(), clickAdd(), clickPrice()]).then(() => {
          console.log('ok');
          clickBuy1();
        })
      }, delay)
    }
    if (location.pathname === '/platform/confirmOrder.html') {
      setTimeout(() => {
        checkUser().then(() => {
          console.log('ok');
          clickBuy2();
        })
      }, delay * 3 + 30)
    }
  })
})();
