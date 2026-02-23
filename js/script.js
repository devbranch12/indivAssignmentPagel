$(document).ready(function() {
    // Theme Switcher Logic
    const savedTheme = localStorage.getItem('theme') || 'dark';
    $('body').attr('data-theme', savedTheme);

    $('.theme-btn').click(function(e) {
        e.preventDefault();
        const theme = $(this).data('theme');
        $('body').attr('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Initialize Bootstrap Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Fetch JSON Data
    $.getJSON("data.json", function(data) {
        
        // 1. Populate Catalog on Home Page
        if ($("#catalog-container").length) {
            $.each(data.catalog, function(index, item) {
                var card = `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="card h-100 shadow-sm border-0 item-card" style="display:none;">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${item.name} <span class="badge bg-primary float-end">${item.price}</span></h5>
                                <p class="card-text text-muted">${item.category}</p>
                                <button class="btn btn-primary mt-auto w-100">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
                $("#catalog-container").append(card);
            });
            // jQuery Effect 1: Fade In Elements
            $(".item-card").fadeIn(1000);
        }

        // 2. Populate Reviews on Reviews Page
        if ($("#reviews-container").length) {
            $.each(data.reviews, function(index, review) {
                var stars = "";
                for(var i=0; i<review.rating; i++) { stars += '<i class="fas fa-star text-warning"></i>'; }
                
                var card = `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="card h-100 shadow-sm border-0 review-card" style="display:none;">
                            <img src="${review.image}" class="card-img-top" alt="${review.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${review.title}</h5>
                                <div class="mb-2">${stars}</div>
                                <p class="card-text review-excerpt">${review.content.substring(0, 50)}...</p>
                                <p class="card-text review-full" style="display:none;">${review.content}</p>
                                <!-- jQuery Effect 2: Toggle Elements -->
                                <button class="btn btn-sm btn-primary toggle-review mt-auto">Read More</button>
                                <button class="btn btn-sm btn-outline-primary mt-2 view-modal-btn" data-bs-toggle="modal" data-bs-target="#reviewModal" data-title="${review.title}" data-content="${review.content}">View in Modal</button>
                            </div>
                        </div>
                    </div>
                `;
                $("#reviews-container").append(card);
            });
            $(".review-card").fadeIn(1000);

            // Toggle Review Text
            $(".toggle-review").click(function() {
                var cardBody = $(this).closest(".card-body");
                cardBody.find(".review-excerpt").toggle();
                cardBody.find(".review-full").slideToggle();
                $(this).text($(this).text() == "Read More" ? "Read Less" : "Read More");
            });

            // Populate Modal
            $(".view-modal-btn").click(function() {
                var title = $(this).data("title");
                var content = $(this).data("content");
                $("#reviewModalLabel").text(title);
                $("#reviewModalBody").html("<p>" + content + "</p>");
            });
        }

        // 3. Populate Blog on Blog Page
        if ($("#blogAccordion").length) {
            $.each(data.blog, function(index, post) {
                var isFirst = index === 0 ? "show" : "";
                var isCollapsed = index === 0 ? "" : "collapsed";
                
                var accordionItem = `
                    <div class="accordion-item border-0 mb-2 shadow-sm">
                        <h2 class="accordion-header" id="heading${post.id}">
                            <button class="accordion-button ${isCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${post.id}" aria-expanded="true" aria-controls="collapse${post.id}">
                                ${post.title} - <small class="text-muted ms-2">${post.date}</small>
                            </button>
                        </h2>
                        <div id="collapse${post.id}" class="accordion-collapse collapse ${isFirst}" aria-labelledby="heading${post.id}" data-bs-parent="#blogAccordion">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <img src="${post.image}" class="img-fluid rounded" alt="${post.title}">
                                    </div>
                                    <div class="col-md-8">
                                        <p class="blog-excerpt">${post.excerpt}</p>
                                        <p class="blog-full" style="display:none;">${post.content}</p>
                                        <button class="btn btn-primary mt-3 toggle-blog">Read Full Post</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $("#blogAccordion").append(accordionItem);
            });

            // Toggle Blog Text
            $(".toggle-blog").click(function() {
                var blogBody = $(this).closest(".col-md-8");
                blogBody.find(".blog-excerpt").toggle();
                blogBody.find(".blog-full").slideToggle();
                $(this).text($(this).text() == "Read Full Post" ? "Read Less" : "Read Full Post");
            });
        }
    });

    // jQuery Effect 3: Form Validation
    if ($("#contactForm").length) {
        $("#contactForm").submit(function(event) {
            event.preventDefault();
            var isValid = true;
            
            $(this).find("input, textarea").each(function() {
                if ($(this).val() === "") {
                    isValid = false;
                    $(this).addClass("is-invalid");
                } else {
                    $(this).removeClass("is-invalid");
                    $(this).addClass("is-valid");
                }
            });

            if (isValid) {
                $("#formSuccess").removeClass("d-none").hide().fadeIn();
                $(this).trigger("reset");
                $(this).find("input, textarea").removeClass("is-valid");
            }
        });

        // Remove validation styling on input
        $("input, textarea").on("input", function() {
            $(this).removeClass("is-invalid is-valid");
        });
    }

    // Carousel Swipe Support (Mouse & Touch)
    var carousel = $("#heroCarousel");
    if (carousel.length) {
        var startX = 0;
        var endX = 0;
        var isDragging = false;
        var bsCarousel = new bootstrap.Carousel(carousel[0]);

        carousel.on("touchstart mousedown", function(e) {
            isDragging = true;
            startX = e.type === "touchstart" ? e.originalEvent.touches[0].clientX : e.clientX;
            endX = startX; // Reset endX on start
        });

        carousel.on("touchmove mousemove", function(e) {
            if (!isDragging) return;
            endX = e.type === "touchmove" ? e.originalEvent.touches[0].clientX : e.clientX;
        });

        carousel.on("touchend mouseup mouseleave", function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            var threshold = 50; // Minimum distance to trigger swipe
            if (startX - endX > threshold) {
                // Swiped left
                bsCarousel.next();
            } else if (endX - startX > threshold) {
                // Swiped right
                bsCarousel.prev();
            }
        });
    }
});
