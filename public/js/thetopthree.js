/*
thetopthree - v0.0.0 - 2014-04-19
The Top Three
Lovingly coded by Austin Ogilvie  - thetopthree.com 
*/
$(document).ready(function(){$(".choose").click(function(){$(this).toggleClass("btn-success"),$(this).toggleClass("btn-info")}),$(".send-email").click(function(){var thetopthree=[];3!=$(".choose.btn-info").length?$("#flashwarning").toggleClass("hidden"):($("#flashwarning").addClass("hidden"),$(".choose.btn-info").each(function(i,item){thetopthree.push({img:$(item).attr("data-name"),week:$(item).attr("data-week")})}),$.post("/image",{data:thetopthree}))});var date_str_list=$(".paginate a").map(function(i,d){return d.text});date_list=[],_.each(date_str_list,function(d){date=moment(d).toDate(),date_list.push(date)}),console.log(date_list)});