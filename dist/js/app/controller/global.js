define(["app/model/requests","app/model/util","jquery","bootstrap","slick","browser"],function(e,t,a){a(document).on("submit","#form-cse-search",function(e){var t=a(this),s=t.attr("action"),n=new RegExp("^"+s,"i");n.test(location.pathname)?(a(document).off("submit","#form-cse-search").on("submit","#form-cse-search",function(e){var t=a("#input-cse-search"),s=a.trim(t.val()),n=google.search.cse.element.getElement("searchresults-only0");""==s?n.clearAllResults():n.execute(s),history.pushState(null,null,"?"+t.attr("name")+"="+encodeURIComponent(s)),e.preventDefault()}),t.submit()):a.ajax({url:s,dataType:"html",success:function(e){var n=a(e);document.title=n.filter("title").text(),a("main").replaceWith(n.find("main")),google.search.cse.element.go("searchResults"),history.pushState(null,null,s),t.submit()}}),e.preventDefault()}).ready(function(){a("#progressBar").toggleClass("loading",!1),a.browser.msie?a("#tip-browser").removeClass("hidden"):a("#tip-browser").remove(),a(".carousel.slide").each(function(){var e=a(this).find(".carousel-inner");e.children(".item").length>1?e.slick({autoplay:!0,autoplaySpeed:5e3,dots:!0,dotsClass:"carousel-indicators",appendDots:e.parent(),customPaging:function(t,s){return'<a href="#slick-slide'+function(e){return 10>e?"0"+e:e}(s)+'"><span class="sr-only">'+a(".item",e).eq(s).attr("title")+"</span></a>"},prevArrow:e.siblings(".carousel-control.left"),nextArrow:e.siblings(".carousel-control.right"),pauseOnFocus:!0}):e.siblings(".carousel-control").remove()})}),a(window).on("popstate",function(e){var s=a("#form-cse-search"),n=a("#input-cse-search"),o=new RegExp("^"+s.attr("action"),"i"),r=t.getUrlParam("query");o.test(location.pathname)&&(n.val(r),s.submit())}),function(e,t,a,s,n,o,r){e.GoogleAnalyticsObject=n,e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)},e[n].l=1*new Date,o=t.createElement(a),r=t.getElementsByTagName(a)[0],o.async=1,o.src=s,r.parentNode.insertBefore(o,r)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-51330074-5","auto"),ga("require","linkid"),ga("send","pageview"),window.__gcse={parsetags:"explicit",callback:function(){var e=function(){var e=a("#form-cse-search"),s=a("#input-cse-search"),n=new RegExp("^"+e.attr("action"),"i"),o=t.getUrlParam("query");google.search.cse.element.go("searchResults"),n.test(location.pathname)&&(s.focus().val(o),e.submit())};"complete"==document.readyState?e():google.setOnLoadCallback(e,!0)}},require(["googleCSE","googleWatermark"])});