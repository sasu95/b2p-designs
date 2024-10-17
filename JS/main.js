// -------------------------------------------------------------------------------------
// التأكد من تحميل الـ DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {

    // التعامل مع إرسال النموذج
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // منع إعادة تحميل الصفحة

            // جمع بيانات النموذج
            const formData = new FormData(this);

            // إرسال البيانات عبر AJAX إلى Formspree
            fetch('https://formspree.io/f/xwpkereg', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                if (response.ok) {
                    statusMessage.innerHTML = "Your message was sent successfully";
                    contactForm.reset(); // إعادة تعيين النموذج
                } else {
                    response.json().then(function(data) {
                        if (Object.hasOwn(data, 'errors')) {
                            statusMessage.innerHTML = data["errors"].map(function(error) {
                                return error["message"];
                            }).join(", ");
                        } else {
                            statusMessage.innerHTML = "An error occurred during submission";
                        }
                    });
                }
            }).catch(function() {
                statusMessage.innerHTML = "An error occurred during submission. Please try again later";
            });
        });
    } 
});

// -------------------------------------------------------------------------------------
// إضافة تأثير السلاسة للنقر على الروابط التي تؤدي إلى أقسام أخرى في نفس الصفحة
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,  // تعديل المسافة من أعلى الصفحة
                behavior: 'smooth'
            });
        }
    });
});

// -------------------------------------------------------------------------------------
// التعامل مع عدادات الأرقام (counters)
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
    counter.innerText = '0';
    const target = +counter.getAttribute('data-target');
    const updateCounter = () => {
        const count = +counter.innerText;
        const increment = target / 200; // تعديل سرعة العد
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCounter, 10); // تعديل التأخير
        } else {
            counter.innerText = target;
        }
    };
    updateCounter();
};

// دالة إعادة تعيين العدادات
const resetCounters = () => {
    counters.forEach(counter => {
        counter.innerText = '0';
    });
};

// استخدام IntersectionObserver لتحريك العدادات عند التمرير
const observerOptions = {
    root: null, // هذا هو إطار العرض (viewport)
    threshold: 0.5 // يشتغل عند ظهور 50% من العنصر
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target); // بدء العد عند الظهور
        } else {
            resetCounters(); // إعادة العدادات عند الخروج من العرض
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// مراقبة كل عداد
counters.forEach(counter => {
    observer.observe(counter);
});

// -------------------------------------------------------------------------------------
// ------------------ Spinner ----------------------------------- >
window.onload = function() {
    let percentage = 0;
    const progressElement = document.getElementById('progress');
    const preloaderElement = document.getElementById('preloader');

    if (progressElement && preloaderElement) {
        // تحديث النسبة المئوية كل 50 ملي ثانية
        let interval = setInterval(function() {
            if (percentage < 100) {
                percentage++;
                progressElement.innerText = percentage + '%';
            } else {
                clearInterval(interval);
                // بعد الانتهاء من العد، إخفاء الـ preloader
                preloaderElement.style.display = 'none';
            }
        }, 25);
    } 
};
