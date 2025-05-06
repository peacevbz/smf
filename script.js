// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainMenu = document.getElementById('mainMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mainMenu.classList.toggle('show');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('#mainMenu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainMenu.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.slider-dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        let nextIndex = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }, 5000);

    // Pause auto-rotation on hover
    const slider = document.querySelector('.testimonials-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    slider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            let nextIndex = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(nextIndex);
        }, 5000);
    });

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Responsive adjustments
    function handleResponsiveChanges() {
        // Adjust service card layout based on screen size
        const servicesGrid = document.querySelector('.services-grid');
        if (window.innerWidth < 768) {
            servicesGrid.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 1024) {
            servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            servicesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }

    // Initial call and on resize
    handleResponsiveChanges();
    window.addEventListener('resize', handleResponsiveChanges);

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const lazyLoad = function() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight + 100 && 
                    img.getBoundingClientRect().bottom > 0 && 
                    getComputedStyle(img).display !== 'none') {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        };

        // Initial load
        lazyLoad();
        
        // Load on scroll/resize
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
});
// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Change button text to show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simple form validation
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const message = this.message.value.trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            return;
        }
        
        // Using FormSubmit.co service to handle the email sending
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully! We will contact you soon.');
                this.reset();
                
                // If you have a thank you page, you can redirect here:
                // window.location.href = '/thank-you.html';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}