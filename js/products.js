// Filter & Sort Functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));

    // Quick View Modal
    const modal = document.getElementById('quick-view-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const closeModal = document.querySelector('.close-modal');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const product = this.closest('.product-card');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('.price').textContent;
            const productImg = product.querySelector('img').src;

            document.getElementById('modal-product-name').textContent = productName;
            document.getElementById('modal-product-price').textContent = productPrice;
            document.getElementById('modal-product-img').src = productImg;

            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Filtering
    function filterProducts() {
        const category = categoryFilter.value;
        const priceRange = priceFilter.value;

        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const productPrice = parseInt(product.getAttribute('data-price'));

            const categoryMatch = (category === 'all' || productCategory === category);
            let priceMatch = true;

            if (priceRange !== 'all') {
                const [min, max] = priceRange.split('-').map(Number);
                if (max) {
                    priceMatch = (productPrice >= min && productPrice <= max);
                } else {
                    priceMatch = (productPrice >= min);
                }
            }

            if (categoryMatch && priceMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Sorting
    function sortProducts() {
        const sortValue = sortBy.value;
        const filteredProducts = products.filter(p => p.style.display !== 'none');

        filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));

            if (sortValue === 'price-low') return priceA - priceB;
            if (sortValue === 'price-high') return priceB - priceA;
            return 0;
        });

        filteredProducts.forEach(product => {
            productGrid.appendChild(product);
        });
    }

    // Event Listeners
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', sortProducts);
});