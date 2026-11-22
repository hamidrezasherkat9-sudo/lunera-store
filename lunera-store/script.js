
document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const menuBtn = document.getElementById("menuBtn");
    const mainNav = document.getElementById("mainNav");

    const searchBtn = document.getElementById("searchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const cartBtn = document.getElementById("cartBtn");
    const closeCart = document.getElementById("closeCart");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartBackdrop = document.getElementById("cartBackdrop");

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const toast = document.getElementById("toast");

    let cart = [];
    let toastTimer;

    // Persian number formatter
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    // Toast notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // Mobile menu
    menuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("show");
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("show");
        });
    });

    // Search panel
    searchBtn.addEventListener("click", () => {
        searchPanel.classList.toggle("show");

        if (searchPanel.classList.contains("show")) {
            searchInput.focus();
        }
    });

    closeSearch.addEventListener("click", () => {
        searchPanel.classList.remove("show");
        searchInput.value = "";
        resetSearch();
    });

    // Search products
    function searchProducts() {
        const query = searchInput.value.trim().toLowerCase();

        const products = document.querySelectorAll(".product-card");

        let visibleCount = 0;

        products.forEach(product => {
            const name = product.dataset.name.toLowerCase();
            const category = product.dataset.category.toLowerCase();

            const matched = name.includes(query) || category.includes(query);

            product.classList.toggle("hidden", !matched);

            if (matched) {
                visibleCount++;
            }
        });

        document.getElementById("emptyProducts").hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", searchProducts);

    function resetSearch() {
        document.querySelectorAll(".product-card").forEach(product => {
            product.classList.remove("hidden");
        });

        document.getElementById("emptyProducts").hidden = true;
    }

    // Product filters
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            let visibleCount = 0;

            document.querySelectorAll(".product-card").forEach(product => {

                const category = product.dataset.category;

                const matched = filter === "all" || category === filter;

                product.classList.toggle("hidden", !matched);

                if (matched) {
                    visibleCount++;
                }
            });

            searchInput.value = "";

            document.getElementById("emptyProducts").hidden = visibleCount !== 0;
        });
    });

    // Collection cards
    document.querySelectorAll(".collection-card").forEach(card => {

        card.addEventListener("click", () => {

            const category = card.dataset.category;

            filterButtons.forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.filter === category
                );
            });

            document.querySelectorAll(".product-card").forEach(product => {
                product.classList.toggle(
                    "hidden",
                    product.dataset.category !== category
                );
            });

            document.getElementById("emptyProducts").hidden = false;

            const visibleProducts = document.querySelectorAll(
                ".product-card:not(.hidden)"
            );

            document.getElementById("emptyProducts").hidden =
                visibleProducts.length > 0;
        });
    });

    // Open cart
    function openCart() {
        cartDrawer.classList.add("show");
        cartBackdrop.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    // Close cart
    function hideCart() {
        cartDrawer.classList.remove("show");
        cartBackdrop.classList.remove("show");
        document.body.style.overflow = "";
    }

    cartBtn.addEventListener("click", openCart);
    closeCart.addEventListener("click", hideCart);
    cartBackdrop.addEventListener("click", hideCart);

    // Add product to cart
    document.querySelectorAll(".quick-add").forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.product;
            const price = Number(button.dataset.price);

            const existingProduct = cart.find(item => item.name === name);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();

            showToast(name + " به سبد خرید اضافه شد");
        });
    });

    // Update cart
    function updateCart() {

        const totalItems = cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

        const totalPrice = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        cartCount.textContent = formatPrice(totalItems);

        cartTotal.textContent = formatPrice(totalPrice) + " تومان";

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <p class="cart-empty">سبد خرید شما خالی است.</p>
            `;

            return;
        }

        cartItems.innerHTML = cart.map((item, index) => {

            return `
                <div class="cart-item">

                    <div>
                        <h3>${item.name}</h3>

                        <p>
                            ${formatPrice(item.price)} تومان
                            ×
                            ${formatPrice(item.quantity)}
                        </p>
                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                    >
                        حذف
                    </button>

                </div>
            `;

        }).join("");

        // Remove product
        cartItems.querySelectorAll(".remove-item").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cart.splice(index, 1);

                updateCart();

                showToast("محصول از سبد خرید حذف شد");

            });

        });

    }

    // Checkout demo
    document.getElementById("checkoutBtn").addEventListener("click", () => {

        if (cart.length === 0) {
            showToast("سبد خرید شما خالی است");
            return;
        }

        showToast("این بخش در نسخه نهایی به ووکامرس متصل می‌شود");

    });

    // Newsletter demo
    document.getElementById("newsletterForm").addEventListener("submit", event => {

        event.preventDefault();

        showToast("این فرم در نسخه نهایی به خبرنامه متصل می‌شود");

        event.target.reset();

    });

    // Initial cart
    updateCart();

});

document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const menuBtn = document.getElementById("menuBtn");
    const mainNav = document.getElementById("mainNav");

    const searchBtn = document.getElementById("searchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const cartBtn = document.getElementById("cartBtn");
    const closeCart = document.getElementById("closeCart");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartBackdrop = document.getElementById("cartBackdrop");

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const toast = document.getElementById("toast");

    // Style Finder
    const styleOccasion = document.getElementById("styleOccasion");
    const styleColor = document.getElementById("styleColor");
    const styleBudget = document.getElementById("styleBudget");
    const findMyStyle = document.getElementById("findMyStyle");
    const finderResult = document.getElementById("finderResult");
    const finderResultText = document.getElementById("finderResultText");
    const resetFinder = document.getElementById("resetFinder");

    const products = Array.from(document.querySelectorAll(".product-card"));
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const emptyProducts = document.getElementById("emptyProducts");

    let cart = [];
    let toastTimer;
    let selectedCategory = "all";

    // Persian number formatter
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    // Toast notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // Product filtering
    function applyProductFilters() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        products.forEach(product => {
            const name = (product.dataset.name || "").toLowerCase();
            const category = (product.dataset.category || "").toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                product.dataset.category === selectedCategory;

            const matchesSearch =
                !query ||
                name.includes(query) ||
                category.includes(query);

            const visible = matchesCategory && matchesSearch;

            product.classList.toggle("hidden", !visible);

            if (visible) {
                visibleCount++;
            }
        });

        emptyProducts.hidden = visibleCount !== 0;
    }

    function setActiveFilter(category) {
        filterButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === category
            );
        });
    }

    function clearFinderResult() {
        if (finderResult) {
            finderResult.hidden = true;
        }
    }

    // Mobile menu
    menuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("show");
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("show");
        });
    });

    // Search panel
    searchBtn.addEventListener("click", () => {
        searchPanel.classList.toggle("show");

        if (searchPanel.classList.contains("show")) {
            searchInput.focus();
        }
    });

    closeSearch.addEventListener("click", () => {
        searchPanel.classList.remove("show");
        searchInput.value = "";
        applyProductFilters();
    });

    // Search products
    searchInput.addEventListener("input", () => {
        clearFinderResult();
        applyProductFilters();
    });

    // Product filters
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.filter;
            setActiveFilter(selectedCategory);

            searchInput.value = "";
            clearFinderResult();
            applyProductFilters();
        });
    });

    // Collection cards
    document.querySelectorAll(".collection-card").forEach(card => {
        card.addEventListener("click", () => {
            selectedCategory = card.dataset.category || "all";

            setActiveFilter(selectedCategory);
            searchInput.value = "";
            clearFinderResult();
            applyProductFilters();
        });
    });

    // Smart Style Finder
    if (findMyStyle) {
        findMyStyle.addEventListener("click", () => {

            const occasion = styleOccasion.value;
            const color = styleColor.value;
            const budget = styleBudget.value;

            let visibleCount = 0;

            selectedCategory = "all";
            setActiveFilter("all");
            searchInput.value = "";

            products.forEach(product => {

                const occasions = (product.dataset.occasions || "").split(" ");
                const colors = (product.dataset.colors || "").split(" ");
                const price = Number(product.dataset.price || 0);

                const matchesOccasion =
                    occasion === "all" || occasions.includes(occasion);

                const matchesColor =
                    color === "all" || colors.includes(color);

                const matchesBudget =
                    budget === "all" || price <= Number(budget);

                const matched =
                    matchesOccasion && matchesColor && matchesBudget;

                product.classList.toggle("hidden", !matched);

                if (matched) {
                    visibleCount++;
                }
            });

            emptyProducts.hidden = visibleCount !== 0;

            finderResult.hidden = false;

            if (visibleCount > 0) {
                finderResultText.textContent =
                    formatPrice(visibleCount) +
                    " محصول متناسب با انتخاب‌های تو پیدا کردیم.";
            } else {
                finderResultText.textContent =
                    "با این ترکیب انتخاب، محصولی پیدا نشد. می‌تونی رنگ یا بودجه‌ات رو تغییر بدی.";
            }

           finderResult.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
        });
    }

    // Reset Style Finder
    if (resetFinder) {
        resetFinder.addEventListener("click", () => {

            styleOccasion.value = "all";
            styleColor.value = "all";
            styleBudget.value = "all";

            selectedCategory = "all";
            searchInput.value = "";

            setActiveFilter("all");
            clearFinderResult();
            applyProductFilters();

            document.getElementById("products").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    // Open cart
    function openCart() {
        cartDrawer.classList.add("show");
        cartBackdrop.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    // Close cart
    function hideCart() {
        cartDrawer.classList.remove("show");
        cartBackdrop.classList.remove("show");
        document.body.style.overflow = "";
    }

    cartBtn.addEventListener("click", openCart);
    closeCart.addEventListener("click", hideCart);
    cartBackdrop.addEventListener("click", hideCart);

    // Add product to cart
    document.querySelectorAll(".quick-add").forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.product;
            const price = Number(button.dataset.price);

            const existingProduct = cart.find(item => item.name === name);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
            showToast(name + " به سبد خرید اضافه شد");
        });
    });

    // Update cart
    function updateCart() {

        const totalItems = cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

        const totalPrice = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        cartCount.textContent = formatPrice(totalItems);
        cartTotal.textContent = formatPrice(totalPrice) + " تومان";

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <p class="cart-empty">سبد خرید شما خالی است.</p>
            `;
            return;
        }

        cartItems.innerHTML = cart.map((item, index) => {
            return `
                <div class="cart-item">
                    <div>
                        <h3>${item.name}</h3>
                        <p>
                            ${formatPrice(item.price)} تومان
                            ×
                            ${formatPrice(item.quantity)}
                        </p>
                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                    >
                        حذف
                    </button>
                </div>
            `;
        }).join("");

        // Remove product
        cartItems.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cart.splice(index, 1);

                updateCart();
                showToast("محصول از سبد خرید حذف شد");
            });
        });
    }

    // Checkout demo
    document.getElementById("checkoutBtn").addEventListener("click", () => {

        if (cart.length === 0) {
            showToast("سبد خرید شما خالی است");
            return;
        }

        showToast("این بخش در نسخه نهایی به ووکامرس متصل می‌شود");
    });

    // Newsletter demo
    document.getElementById("newsletterForm").addEventListener("submit", event => {

        event.preventDefault();

        showToast("این فرم در نسخه نهایی به خبرنامه متصل می‌شود");

        event.target.reset();
    });

    // Initial state
    updateCart();
    applyProductFilters();

});
