document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // 向下滚动且滚动超过150px
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动或在页面顶部
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 添加移动端菜单按钮
    const mainNav = document.querySelector('.main-nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.setAttribute('aria-label', '菜单');
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
    
    const headerContainer = document.querySelector('.header-container');
    headerContainer.appendChild(mobileMenuBtn);
    
    // 移动端菜单切换
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // 防止菜单打开时页面滚动
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // 添加移动端菜单样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            width: 30px;
            height: 30px;
            position: relative;
            z-index: 1010;
            cursor: pointer;
            margin-left: auto;
        }
        
        .mobile-menu-btn span {
            display: block;
            width: 100%;
            height: 3px;
            background: var(--primary-color);
            margin: 5px 0;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 6px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -6px);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
                position: absolute;
                top: 20px;
                right: 20px;
            }
            
            .main-nav {
                height: 0;
                overflow: hidden;
                transition: height 0.3s ease;
            }
            
            .main-nav.active {
                height: 100vh;
                overflow-y: auto;
            }
            
            .header-container {
                position: relative;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // 搜索功能
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBox && searchBtn) {
        // 点击搜索按钮时执行搜索
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        // 在搜索框中按下回车键时执行搜索
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 执行搜索功能
        function performSearch() {
            const searchTerm = searchBox.value.trim().toLowerCase();
            if (searchTerm) {
                // 获取所有卡片、文章和内容块
                const cards = document.querySelectorAll('.card, .meeting-card, .interview-container, .tm-sidebar-item');
                let hasResults = false;
                let firstMatchedCard = null;
                
                // 移除之前添加的高亮效果
                document.querySelectorAll('.search-highlight').forEach(el => {
                    el.outerHTML = el.textContent;
                });
                
                // 移除之前搜索状态
                const oldStatus = document.querySelector('.search-results-status');
                if (oldStatus) {
                    document.body.removeChild(oldStatus);
                }
                
                // 显示搜索结果状态
                const searchResultsStatus = document.createElement('div');
                searchResultsStatus.className = 'search-results-status';
                searchResultsStatus.style.position = 'fixed';
                searchResultsStatus.style.top = '150px';
                searchResultsStatus.style.left = '50%';
                searchResultsStatus.style.transform = 'translateX(-50%)';
                searchResultsStatus.style.backgroundColor = 'rgba(44, 130, 195, 0.95)';
                searchResultsStatus.style.color = 'white';
                searchResultsStatus.style.padding = '15px 25px';
                searchResultsStatus.style.borderRadius = '8px';
                searchResultsStatus.style.zIndex = '9999';
                searchResultsStatus.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                searchResultsStatus.style.fontSize = '16px';
                searchResultsStatus.style.fontWeight = '500';
                
                // 遍历所有内容并匹配搜索词
                cards.forEach(card => {
                    // 移除之前的样式
                    card.style.boxShadow = '';
                    card.style.transform = '';
                    card.classList.remove('search-matched');
                    
                    // 获取标题和内容文本
                    const titleEl = card.querySelector('h3, h4');
                    const contentEl = card.querySelector('p');
                    
                    const title = titleEl?.textContent.toLowerCase() || '';
                    const content = contentEl?.textContent.toLowerCase() || '';
                    
                    // 如果标题或内容包含搜索词
                    if (title.includes(searchTerm) || content.includes(searchTerm)) {
                        // 高亮匹配的内容
                        card.style.boxShadow = '0 8px 25px rgba(44, 130, 195, 0.4)';
                        card.style.transform = 'translateY(-8px)';
                        card.style.transition = 'all 0.4s ease';
                        card.classList.add('search-matched');
                        
                        // 高亮文本
                        if (titleEl && title.includes(searchTerm)) {
                            highlightText(titleEl, searchTerm);
                        }
                        
                        if (contentEl && content.includes(searchTerm)) {
                            highlightText(contentEl, searchTerm);
                        }
                        
                        // 标记第一个匹配的卡片
                        if (!firstMatchedCard) {
                            firstMatchedCard = card;
                        }
                        
                        hasResults = true;
                    } else {
                        // 淡化未匹配的内容
                        card.style.opacity = '0.6';
                        card.style.transform = 'scale(0.98)';
                        card.style.transition = 'all 0.3s ease';
                    }
                });
                
                // 显示搜索结果状态
                if (hasResults) {
                    searchResultsStatus.innerHTML = `<span style="display:inline-block;margin-right:8px;color:#ffab00">✓</span> 找到与"<strong>${searchTerm}</strong>"相关的内容`;
                    
                    // 滚动到第一个匹配的结果
                    if (firstMatchedCard) {
                        setTimeout(() => {
                            firstMatchedCard.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }, 300);
                    }
                } else {
                    searchResultsStatus.innerHTML = `<span style="display:inline-block;margin-right:8px;color:#ffab00">!</span> 未找到与"<strong>${searchTerm}</strong>"相关的内容`;
                    searchResultsStatus.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
                }
                
                document.body.appendChild(searchResultsStatus);
                
                // 5秒后移除状态提示
                setTimeout(() => {
                    searchResultsStatus.style.opacity = '0';
                    searchResultsStatus.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        if (document.body.contains(searchResultsStatus)) {
                            document.body.removeChild(searchResultsStatus);
                        }
                    }, 500);
                    
                    // 恢复卡片样式
                    setTimeout(() => {
                        cards.forEach(card => {
                            if (!card.classList.contains('search-matched')) {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }
                        });
                    }, 5000);
                }, 5000);
            }
        }
        
        // 高亮文本函数
        function highlightText(element, searchTerm) {
            const html = element.innerHTML;
            const regex = new RegExp(searchTerm, 'gi');
            const newHtml = html.replace(regex, match => `<span class="search-highlight" style="background-color:rgba(255, 171, 0, 0.3);padding:0 2px;border-radius:3px;font-weight:bold;">${match}</span>`);
            element.innerHTML = newHtml;
        }
    }

    // 下拉菜单移动端交互优化
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
        
        if (window.innerWidth <= 768) {
            if (dropdown) {
                navLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.classList.toggle('active');
                    
                    // 使用slideToggle效果显示/隐藏下拉菜单
                    if (dropdown.style.maxHeight) {
                        dropdown.style.maxHeight = null;
                        dropdown.style.display = 'none';
                    } else {
                        dropdown.style.display = 'block';
                        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
                    }
                    
                    // 关闭其他打开的下拉菜单
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherDropdown = otherItem.querySelector('.dropdown');
                            const otherLink = otherItem.querySelector('.nav-link');
                            if (otherDropdown && otherDropdown.style.maxHeight) {
                                otherDropdown.style.maxHeight = null;
                                otherDropdown.style.display = 'none';
                                otherLink.classList.remove('active');
                            }
                        }
                    });
                });
            }
        } else {
            // 桌面版交互
            if (dropdown) {
                item.addEventListener('mouseenter', function() {
                    dropdown.style.display = 'block';
                    setTimeout(() => {
                        dropdown.style.opacity = '1';
                        dropdown.style.transform = 'translateY(0)';
                    }, 50);
                });
                
                item.addEventListener('mouseleave', function() {
                    dropdown.style.opacity = '0';
                    dropdown.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        dropdown.style.display = '';
                    }, 300);
                });
            }
        }
    });
    
    // 窗口大小变化时重新应用响应式布局
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // 恢复主导航样式
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn.classList.remove('active');
            
            // 重置下拉菜单样式
            navItems.forEach(item => {
                const dropdown = item.querySelector('.dropdown');
                if (dropdown) {
                    dropdown.style.display = '';
                    dropdown.style.maxHeight = '';
                }
            });
        }
    });

    // 导航链接悬停效果
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card, .meeting-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(46, 140, 205, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        });
    });

    // 图片悬停效果
    const cardImages = document.querySelectorAll('.card-image, .meeting-image, .tm-main-image');
    cardImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.08)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 会员卡片交互效果
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const imgContainer = this.querySelector('.member-image-container');
            const img = this.querySelector('.member-image');
            const name = this.querySelector('h4');
            
            imgContainer.style.boxShadow = '0 10px 25px rgba(46, 140, 205, 0.3)';
            imgContainer.style.borderColor = 'rgb(90, 165, 220)';
            img.style.transform = 'scale(1.08)';
            name.style.color = 'rgb(32, 110, 170)';
        });
        
        card.addEventListener('mouseleave', function() {
            const imgContainer = this.querySelector('.member-image-container');
            const img = this.querySelector('.member-image');
            const name = this.querySelector('h4');
            
            imgContainer.style.boxShadow = 'none';
            imgContainer.style.borderColor = 'rgb(46, 140, 205)';
            img.style.transform = 'scale(1)';
            name.style.color = '';
        });
    });

    // 侧边栏项目交互效果
    const sidebarItems = document.querySelectorAll('.tm-sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.borderLeftColor = 'rgb(46, 140, 205)';
            this.style.boxShadow = '0 5px 15px rgba(46, 140, 205, 0.1)';
            
            const heading = this.querySelector('h4');
            heading.style.color = 'rgb(32, 110, 170)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderLeftColor = 'transparent';
            this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
            
            const heading = this.querySelector('h4');
            heading.style.color = 'rgb(46, 140, 205)';
        });
    });

    // 按钮点击涟漪效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪元素
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // 计算涟漪位置
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // 300ms后移除涟漪元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // "了解更多"链接效果
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingRight = '25px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingRight = '0';
        });
    });

    // 合作伙伴图标悬停效果
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.filter = 'grayscale(0)';
            this.style.opacity = '1';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
            this.style.filter = 'grayscale(100%)';
            this.style.opacity = '0.7';
        });
    });

    // 页面滚动动画
    const scrollElements = document.querySelectorAll('.card, .meeting-card, .tm-main, .tm-sidebar-item, .interview-container, .member-card');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                hideScrollElement(el)
            }
        });
    };
    
    // 添加滚动动画CSS
    const style = document.createElement('style');
    style.textContent = `
        .card, .meeting-card, .tm-main, .tm-sidebar-item, .interview-container, .member-card {
            transition: all 0.6s ease-in-out;
            opacity: 0;
            transform: translateY(30px);
        }
        
        .card.scrolled, .meeting-card.scrolled, .tm-main.scrolled, .tm-sidebar-item.scrolled, .interview-container.scrolled, .member-card.scrolled {
            opacity: 1;
            transform: translateY(0);
        }
        
        .dropdown-arrow {
            margin-left: 5px;
            font-size: 0.8em;
            transition: transform 0.3s ease;
        }
        
        .nav-item:hover .dropdown-arrow {
            transform: rotate(180deg);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background-color: rgba(255, 255, 255, 0.7);
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
    
    // 初始动画
    handleScrollAnimation();

    // 横幅图片3D效果
    const bannerPhoto = document.querySelector('.banner-photo');
    const bannerSection = document.querySelector('.banner');
    
    if (bannerPhoto && bannerSection) {
        bannerSection.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = bannerSection.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            bannerPhoto.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.05)`;
        });
        
        bannerSection.addEventListener('mouseleave', function() {
            bannerPhoto.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
    }

    // 加载页面图片时渐变显示
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // 如果图片已经缓存，设置为不透明
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Interview Slider
    const sliderContainer = document.querySelector('.interview-slider');
    if (!sliderContainer) return;
    
    const slides = sliderContainer.querySelectorAll('.interview-slide');
    const dots = document.querySelectorAll('.interview-dot');
    const prevBtn = document.querySelector('.interview-prev');
    const nextBtn = document.querySelector('.interview-next');
    let currentIndex = 0;
    let interval;
    
    // 初始化轮播
    function initSlider() {
        updateSlides();
        startAutoSlide();
        
        // 事件监听
        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(currentIndex + 1));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => changeSlide(index));
        });
        
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 更新轮播状态
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.style.visibility = 'hidden'; // 确保所有slide先隐藏
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
            
            if (index === currentIndex) {
                slide.classList.add('active');
                slide.style.visibility = 'visible'; // 当前slide可见
                slide.style.opacity = '1';
                slide.style.zIndex = '5';
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }
    
    // 切换轮播
    function changeSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // 淡出当前slide，淡入新slide
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                // 新的当前slide先设置为可见但透明
                slide.style.visibility = 'visible';
                // 使用setTimeout确保可见性设置先应用，然后再淡入
                setTimeout(() => {
                    slide.style.opacity = '1';
                    slide.style.zIndex = '5';
                    slide.classList.add('active');
                }, 50);
            } else if (slide.classList.contains('active')) {
                // 当前活动slide淡出
                slide.style.opacity = '0';
                slide.classList.remove('active');
                // 淡出后隐藏
                setTimeout(() => {
                    slide.style.visibility = 'hidden';
                    slide.style.zIndex = '1';
                }, 800); // 与CSS过渡时间相匹配
            }
        });
        
        // 更新导航点
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // 自动轮播
    function startAutoSlide() {
        stopAutoSlide();
        interval = setInterval(() => {
            changeSlide(currentIndex + 1);
        }, 4000);
    }
    
    // 停止自动轮播
    function stopAutoSlide() {
        if (interval) {
            clearInterval(interval);
        }
    }
    
    // 初始化轮播
    initSlider();

    // 专家轮播
    const carousel = document.querySelector('.members-carousel');
    if (carousel) {
        const items = Array.from(document.querySelectorAll('.carousel-item'));
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;
        const totalItems = items.length;
        let isAnimating = false;
        let carouselInterval;

        // 设置初始状态
        function initCarousel() {
            // 设置所有项目的初始位置和样式
            items.forEach((item, index) => {
                if (index === 0) {
                    item.classList.add('active');
                } else if (index === 1) {
                    item.classList.add('next');
                } else if (index === totalItems - 1) {
                    item.classList.add('prev');
                } else if (index === 2) {
                    item.classList.add('next2');
                } else if (index === totalItems - 2) {
                    item.classList.add('prev2');
                } else if (index === totalItems - 3) {
                    item.classList.add('prev3');
                }
            });
        }

        // 更新轮播
        function nextSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            // 前进一个位置
            currentIndex = (currentIndex + 1) % totalItems;
            
            // 更新所有项目的类名
            items.forEach((item, index) => {
                // 移除旧类名
                item.classList.remove('active', 'next', 'prev', 'next2', 'prev2', 'prev3');
                
                // 根据新的相对位置添加类名
                const position = (index - currentIndex + totalItems) % totalItems;
                
                if (position === 0) {
                    item.classList.add('active');
                } else if (position === 1) {
                    item.classList.add('next');
                } else if (position === totalItems - 1) {
                    item.classList.add('prev');
                } else if (position === 2) {
                    item.classList.add('next2');
                } else if (position === totalItems - 2) {
                    item.classList.add('prev2');
                } else if (position === totalItems - 3) {
                    item.classList.add('prev3');
                }
            });
            
            // 动画完成后恢复状态
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        function prevSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            // 后退一个位置
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            
            // 更新所有项目的类名
            items.forEach((item, index) => {
                // 移除旧类名
                item.classList.remove('active', 'next', 'prev', 'next2', 'prev2', 'prev3');
                
                // 根据新的相对位置添加类名
                const position = (index - currentIndex + totalItems) % totalItems;
                
                if (position === 0) {
                    item.classList.add('active');
                } else if (position === 1) {
                    item.classList.add('next');
                } else if (position === totalItems - 1) {
                    item.classList.add('prev');
                } else if (position === 2) {
                    item.classList.add('next2');
                } else if (position === totalItems - 2) {
                    item.classList.add('prev2');
                } else if (position === totalItems - 3) {
                    item.classList.add('prev3');
                }
            });
            
            // 动画完成后恢复状态
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        // 初始化轮播
        initCarousel();

        // 添加按钮事件监听器
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        // 添加触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        });

        // 自动轮播
        function startCarousel() {
            carouselInterval = setInterval(nextSlide, 3000);
        }

        function stopCarousel() {
            clearInterval(carouselInterval);
        }

        startCarousel();

        // 鼠标悬停时暂停自动轮播
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }
}); 