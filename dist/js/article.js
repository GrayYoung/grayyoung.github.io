require(["./config"],function(config){require(["app/controller/global"]);require(["jquery","bootstrap"],function($){$(document).ready(function(){var $pagination=$("#pagination");if(0===$pagination.size()){var patternNO=/(?:\/dummy_split_)(\d{3})(?:\.html$)/g,creatItem=function(number,arrow){var patternN=new RegExp("\\d{"+number.toString().length+"}$");return'<li><a href="dummy_split_'+"000".replace(patternN,number)+'.html" aria-label="Next"><i class="fa '+arrow+'" aria-hidden="true"></i></a></li>'};$pagination=$('<div id="pagination" class="container"><hr><nav><ul class="pagination"></ul></nav></div>');var pageNO=parseInt(patternNO.exec(location.pathname)[1],10);$pagination.find(".pagination").append(creatItem(pageNO+1,"fa-angle-double-right"));pageNO>1&&$pagination.find(".pagination").prepend(creatItem(pageNO-1,"fa-angle-double-left"));$("body").append($pagination)}$("a[href]").filter(function(){return $(this).children("sup").size()>0}).on("inserted.bs.tooltip",function(event){var $this=$(this);""===$this.attr("data-original-title")&&$.get($this.attr("href"),function(data){var supStr=$(data).find($this.attr("href").match(/(\#[\w, \d]+)/g)[0]).html();$this.attr("data-original-title",supStr).tooltip("show")})}).tooltip({placement:"top",html:!0,title:function(){return $(this).attr("data-original-title")||'<i class="fa fa-circle-o-notch fa-spin" aria-label="Loading" />...'}})})})});define("../article",function(){});define("app/model/requests",{media:"/data/media.xlsx"});define("app/controller/global",["app/model/requests","jquery","bootstrap"],function(requests,$){$(document).ready(function(){$("#progressBar").toggleClass("loading",!1);$("#containerListing").size()>0&&require(["app/controller/media"])});!function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)}(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","UA-51330074-5","auto");ga("require","linkid");ga("send","pageview")});