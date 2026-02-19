$(document).ready(function() {
    
    // 1. Smooth Scrolling for Navigation Links (jQuery Component #1: Animated Scroll Effects)
    $('a.nav-link[href^="#"]').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70 // Adjust for sticky navbar height
            }, 800, function(){
                // Optional: Add hash to URL
                // window.location.hash = hash;
            });
        }
    });

    // 2. Back to Top Button (Fade In/Out) (jQuery Component #2: Fade Effect/Toggle)
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }
    });

    $('#backToTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // 3. Toggle Effect for Newsletter Signup (jQuery Component #3: Toggle Elements)
    $('#toggleNewsletter').click(function() {
        $('#newsletterForm').slideToggle('slow');
    });

    // Optional: Add active class to nav links on scroll
    $(window).scroll(function() {
        var scrollDistance = $(window).scrollTop() + 100;

        $('section').each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                $('.navbar-nav a.nav-link.active').removeClass('active');
                $('.navbar-nav a.nav-link').eq(i).addClass('active');
            }
        });
    });
});