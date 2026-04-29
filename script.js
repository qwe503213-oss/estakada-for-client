// ===================================
// ООО "ЭСТАКАДА" - Основной скрипт (ФИНАЛЬНАЯ ВЕРСИЯ)
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // =====================================================
    // === ДАННЫЕ (встроены, без загрузки из JSON) ===
    // =====================================================
    
    // Данные команды
    const teamData = [
        { 
            name: "Иванов Иван Иванович", 
            position: "Руководитель проектов", 
            photo: "images/team/photo1.jpg", 
            active: true 
        },
        { 
            name: "Петров Петр Петрович", 
            position: "Ведущий сантехник", 
            photo: "images/team/photo2.jpg", 
            active: true 
        },
        { 
            name: "Сидоров Сидор Сидорович", 
            position: "Мастер по отоплению", 
            photo: "images/team/photo3.jpg", 
            active: true 
        },
        { 
            name: "Орлов Сергей Сергеевич ", 
            position: "Электрик", 
            photo: "images/team/photo4.jpg", 
            active: true 
        }
    ];

    // Данные галереи (работ)
    const galleryData = [
        { 
            title: "Монтаж системы отопления в частном доме", 
            img: "images/gallery/work1-before.jpg", 
            desc: "Кимовск, 150 м², монтаж радиаторов + котел", 
            active: true 
        },
        { 
            title: "Замена труб водоснабжения в квартире", 
            img: "images/gallery/work2-before.jpg", 
            desc: "Новомосковск, 3-комнатная, полипропилен", 
            active: true 
        },
        { 
            title: "Установка душевой кабины с гидромассажем", 
            img: "images/gallery/work3-before.jpg", 
            desc: "Тула, ванная комната, под ключ", 
            active: true 
        },
        { 
            title: "Монтаж канализации 110 мм", 
            img: "images/gallery/work4-before.jpg", 
            desc: "Кимовск, частный дом, ПВХ трубы", 
            active: true 
        },
        { 
            title: "Установка инсталляции для подвесного унитаза", 
            img: "images/gallery/work5-before.jpg", 
            desc: "Новомосковск, санузел, монтаж + подключение", 
            active: true 
        },
        { 
            title: "Обвязка котельной в частном доме", 
            img: "images/gallery/work6-before.jpg", 
            desc: "Тульская область, котельная под ключ", 
            active: true 
        }
    ];

    // =====================================================
    // === 1. БУРГЕР-МЕНЮ ===
    // =====================================================
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        nav.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // =====================================================
    // === 2. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ===
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var header = document.querySelector('.header');
                var headerOffset = header ? header.offsetHeight : 0;
                var elementPosition = targetElement.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // =====================================================
    // === 3. ТАБЫ В РАЗДЕЛЕ ЦЕН ===
    // =====================================================
    var tabs = document.querySelectorAll('.prices__tab');
    var tabContents = document.querySelectorAll('.prices__tab-content');

    if (tabs.length) {
        function activateTab(tabId) {
            tabs.forEach(function(tab) {
                tab.classList.remove('prices__tab--active');
                tab.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(function(content) {
                content.classList.remove('prices__tab-content--active');
            });
            var activeTab = document.querySelector('.prices__tab[data-tab="' + tabId + '"]');
            if (activeTab) {
                activeTab.classList.add('prices__tab--active');
                activeTab.setAttribute('aria-selected', 'true');
                var activeContent = document.querySelector('.prices__tab-content[data-content="' + tabId + '"]');
                if (activeContent) activeContent.classList.add('prices__tab-content--active');
            }
        }

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var tabId = this.getAttribute('data-tab');
                if (tabId) activateTab(tabId);
            });
        });

        // Активируем первую вкладку по умолчанию
        var defaultTabEl = document.querySelector('.prices__tab--active');
        if (defaultTabEl) {
            var defaultTab = defaultTabEl.getAttribute('data-tab');
            if (defaultTab) activateTab(defaultTab);
        }
    }

    // =====================================================
    // === 4. ОТРИСОВКА КОМАНДЫ (данные внутри) ===
    // =====================================================
    var teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = '';
        teamData.forEach(function(member) {
            if (!member.active) return;
            var card = document.createElement('div');
            card.className = 'team__card';
            card.innerHTML = 
                '<img src="' + escapeHtml(member.photo) + '" alt="' + escapeHtml(member.name) + '" class="team__photo" loading="lazy">' +
                '<div class="team__info">' +
                    '<h3 class="team__name">' + escapeHtml(member.name) + '</h3>' +
                    '<p class="team__position">' + escapeHtml(member.position) + '</p>' +
                '</div>';
            teamGrid.appendChild(card);
        });
    }

    // =====================================================
    // === 5. ОТРИСОВКА ГАЛЕРЕИ (данные внутри) ===
    // =====================================================
    var galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        galleryData.forEach(function(item) {
            if (!item.active) return;
            var card = document.createElement('div');
            card.className = 'gallery__item';
            card.innerHTML = 
                '<img src="' + escapeHtml(item.img) + '" alt="' + escapeHtml(item.title) + '" class="gallery__img" loading="lazy">' +
                '<div class="gallery__info">' +
                    '<h3 class="gallery__title">' + escapeHtml(item.title) + '</h3>' +
                    '<p class="gallery__description">' + escapeHtml(item.desc) + '</p>' +
                '</div>';
            galleryGrid.appendChild(card);
        });
    }

    // =====================================================
    // === 6. ОТПРАВКА ФОРМ (AJAX на send.php) ===
    // =====================================================
    function showNotification(message, isError) {
        if (isError === void 0) isError = false;
        var notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.className = 'notification' + (isError ? ' notification--error' : '');
        notification.style.display = 'block';
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }

    function sendForm(form, url) {
        if (url === void 0) url = 'send.php';
        var formData = new FormData(form);
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                showNotification(data.message || 'Заявка отправлена! Мы свяжемся с вами.');
                form.reset();
                var checkbox = form.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            } else {
                showNotification(data.message || 'Ошибка отправки. Попробуйте позвонить.', true);
            }
        })
        .catch(function(error) {
            console.error('Ошибка отправки:', error);
            showNotification('Не удалось отправить заявку. Пожалуйста, позвоните нам.', true);
        });
    }

    var consultForm = document.querySelector('#order');
    if (consultForm) {
        consultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendForm(this);
        });
    }

    var b2bForm = document.getElementById('b2b-form');
    if (b2bForm) {
        b2bForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendForm(this);
        });
    }

    // =====================================================
    // === 7. КНОПКИ "ЗАКАЗАТЬ" (прокрутка к форме) ===
    // =====================================================
    var orderButtons = document.querySelectorAll('.service-card__btn, .btn--primary[href="#order"], .segmentation__card .btn');
    orderButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#order') {
                e.preventDefault();
                var form = document.querySelector('#order');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    var nameInput = form.querySelector('input[name="name"]');
                    if (nameInput) nameInput.focus();
                }
            }
        });
    });

    // =====================================================
    // === 8. БЛОК ОТЗЫВОВ: ОБРАБОТКА ФОРМЫ ===
    // =====================================================
    var reviewForm = document.getElementById('review-form');
    var reviewsGrid = document.getElementById('reviews-grid');
    
    if (reviewForm && reviewsGrid) {
        // Загрузка сохранённых отзывов из localStorage
        var savedReviews = JSON.parse(localStorage.getItem('estakada-reviews') || '[]');
        savedReviews.forEach(function(r) {
            addReviewCard(r, true);
        });

        // Обработка отправки формы
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var name = document.querySelector('[name="review-name"]').value.trim();
            var location = document.querySelector('[name="review-location"]').value.trim() || 'г. Тульская область';
            var service = document.querySelector('[name="review-service"]').value;
            var ratingEl = document.querySelector('[name="review-rating"]:checked');
            var rating = ratingEl ? ratingEl.value : '5';
            var text = document.querySelector('[name="review-text"]').value.trim();
            
            if (!name || !text || !service) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            var newReview = {
                id: Date.now(),
                name: name,
                location: location,
                service: service,
                rating: parseInt(rating),
                text: text,
                date: new Date().toISOString(),
                initials: name.split(' ').map(function(p) { return p[0]; }).join('').toUpperCase().slice(0, 2)
            };
            
            // Сохранение в localStorage (не более 50 отзывов)
            var reviews = JSON.parse(localStorage.getItem('estakada-reviews') || '[]');
            reviews.unshift(newReview);
            localStorage.setItem('estakada-reviews', JSON.stringify(reviews.slice(0, 50)));
            
            // Добавление карточки в начало сетки
            addReviewCard(newReview);
            
            // Очистка формы и уведомление
            reviewForm.reset();
            alert('Спасибо за ваш отзыв! Он появится на сайте после модерации.');
        });
        
        // Функция добавления карточки отзыва
        function addReviewCard(review, isSaved) {
            if (isSaved === void 0) isSaved = false;
            var card = document.createElement('article');
            card.className = 'review-card';
            if (!isSaved) card.style.animation = 'fadeIn 0.3s ease';
            
            var dateObj = new Date(review.date);
            var formattedDate = dateObj.toLocaleDateString('ru-RU', { 
                day: 'numeric', month: 'long', year: 'numeric' 
            });
            var stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            card.innerHTML = 
                '<div class="review-card__header">' +
                    '<div class="review-card__avatar">' + escapeHtml(review.initials) + '</div>' +
                    '<div class="review-card__meta">' +
                        '<h4 class="review-card__name">' + escapeHtml(review.name) + '</h4>' +
                        '<p class="review-card__location">' + escapeHtml(review.location) + '</p>' +
                        '<time class="review-card__date" datetime="' + escapeHtml(review.date) + '">' + formattedDate + '</time>' +
                    '</div>' +
                '</div>' +
                '<div class="review-card__rating" aria-label="Рейтинг ' + review.rating + ' из 5">' +
                    stars.split('').map(function(s) { return '<span class="star">' + escapeHtml(s) + '</span>'; }).join('') +
                '</div>' +
                '<div class="review-card__content">' +
                    '<p class="review-card__text">' + escapeHtml(review.text) + '</p>' +
                '</div>' +
                '<div class="review-card__footer">' +
                    '<span class="review-card__service">Услуга: ' + escapeHtml(review.service) + '</span>' +
                '</div>';
            
            if (!isSaved) {
                reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
            } else {
                reviewsGrid.appendChild(card);
            }
        }
    }

    // =====================================================
    // === 9. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ЗАЩИТА ОТ XSS ===
    // =====================================================
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // =====================================================
    // === 10. ЭФФЕКТ ТЕНИ ПРИ СКРОЛЛЕ ===
    // =====================================================
    window.addEventListener('scroll', function() {
        var header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    });

    // =====================================================
    // === 11. МАСКА ДЛЯ ТЕЛЕФОНА ===
    // =====================================================
    document.querySelectorAll('input[type="tel"]').forEach(function(input) {
        input.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') value = value.substring(1);
                var formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length >= 3) formatted += ')';
                if (value.length > 3) formatted += ' ' + value.substring(3, 6);
                if (value.length > 6) formatted += '-' + value.substring(6, 8);
                if (value.length > 8) formatted += '-' + value.substring(8, 10);
                e.target.value = formatted;
            }
        });
    });

    // =====================================================
    // === 12. АНИМАЦИЯ ПОЯВЛЕНИЯ ДЛЯ ОТЗЫВОВ ===
    // =====================================================
    if (!document.querySelector('style#reviews-animation')) {
        var style = document.createElement('style');
        style.id = 'reviews-animation';
        style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
        document.head.appendChild(style);
    }

}); // ← КОНЕЦ ВСЕГО СКРИПТА (DOMContentLoaded)