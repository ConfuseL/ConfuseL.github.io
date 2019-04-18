<!--离开提醒-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         $('[rel="icon"]').attr('href', "/images/64.png");
         document.title = '深渊凝视着你';
         clearTimeout(titleTime);
     }
     else {
         $('[rel="icon"]').attr('href', "/images/64.png");
         document.title = 'ConfuseL的个人博客' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });