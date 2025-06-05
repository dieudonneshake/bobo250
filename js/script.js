document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
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

    // Rest of your existing JavaScript...
    // (Keep all the product filtering, sorting, search functionality, etc.)
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
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Product filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-category');
            
            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
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
                        return 0; // In a real app, you would sort by date
                }
            });
            
            // Re-append sorted products with animation
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
            // Show all products if search is empty
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            });
            return;
        }
        
        const searchTerm = query.toLowerCase();
        let hasResults = false;
        
        document.querySelectorAll('.product-card').forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.getAttribute('data-category').toLowerCase();
            
            if (productName.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            // Show no results message
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
                
                // In a real app, you would fetch product description from a data attribute or API
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
    
    // Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-details').querySelector('h3').textContent;
            alert(`Added ${productName} to your order!`);
            
            // Animation feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
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