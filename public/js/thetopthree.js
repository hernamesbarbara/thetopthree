/*
thetopthree - v0.0.0 - 2014-04-13
The Top Three
Lovingly coded by Austin Ogilvie  - thetopthree.com 
*/
$(".choose").click(function(){$(this).toggleClass("btn-success"),$(this).toggleClass("btn-info")}),$(".send-email").click(function(){var thetopthree=[];3!=$(".choose.btn-info").length?$("#flashwarning").toggleClass("hidden"):($("#flashwarning").addClass("hidden"),$(".choose.btn-info").each(function(i,item){thetopthree.push({img:$(item).attr("data-name"),week:$(item).attr("data-week")})}),$.post("/image",{data:thetopthree}))});