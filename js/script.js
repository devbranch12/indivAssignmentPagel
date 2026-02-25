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
                    <div class="col-lg-4 col-md-6 col-sm-12" id="catalog-${item.id}">
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
            $(".item-card").fadeIn(1000, function() {
                // Scroll to hash if present after elements are loaded
                // Only scroll once, after ALL elements have faded in (fadeIn callback runs for each element)
                // We use a small timeout or check execution count, but simpler is to just check if not already scrolled
                if (window.location.hash && !window.scrolledToHash) {
                    var target = $(window.location.hash);
                    if (target.length) {
                        window.scrolledToHash = true;
                        $('html, body').animate({
                            scrollTop: target.offset().top - 100 // Adjust for navbar
                        }, 1000);
                        // Highlight effect
                        target.find('.card').addClass('border-primary border-2');
                    }
                }
            });
        }

        // 2. Populate Reviews on Reviews Page with Search & Sort
        if ($("#reviews-container").length) {
            var allReviews = data.reviews;

            function renderReviews(reviewsToRender) {
                $("#reviews-container").empty();
                
                if (reviewsToRender.length === 0) {
                     $("#reviews-container").append('<div class="col-12 text-center"><p class="text-muted">No reviews found matching your criteria.</p></div>');
                     return;
                }

                $.each(reviewsToRender, function(index, review) {
                    var stars = "";
                    for(var i=0; i<review.rating; i++) { stars += '<i class="fas fa-star text-warning"></i>'; }
                    
                    var card = `
                        <div class="col-lg-4 col-md-6 col-sm-12" id="review-${review.id}">
                            <div class="card h-100 shadow-sm border-0 review-card" style="display:none;">
                                <img src="${review.image}" class="card-img-top" alt="${review.title}">
                                <div class="card-body d-flex flex-column text-center">
                                    <h5 class="card-title">
                                        <a href="javascript:void(0)" class="text-decoration-none text-reset open-review-btn" data-id="${review.id}">${review.title}</a>
                                    </h5>
                                    <div class="mb-3">${stars}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#reviews-container").append(card);
                });
                
                $(".review-card").fadeIn(500);
            }

            function filterAndSortReviews() {
                var searchText = $("#reviewSearch").val().toLowerCase();
                var sortOption = $("#reviewSort").val();
                
                // Filter
                var filtered = allReviews.filter(function(review) {
                    return review.title.toLowerCase().includes(searchText) || 
                           (review.content && review.content.toLowerCase().includes(searchText));
                });
                
                // Sort
                filtered.sort(function(a, b) {
                    if (sortOption === 'rating-high') {
                        return b.rating - a.rating; // High to Low
                    } else if (sortOption === 'rating-low') {
                        return a.rating - b.rating; // Low to High
                    } else if (sortOption === 'alpha-asc') {
                        return a.title.localeCompare(b.title); // A-Z
                    } else if (sortOption === 'alpha-desc') {
                        return b.title.localeCompare(a.title); // Z-A
                    } else {
                        return a.id - b.id; // Default (by ID)
                    }
                });
                
                renderReviews(filtered);
            }

            // Initial Render
            renderReviews(allReviews);
            
            // Check for Hash Scrolling after initial render
            setTimeout(function() {
                 if (window.location.hash && !window.scrolledToReview) {
                    var target = $(window.location.hash);
                    if (target.length) {
                        window.scrolledToReview = true;
                        $('html, body').animate({
                            scrollTop: target.offset().top - 100
                        }, 1000);
                        target.find('.card').addClass('border-primary border-2');
                    }
                }
            }, 600);

            // Event Listeners
            $("#reviewSearch").on("keyup", filterAndSortReviews);
            $("#reviewSort").on("change", filterAndSortReviews);

            // Handle "Read Review" Click -> Navigate to Article Page
            $("#reviews-container").on("click", ".open-review-btn", function() {
                var id = $(this).data("id");
                window.location.href = "readingPage.html?id=" + id;
            });
        }

        // 3. Populate Blog on Blog Page
        if ($("#blogAccordion").length) {
            $.each(data.blog, function(index, post) {
                var isFirst = index === 0 ? "show" : "";
                var isCollapsed = index === 0 ? "" : "collapsed";
                
                var accordionItem = `
                    <div class="accordion-item border-0 mb-2 shadow-sm" id="blog-${post.id}">
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

            // Handle Hash Linking for Blog
            if (window.location.hash) {
                var hash = window.location.hash; // e.g., #blog-1
                if (hash.startsWith("#blog-")) {
                    var blogId = hash.replace("#blog-", "");
                    var targetCollapse = $("#collapse" + blogId);
                    
                    if (targetCollapse.length && $(hash).length) {
                        // Scroll to the item
                        $('html, body').animate({
                            scrollTop: $(hash).offset().top - 100
                        }, 1000);
                        
                        // Open the accordion if closed
                        // Use getOrCreateInstance to avoid errors if already initialized
                        var bsCollapse = bootstrap.Collapse.getOrCreateInstance(targetCollapse[0], {
                            toggle: false
                        });
                        bsCollapse.show();
                        
                        // Highlight
                        $(hash).addClass("border border-primary");
                    }
                }
            }
        }

        // 4. Populate Full Catalog on Catalog Page with Search & Sort
        if ($("#full-catalog-container").length) {
            var allProducts = data.catalog;

            function renderCatalog(productsToRender) {
                $("#full-catalog-container").empty();
                
                if (productsToRender.length === 0) {
                     $("#full-catalog-container").append('<div class="col-12 text-center"><p class="text-muted">No products found matching your criteria.</p></div>');
                     return;
                }

                $.each(productsToRender, function(index, item) {
                    var card = `
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="card h-100 shadow-sm border-0 catalog-card" style="display:none;">
                                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${item.name} <span class="badge bg-primary float-end">${item.price}</span></h5>
                                    <p class="card-text text-muted">${item.category}</p>
                                    <button class="btn btn-primary mt-auto w-100 add-to-cart-btn" data-name="${item.name}">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#full-catalog-container").append(card);
                });
                
                $(".catalog-card").fadeIn(500);
            }

            function filterAndSortCatalog() {
                var searchText = $("#catalogSearch").val().toLowerCase();
                var sortOption = $("#catalogSort").val();
                
                // Filter
                var filtered = allProducts.filter(function(item) {
                    return item.name.toLowerCase().includes(searchText) || 
                           item.category.toLowerCase().includes(searchText);
                });
                
                // Sort
                filtered.sort(function(a, b) {
                    // Helper to parse price string "$99.99" -> 99.99
                    var priceA = parseFloat(a.price.replace(/[^0-9.-]+/g,""));
                    var priceB = parseFloat(b.price.replace(/[^0-9.-]+/g,""));

                    if (sortOption === 'price-low') {
                        return priceA - priceB;
                    } else if (sortOption === 'price-high') {
                        return priceB - priceA;
                    } else if (sortOption === 'name-asc') {
                        return a.name.localeCompare(b.name);
                    } else if (sortOption === 'category') {
                        return a.category.localeCompare(b.category);
                    } else {
                        return a.id - b.id; // Default
                    }
                });
                
                renderCatalog(filtered);
            }

            // Initial Render
            renderCatalog(allProducts);

            // Event Listeners
            $("#catalogSearch").on("keyup", filterAndSortCatalog);
            $("#catalogSort").on("change", filterAndSortCatalog);

            // Handle "Add to Cart" Click using delegation
            $("#full-catalog-container").on("click", ".add-to-cart-btn", function() {
                var name = $(this).data("name");
                $("#modal-product-name").text(name);
                var myModal = new bootstrap.Modal(document.getElementById('productModal'));
                myModal.show();
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

    // Carousel Swipe Support (Mouse, Touch & Touchpad)
    var carousel = $("#heroCarousel");
    if (carousel.length) {
        var startX = 0;
        var endX = 0;
        var isDragging = false;
        var bsCarousel = bootstrap.Carousel.getOrCreateInstance(carousel[0]);

        // Prevent default image dragging to allow mouse swipe
        carousel.find("img").on("dragstart", function(e) {
            e.preventDefault();
        });

        // Touch & Mouse Events
        carousel.on("touchstart mousedown", function(e) {
            // Check if we are clicking a button/control, if so let it pass
            if ($(e.target).closest('.carousel-control-prev, .carousel-control-next, .carousel-indicators').length) {
                return;
            }
            
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
            
            var threshold = 50; 
            if (startX - endX > threshold) {
                // Swiped left
                bsCarousel.next();
            } else if (endX - startX > threshold) {
                // Swiped right
                bsCarousel.prev();
            }

            // Prevent link clicks if user was dragging
            if (Math.abs(startX - endX) > threshold) {
                // This listener needs to run in the capture phase or prevent current click sequence
                carousel.find('a').one('click', function(clickEvent) {
                    clickEvent.preventDefault();
                    clickEvent.stopPropagation();
                });
            }
        });

        // Touchpad Horizontal Scroll (Wheel) Support
        carousel.on("wheel", function(e) {
            // Check for horizontal scroll
            if (Math.abs(e.originalEvent.deltaX) > Math.abs(e.originalEvent.deltaY)) {
                
                // If horizontal scroll is detected, prevent page navigation/scroll if desired,
                // but usually user just wants the carousel to move, not the page to go back 
                // e.preventDefault(); // Might trigger passive listener error
                
                // Debounce/Throttle usage to prevent rapid switching
                if (carousel.data('isScrolling')) return;
                
                if (e.originalEvent.deltaX > 20) {
                    bsCarousel.next();
                    setScrollLock();
                } else if (e.originalEvent.deltaX < -20) {
                    bsCarousel.prev();
                    setScrollLock();
                }
            }
        });

        function setScrollLock() {
            carousel.data('isScrolling', true);
            setTimeout(function() {
                carousel.data('isScrolling', false);
            }, 1000); // 1-second timeout
        }
    }
});
