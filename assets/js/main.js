document.addEventListener('DOMContentLoaded', () => {

    const darkModeBtn = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('svu_theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('svu_theme', isDark ? 'dark' : 'light');
            darkModeBtn.innerHTML = isDark
                ? '<i class="bi bi-sun-fill"></i>'
                : '<i class="bi bi-moon-stars-fill"></i>';
        });
    }

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    //events.html
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const eventItems = document.querySelectorAll('.event-item');
    const noResultsMsg = document.getElementById('noResultsMsg');

    function filterEvents() {
        if (eventItems.length === 0) return;

        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const catVal = categoryFilter ? categoryFilter.value : 'all';
        const locVal = locationFilter ? locationFilter.value : 'all';
        const dateVal = dateFilter ? dateFilter.value : '';

        if (categoryFilter) {
            localStorage.setItem('preferred_category', catVal);
        }

        let visibleCount = 0;

        eventItems.forEach(item => {
            const title = item.getAttribute('data-title').toLowerCase();
            const category = item.getAttribute('data-category');
            const location = item.getAttribute('data-location');
            const date = item.getAttribute('data-date');

            const matchSearch = title.includes(searchVal);
            const matchCat = (catVal === 'all' || category === catVal);
            const matchLoc = (locVal === 'all' || location === locVal);
            const matchDate = (dateVal === '' || date === dateVal);

            if (matchSearch && matchCat && matchLoc && matchDate) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (noResultsMsg) {
            noResultsMsg.classList.toggle('d-none', visibleCount > 0);
        }
    }

    if (categoryFilter) {
        const savedCat = localStorage.getItem('preferred_category');
        if (savedCat) {
            categoryFilter.value = savedCat;
            filterEvents();
        }
        categoryFilter.addEventListener('change', filterEvents);
    }

    if (searchInput) searchInput.addEventListener('input', filterEvents);
    if (locationFilter) locationFilter.addEventListener('change', filterEvents);
    if (dateFilter) dateFilter.addEventListener('change', filterEvents);

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (locationFilter) locationFilter.value = 'all';
            if (dateFilter) dateFilter.value = '';
            localStorage.removeItem('preferred_category');
            filterEvents();
        });
    }

    document.querySelectorAll('.quick-filter-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('preferred_category', badge.getAttribute('data-cat'));
            window.location.href = 'events.html';
        });
    });

    const contactForm = document.getElementById('contactForm');
    const alertContainer = document.getElementById('alertContainer');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                showAlert('danger', 'يرجى تعبئة كافة الحقول المطلوبة.');
                return;
            }
            if (!emailPattern.test(email)) {
                showAlert('danger', 'يرجى إدخال صيغة بريد إلكتروني صحيحة.');
                return;
            }
            if (message.length < 10) {
                showAlert('warning', 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل.');
                return;
            }

            showAlert('success', `شكراً لتواصلك معنا يا ${name}! تم إرسال رسالتك بنجاح.`);
            contactForm.reset();
        });
    }

    function showAlert(type, messageText) {
        if (!alertContainer) return;
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i> ${messageText}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    //event.html
    const addToCalBtn = document.getElementById('addToCalBtn');
    const shareEventBtn = document.getElementById('shareEventBtn');
    const bookingForm = document.getElementById('bookingForm');

    if (addToCalBtn) {
        addToCalBtn.addEventListener('click', () => {
            alert('📅 تمت إضافة الفعالية إلى تقويمك بنجاح!');
        });
    }

    if (shareEventBtn) {
        shareEventBtn.addEventListener('click', () => {
            navigator.clipboard?.writeText(window.location.href);
            alert('🔗 تم نسخ رابط الفعالية لمشاركته مع أصدقائك!');
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const attendeeName = document.getElementById('attendeeName').value;
            document.getElementById('bookingModalBody').innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-check-circle-fill text-success display-4 mb-3 d-block"></i>
                    <h5 class="fw-bold">تم تأكيد حجزك المبدئي!</h5>
                    <p class="text-muted mb-0">أهلاً بك يا <strong>${attendeeName}</strong>، تم تسجيل اسمك في قائمة الحضور.</p>
                </div>
            `;
        });
    }

    const eventsData = {
        "1": {
            title: "ملتقى الذكاء الاصطناعي وتطوير الويب",
            category: "تقنية وبرمجة",
            date: "20 أكتوبر 2026",
            time: "9:00 صباحاً - 02:00 ظهراً",
            location: "دمشق - المقر الرئيسي للجامعة الافتراضية",
            description: "<p>مؤتمر علمي يستعرض أحدث تطبيقات الذكاء الاصطناعي في بناء المواقع العصرية، بمشاركة نخبة من الأساتذة والمهندسين.</p>",
            images: ["assets/img/event1.jpeg", "assets/img/event1.1.jpeg"],     
            mapImage: "assets/img/map.damas.png" 
        },
        "2": {
            title: "المعرض السنوي للكتاب والمشاريع",
            category: "ثقافة وندوات",
            date: "25 أكتوبر 2026",
            time: "10:00 صباحاً - 04:00 عصراً",
            location: "حلب - مركز الجامعة الافتراضية",
            description: "<p>عرض لأبرز مشاريع التخرج المتميزة مع ندوات ثقافية وحوارية مفتوحة للطلاب، بحضور دور نشر محلية وعالمية.</p>",
            images: ["assets/img/event5.jpeg"],     
            mapImage: "assets/img/map.aleppo.png"
        },
        "3": {
            title: "بطولة الجامعة للشطرنج السريع",
            category: "رياضة وتحديات",
            date: "28 أكتوبر 2026",
            time: "11:00 صباحاً - 03:00 عصراً",
            location: "حمص - الصالة الرياضية",
            description: "<p>تحديات ذهنية بين طلاب مختلف البرامج الأكاديمية لتتويج بطل الجامعة لهذا الفصل وسط أجواء تنافسية ممتعة.</p>",
            images: ["assets/img/event3.jpeg"], 
            mapImage: "assets/img/map.homs.png"
        },
        "4": {
            title: "الأمسية الموسيقية لنادي الطلاب",
            category: "موسيقى وفنون",
            date: "1 نوفمبر 2026",
            time: "6:00 مساءً - 09:00 مساءً",
            location: "اللاذقية - المسرح المفتوح",
            description: "<p>حفل موسيقي شبابي يقدمه طلاب الجامعة الموهوبون بالعزف والغناء التراثي والمعاصر، في أجواء فنية رائعة.</p>",
            images: ["assets/img/event6.jpeg"], 
            mapImage: "assets/img/map.latak.png"
        },
        "5": {
            title: "معسكر البرمجة التنافسي (SVU CPC)",
            category: "تقنية وبرمجة",
            date: "5 نوفمبر 2026",
            time: "8:00 صباحاً - 05:00 مساءً",
            location: "أونلاين - منصة الجامعة الافتراضية",
            description: "<p>تدريب مكثف على الخوارزميات وحل المشكلات البرمجية تأهيلاً للمسابقات الإقليمية والدولية.</p>",
            images: ["assets/img/event7.jpeg"], 
            mapImage: "assets/img/map.png" 
        },
        "6": {
            title: "اليوم المفتوح للعائلات والخريجين",
            category: "أنشطة عائلية",
            date: "10 نوفمبر 2026",
            time: "10:00 صباحاً - 06:00 مساءً",
            location: "دمشق - حدائق الجامعة",
            description: "<p>نشاط اجتماعي ترفيهي يجمع الطلاب وعائلاتهم مع الخريجين لتبادل الخبرات وتكريم المتفوقين في جو أسري.</p>",
            images: ["assets/img/event8.jpeg"],   
            mapImage: "assets/img/map.damas2.png"
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (eventId && eventsData[eventId]) {
        const currentEvent = eventsData[eventId];

        if (document.getElementById('eventTitle')) {
            document.getElementById('eventTitle').textContent = currentEvent.title;
            document.getElementById('eventCategory').textContent = currentEvent.category;
            document.getElementById('eventDate').innerHTML = `<i class="bi bi-calendar-check text-primary me-1"></i> ${currentEvent.date}`;
            document.getElementById('eventTime').innerHTML = `<i class="bi bi-clock text-primary me-1"></i> ${currentEvent.time}`;
            document.getElementById('eventLocation').innerHTML = `<i class="bi bi-geo-alt-fill text-danger me-1"></i> ${currentEvent.location}`;
            document.getElementById('eventDescription').innerHTML = currentEvent.description;

            const galleryContainer = document.getElementById('eventGallery');
            if (galleryContainer && currentEvent.images) {
                if (currentEvent.images.length === 1) {
                    galleryContainer.innerHTML = `<img src="${currentEvent.images[0]}" alt="${currentEvent.title}" style="grid-column: 1 / -1;">`;
                } else {
                    galleryContainer.innerHTML = currentEvent.images
                        .map(imgSrc => `<img src="${imgSrc}" alt="${currentEvent.title}">`)
                        .join('');
                }
            }

            const mapImageElement = document.getElementById('eventMapImage');
            if (mapImageElement && currentEvent.mapImage) {
                mapImageElement.src = currentEvent.mapImage;
            }
              const mapLocationElement = document.getElementById('eventMapLocation');
            if (mapLocationElement) {
                mapLocationElement.textContent = currentEvent.location;
            }
        }
    }
});