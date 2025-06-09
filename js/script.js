document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

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
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    
  // Replace the existing product filtering code with this:
 const filterButtons = document.querySelectorAll('.filter-btn');
 const productCards = document.querySelectorAll('.product-card');
 const categoryTitles = document.querySelectorAll('.category-title');

 filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-category');
        
        // Hide all category titles initially
        categoryTitles.forEach(title => {
            title.style.display = 'none';
        });
        
        // Filter products and show relevant category title
        productCards.forEach(card => {
            if (filterValue === 'all') {
                // Show all products and all category titles
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
                categoryTitles.forEach(title => {
                    title.style.display = 'block';
                });
            } else if (card.getAttribute('data-category') === filterValue) {
                // Show matching products and their category title
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
                
                // Show the matching category title
                const categoryId = card.closest('.products-grid').id;
                document.querySelector(`#${categoryId} .category-title`).style.display = 'block';
            } else {
                // Hide non-matching products
                card.style.display = 'none';
            }
        });
    });
 });


    // Product sorting
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsContainer = document.querySelector('.products-container');
            const products = Array.from(productsContainer.querySelectorAll('.product-card'));
            
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                
                switch(sortValue) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'newest':
                    default:
                        return 0;
                }
            });
            
            products.forEach((product, index) => {
                product.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
                productsContainer.appendChild(product);
            });
        });
    }

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-box input');
    const searchButtons = document.querySelectorAll('.search-box button');

    searchButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(searchInputs[index].value);
        });
    });

    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    });

    function performSearch(query) {
        if (!query.trim()) {
            // Show all products and category titles if search is empty
            productCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            });
            categoryTitles.forEach(title => {
                title.style.display = 'block';
            });
            return;
        }
        
        const searchTerm = query.toLowerCase();
        let hasResults = false;
        
        // Hide all category titles during search
        categoryTitles.forEach(title => {
            title.style.display = 'none';
        });
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.getAttribute('data-category').toLowerCase();
            
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            alert('No products found matching your search.');
        }
    }
    
    // Quick View Modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');

    if (quickViewButtons.length && quickViewModal) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productImage = productCard.querySelector('img').src;
                
                // Set modal content
                document.getElementById('modalProductName').textContent = productName;
                document.getElementById('modalProductPrice').textContent = productPrice;
                document.getElementById('modalProductImage').src = productImage;
                
                // Product description
                document.getElementById('modalProductDescription').textContent = 
                    `This is a premium ${productName} with all the latest features and technology.`;
                
                // Show modal with animation
                quickViewModal.style.display = 'block';
                setTimeout(() => {
                    quickViewModal.querySelector('.modal-content').style.transform = 'scale(1)';
                    quickViewModal.querySelector('.modal-content').style.opacity = '1';
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', function() {
            quickViewModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            quickViewModal.querySelector('.modal-content').style.opacity = '0';
            setTimeout(() => {
                quickViewModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
                quickViewModal.querySelector('.modal-content').style.opacity = '0';
                setTimeout(() => {
                    quickViewModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // WhatsApp Message Functionality
    function sendWhatsAppMessage(productName, productPrice) {
        const phoneNumber = '+250781370531';
        const message = `Hello BOBO250 Electronics Shop,\n\nI would like to purchase:\nProduct: ${productName}\nPrice: ${productPrice}\n\nPlease provide more details about availability, delivery and payment options.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }

    // Handle Buy Now Button Click - Enhanced for all product types
    function handleBuyNowClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const productCard = button.closest('.product-card');
        
        if (productCard) {
            let productName, productPrice;
            
            // Handle simple product cards (like phone cases)
            if (productCard.classList.contains('simple-case')) {
                productName = productCard.querySelector('img').alt || 'Product';
                // Try to find price in various locations
                productPrice = productCard.querySelector('.price')?.textContent || 
                              productCard.dataset.price || 
                              '$0';
            } 
            // Handle regular product cards
            else {
                productName = productCard.querySelector('h3').textContent;
                productPrice = productCard.querySelector('.price').textContent;
            }
            
            sendWhatsAppMessage(productName, productPrice);
            
            // Animation feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Initialize all Buy Now buttons (both regular and simple)
    function initializeBuyNowButtons() {
        // Handle both button types
        document.querySelectorAll('.buy-now, .buy-now-simple').forEach(button => {
            // Skip modal button (handled separately)
            if (!button.closest('#quickViewModal')) {
                button.addEventListener('click', handleBuyNowClick);
            }
        });
        
        // Modal buy now button (separate handler)
        const modalBuyNow = document.querySelector('#quickViewModal .buy-now');
        if (modalBuyNow) {
            modalBuyNow.addEventListener('click', function(e) {
                e.preventDefault();
                const productName = document.getElementById('modalProductName').textContent;
                const productPrice = document.getElementById('modalProductPrice').textContent;
                
                sendWhatsAppMessage(productName, productPrice);
                
                // Animation feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    // Initialize buy now buttons on page load
    initializeBuyNowButtons();

    // Event delegation as fallback for dynamically added buttons
    document.addEventListener('click', function(e) {
        const buyNowButton = e.target.closest('.buy-now, .buy-now-simple');
        if (buyNowButton && !buyNowButton.closest('#quickViewModal') && !e.defaultPrevented) {
            handleBuyNowClick(e);
        }
    });

    // Add animations to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.slide-up, .fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                // Animation feedback
                const button = this.querySelector('button');
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                setTimeout(() => {
                    button.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                }, 2000);
                
                emailInput.value = '';
            } else {
                emailInput.style.border = '1px solid red';
                setTimeout(() => {
                    emailInput.style.border = '1px solid #ddd';
                }, 2000);
            }
        });
    });
});
