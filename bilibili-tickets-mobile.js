// ==UserScript==
// @name         会员购抢票2
// @author       TakamiChika(17014@163.com)
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @match        https://mall.bilibili.com/neul/index.html*
// @match        https://show.bilibili.com/platform/confirmOrder.html*
// ==/UserScript==

(function () {
  'use strict';

  const priceNo = 3;  // 抢第几种价格
  const count = 2;  // 抢几张

  const delay = 150;  // 网络延迟阈值，网好的话适当把这个值调小

  function clickBuy1() {
    if ($(".submit-button").length > 0) {
      $(".submit-button").trigger('click');
    }
  }

  function clickAdd() {
    return new Promise((resolve) => {
      if (count == 1) {
        resolve();
        return;
      }
      setTimeout(() => {
        if ($(".button.plus").length > 0) {
          for (let index = 0; index < count - 1; index++) {
            setTimeout(() => {
              $(".button.plus").click();
              if (index === count - 2) {
                resolve();
                console.log('click add done');
                return;
              }
            }, index * 100)
          }
        }
      }, 200)
    })
  };

  let cc = 1;
  function clickPrice() {
    return new Promise((resolve) => {
      if (priceNo == 1) {
        resolve();
        return;
      };

      if ($(".ticket-container .radio-group").length > 0) {
        setTimeout(() => {
          $(".ticket-container .radio-group").children().eq(priceNo - 1).trigger('click');
          console.log('click price done');
          resolve();
        }, 100)
      } else {
        console.log('not find tickets, retry:' + cc);
        cc++;
        setTimeout(() => {
          if (cc === 5) {
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
      if ($(".bili-button-type-primary").length > 0) {
        $(".bili-button-type-primary").trigger('click');
      } else {
        c++;
        setTimeout(() => {
          if (c === 5) {
            return;
          }
          console.log('retry:' + c);
          action();
        }, 120)
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
        if ($(".buyer-tag.tag").length > 0) {
          const len = $(".buyer-tag.tag").length;
          console.log(len);
          $(".buyer-tag.tag").each(function (i, e) {
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
    if (window.location.search.includes('ticket_detail')) {
      setTimeout(() => {
        $(".action-container").children().eq(0).trigger('click');

        setTimeout(() => {
          Promise.all([clickPrice(), clickAdd()]).then(() => {
            console.log('ok');
            clickBuy1();
          })
        }, delay)

      }, delay)
    }
    if (window.location.search.includes('ticket_confirmOrder')) {
      setTimeout(() => {
        checkUser().then(() => {
          console.log('ok');
          clickBuy2();
        })
      }, delay * 3 + 80)
    }
  })
})();
