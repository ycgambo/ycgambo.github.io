NexT.utils=NexT.$u={articlePreviewTocJumpix:function(){$("#posts > article > div").each(function(){var i=$(this);var t=i.find(".post-header .post-title-link").attr("href")||i.find("link[itemprop=mainEntityOfPage]").attr("href");i.find(".post-body > ul a").each(function(){$arch=$(this);if($arch.attr("href").startsWith("#")){$arch.attr("href",t+$(this).attr("href"))}})})},wrapImageWithFancyBox:function(){$(".content img").not("[hidden]").not(".group-picture img, .post-gallery img").each(function(){var i=$(this);var t=i.attr("title");var e=i.parent("a");if(e.size()<1){var a=i.attr("data-original")?this.getAttribute("data-original"):this.getAttribute("src");e=i.wrap('<a href="'+a+'"></a>').parent("a")}e.addClass("fancybox fancybox.image");e.attr("rel","group");if(t){e.append('<p class="image-caption">'+t+"</p>");e.attr("title",t)}});$(".fancybox").fancybox({helpers:{overlay:{locked:false}}})},lazyLoadPostsImages:function(){$("#posts").find("img").lazyload({effect:"fadeIn",threshold:0})},registerTabsTag:function(){var i=".tabs ul.nav-tabs ";$(function(){$(window).bind("hashchange",function(){var t=location.hash;if(t!==""){$(i+'li:has(a[href="'+t+'"])').addClass("active").siblings().removeClass("active");$(t).addClass("active").siblings().removeClass("active")}}).trigger("hashchange")});$(i+".tab").on("click",function(i){i.preventDefault();if(!$(this).hasClass("active")){$(this).addClass("active").siblings().removeClass("active");var t=$(this).find("a").attr("href");$(t).addClass("active").siblings().removeClass("active");if(location.hash!==""){history.pushState("",document.title,window.location.pathname+window.location.search)}}})},registerESCKeyEvent:function(){$(document).on("keyup",function(i){var t=i.which===27&&$(".search-popup").is(":visible");if(t){$(".search-popup").hide();$(".search-popup-overlay").remove();$("body").css("overflow","")}})},registerBackToTop:function(){var i=50;var t=$(".back-to-top");$(window).on("scroll",function(){t.toggleClass("back-to-top-on",window.pageYOffset>i);var e=$(window).scrollTop();var a=NexT.utils.getContentVisibilityHeight();var n=e/a;var r=Math.round(n*100);var s=r>100?100:r;$("#scrollpercent>span").html(s)});t.on("click",function(){$("body").velocity("scroll")})},embeddedVideoTransformer:function(){var i=$("iframe");var t=["www.youtube.com","player.vimeo.com","player.youku.com","music.163.com","www.tudou.com"];var e=new RegExp(t.join("|"));i.each(function(){var i=this;var t=$(this);var r=a(t);var s;if(this.src.search(e)>0){var o=n(r.width,r.height);t.width("100%").height("100%").css({position:"absolute",top:"0",left:"0"});var c=document.createElement("div");c.className="fluid-vids";c.style.position="relative";c.style.marginBottom="20px";c.style.width="100%";c.style.paddingTop=o+"%";c.style.paddingTop===""&&(c.style.paddingTop="50%");var h=i.parentNode;h.insertBefore(c,i);c.appendChild(i);if(this.src.search("music.163.com")>0){s=a(t);var d=s.width>r.width||s.height<r.height;if(d){c.style.paddingTop=n(s.width,r.height)+"%"}}}});function a(i){return{width:i.width(),height:i.height()}}function n(i,t){return t/i*100}},addActiveClassToMenuItem:function(){var i=window.location.pathname;i=i==="/"?i:i.substring(0,i.length-1);$('.menu-item a[href^="'+i+'"]:first').parent().addClass("menu-item-active")},hasMobileUA:function(){var i=window.navigator;var t=i.userAgent;var e=/iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;return e.test(t)},isTablet:function(){return window.screen.width<992&&window.screen.width>767&&this.hasMobileUA()},isMobile:function(){return window.screen.width<767&&this.hasMobileUA()},isDesktop:function(){return!this.isTablet()&&!this.isMobile()},escapeSelector:function(i){return i.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,"\\$&")},displaySidebar:function(){if(!this.isDesktop()||this.isPisces()||this.isGemini()){return}$(".sidebar-toggle").trigger("click")},isMist:function(){return CONFIG.scheme==="Mist"},isPisces:function(){return CONFIG.scheme==="Pisces"},isGemini:function(){return CONFIG.scheme==="Gemini"},getScrollbarWidth:function(){var i=$("<div />").addClass("scrollbar-measure").prependTo("body");var t=i[0];var e=t.offsetWidth-t.clientWidth;i.remove();return e},getContentVisibilityHeight:function(){var i=$("#content").height(),t=$(window).height(),e=i>t?i-t:$(document).height()-t;return e},getSidebarb2tHeight:function(){var i=CONFIG.sidebar.b2t?$(".back-to-top").height():0;return i},getSidebarSchemePadding:function(){var i=$(".sidebar-nav").css("display")=="block"?$(".sidebar-nav").outerHeight(true):0,t=$(".sidebar-inner"),e=t.innerWidth()-t.width(),a=this.isPisces()||this.isGemini()?e*2+i+CONFIG.sidebar.offset*2+this.getSidebarb2tHeight():e*2+i/2;return a}};$(document).ready(function(){i();function i(){var i;$(window).on("resize",function(){i&&clearTimeout(i);i=setTimeout(function(){var i=document.body.clientHeight-NexT.utils.getSidebarSchemePadding();t(i)},0)});var e=NexT.utils.getScrollbarWidth();if($(".sidebar-panel").height()>document.body.clientHeight-NexT.utils.getSidebarSchemePadding()){$(".site-overview").css("width","calc(100% + "+e+"px)")}$(".post-toc").css("width","calc(100% + "+e+"px)");t(document.body.clientHeight-NexT.utils.getSidebarSchemePadding())}function t(i){i=i||"auto";$(".site-overview, .post-toc").css("max-height",i)}});