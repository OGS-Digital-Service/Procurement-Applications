$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 400) {
        $(".ny-sidebar").addClass("ny-sidebar-fixed");
$(".chapter-card").addClass("chapter-card-fixed");
    } 
else {
        $(".ny-sidebar").removeClass("ny-sidebar-fixed");
$(".chapter-card").removeClass("chapter-card-fixed");
    } 
});


$(window).scroll(function() {    
   var s = $(window).scrollTop(),
    d = $(document).height(),
    c = $(window).height();

var scrollPercent = (s / (d-c)) * 100;

    if (scrollPercent >= 95) {
$(".ny-sidebar").removeClass("ny-sidebar-fixed");
$(".chapter-card").removeClass("chapter-card-fixed");
	}
else  {

	}
});

	  
     $(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});   
      
      

    function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return h[st]||b[st] / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}  
     
      

$(document).ready(function(){
    $(".ny-sidebar li a").click(function(){
        $("#show-menu").prop("checked", true);
    });
    $(".ny-sidebar li a").click(function(){
        $("#show-menu").prop("checked", false);
    });
});
  
  