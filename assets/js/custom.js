(function ($) {

    "use strict";

    // Page loading animation
    $(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      var box = $('.header-text').height();
      var header = $('header').height();

      if (scroll >= box - header) {
        $("header").addClass("background-header");
      } else {
        $("header").removeClass("background-header");
      }
    })

    $('.owl-banner').owlCarousel({
      center: true,
      items:1,
      loop:true,
      nav: true,
      dots:true,
      navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
        1200:{
            items:1
        }
      }
    });

    var width = $(window).width();
        $(window).resize(function() {
        if (width > 767 && $(window).width() < 767) {
            location.reload();
        }
        else if (width < 767 && $(window).width() > 767) {
            location.reload();
        }
    })

    const elem = document.querySelector('.properties-box');
    const filtersElem = document.querySelector('.properties-filter');
    if (elem) {
        const rdn_events_list = new Isotope(elem, {
            itemSelector: '.properties-items',
            layoutMode: 'masonry'
        });
        if (filtersElem) {
            filtersElem.addEventListener('click', function(event) {
                if (!matchesSelector(event.target, 'a')) {
                    return;
                }
                const filterValue = event.target.getAttribute('data-filter');
                rdn_events_list.arrange({
                    filter: filterValue
                });
                filtersElem.querySelector('.is_active').classList.remove('is_active');
                event.target.classList.add('is_active');
                event.preventDefault();
            });
        }
    }


    // Menu Dropdown Toggle
    if($('.menu-trigger').length){
        $(".menu-trigger").on('click', function() {
            $(this).toggleClass('active');
            $('.header-area .nav').slideToggle(200);
        });
    }


    // Menu elevator animation
    $('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                var width = $(window).width();
                if(width < 991) {
                    $('.menu-trigger').removeClass('active');
                    $('.header-area .nav').slideUp(200);
                }
                $('html,body').animate({
                    scrollTop: (target.offset().top) - 80
                }, 700);
                return false;
            }
        }
    });


    // Page loading animation
    $(window).on('load', function() {
        if($('.cover').length){
            $('.cover').parallax({
                imageSrc: $('.cover').data('image'),
                zIndex: '1'
            });
        }

        $("#preloader").animate({
            'opacity': '0'
        }, 600, function(){
            setTimeout(function(){
                $("#preloader").css("visibility", "hidden").fadeOut();
            }, 300);
        });
    });


    // New code for contact form submission and property fetching
    document.addEventListener('DOMContentLoaded', () => {
        const contactForm = document.getElementById('contact-form'); // Assuming your form has this ID

        if (contactForm) {
            contactForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch('http://localhost:5000/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    // Using a custom modal/message box instead of alert()
                    if (response.ok) {
                        displayMessage(result.message, 'success');
                        contactForm.reset(); // Clear the form
                    } else {
                        displayMessage('Error submitting message: ' + result.message, 'error');
                    }
                } catch (error) {
                    console.error('Network error:', error);
                    displayMessage('Could not connect to the server. Please try again later.', 'error');
                }
            });
        }

        // Function to display custom messages (instead of alert)
        function displayMessage(message, type) {
            const messageBox = document.createElement('div');
            messageBox.style.position = 'fixed';
            messageBox.style.top = '20px';
            messageBox.style.left = '50%';
            messageBox.style.transform = 'translateX(-50%)';
            messageBox.style.padding = '15px 25px';
            messageBox.style.borderRadius = '8px';
            messageBox.style.zIndex = '1000';
            messageBox.style.color = 'white';
            messageBox.style.fontWeight = 'bold';
            messageBox.style.textAlign = 'center';
            messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            messageBox.style.transition = 'opacity 0.5s ease-in-out';

            if (type === 'success') {
                messageBox.style.backgroundColor = '#4CAF50'; // Green
            } else if (type === 'error') {
                messageBox.style.backgroundColor = '#f44336'; // Red
            } else {
                messageBox.style.backgroundColor = '#2196F3'; // Blue (info)
            }

            messageBox.textContent = message;
            document.body.appendChild(messageBox);

            setTimeout(() => {
                messageBox.style.opacity = '0';
                messageBox.addEventListener('transitionend', () => messageBox.remove());
            }, 3000); // Message disappears after 3 seconds
        }

        // For property listings, you would fetch data similarly:
        // This part would likely be integrated into properties.html or index.html
        // to dynamically load content.
        // Example (conceptual, adjust based on your HTML structure):
        // const propertiesContainer = document.querySelector('.properties .row');
        // if (propertiesContainer) {
        //     fetch('http://localhost:5000/api/properties')
        //         .then(response => response.json())
        //         .then(properties => {
        //             propertiesContainer.innerHTML = ''; // Clear existing static content
        //             properties.forEach(property => {
        //                 const propertyHtml = `
        //                     <div class="col-lg-4 col-md-6">
        //                         <div class="item">
        //                             <a href="property-details.html?id=${property._id}"><img src="${property.images[0] || 'https://placehold.co/770x520/cccccc/ffffff?text=No+Image'}" alt="${property.title}"></a>
        //                             <span class="category">${property.type}</span>
        //                             <h6>$${property.price.toLocaleString()}</h6>
        //                             <h4><a href="property-details.html?id=${property._id}">${property.location}</a></h4>
        //                             <ul>
        //                                 <li>Bedrooms: <span>${property.bedrooms}</span></li>
        //                                 <li>Bathrooms: <span>${property.bathrooms}</span></li>
        //                                 <li>Area: <span>${property.area}</span></li>
        //                                 <li>Floor: <span>${property.floor}</span></li>
        //                                 <li>Parking: <span>${property.parkingSpots} spots</span></li>
        //                             </ul>
        //                             <div class="main-button">
        //                                 <a href="property-details.html?id=${property._id}">Schedule a visit</a>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 `;
        //                 propertiesContainer.insertAdjacentHTML('beforeend', propertyHtml);
        //             });
        //         })
        //         .catch(error => {
        //             console.error('Error fetching properties:', error);
        //             displayMessage('Failed to load properties. Please try again later.', 'error');
        //         });
        // }
    });


})(window.jQuery);
