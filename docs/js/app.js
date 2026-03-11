"use strict";

//  Fancybox
if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeExisting: true
    });
}



document.addEventListener("DOMContentLoaded", function () {


    document.addEventListener('click', function (e) {
        const target = e.target;
        const header = document.querySelector('.header');

        // menu
        if (target.closest('[data-menu-toggler]')) {
            header.classList.toggle('open-menu');
        }

        if (target.closest('.menu__link')) {
            header.classList.remove('open-menu');
        }

        // faq
        if (target.matches('.faq__item-btn')) {
            const content = target.nextElementSibling;
            if (content.classList.contains('_sliding')) return;

            target.classList.toggle('active');
            content.slideToggle()
        }


    })

    // sliders

    if (document.querySelector('.history__slider')) {

        new Swiper('.history__slider', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            autoHeight: true,
            navigation: {
                nextEl: '.history__next',
            },
        });
    }

    if (document.querySelector('.programm__content')) {
        const daysSwiper = new Swiper('.programm__navigation .swiper', {
            direction: 'vertical',
            slidesPerView: "auto",
            spaceBetween: 12,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
            mousewheel: true,
            centeredSlides: true,
            breakpoints: {
                991.98: {
                    spaceBetween: 24,
                }
            }
        });

        const detailsSwiper = new Swiper('.programm__details', {
            direction: 'horizontal',
            spaceBetween: 20,

            grabCursor: true,
            mousewheel: true,

            effect: 'slide',
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: [0, "-120%", -500],
                },
                next: {
                    shadow: true,
                    translate: [0, "120%", -500],
                },
            },
            scrollbar: {
                el: '.programm__details-scrollbar',
                draggable: true,
            },
            breakpoints: {
                768: {
                    direction: 'vertical',
                    effect: 'creative',
                }
            }
        });

        daysSwiper.on('slideChange', () => {
            detailsSwiper.slideTo(daysSwiper.activeIndex);
        });

        detailsSwiper.on('slideChange', () => {
            daysSwiper.slideTo(detailsSwiper.activeIndex);
        });
    }

    if (document.querySelector('.about__cards')) {
        new MobileSwiper('.about__cards', {
            slidesPerView: "auto",
            spaceBetween: 16,
            scrollbar: {
                el: '.about__cards-scrollbar',
                draggable: true,
            },
        })


    }

    if (document.querySelector('.reviews__slider')) {

        new Swiper('.reviews__slider', {
            slidesPerView: "auto",
            spaceBetween: 16,
            navigation: {
                nextEl: '.reviews__next',
                prevEl: '.reviews__prev',
            },
            breakpoints: {
                767.98: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1199.98: {
                    spaceBetween: 24,
                    slidesPerView: 3,
                }
            }
        });
    }


    initPhoneMask();
    initFloatingLabels();
    initFormValidation();

    // animation

    gsap.registerPlugin(ScrollTrigger)

});

function initFloatingLabels() {
    const floatingInputs = document.querySelectorAll('.form__field > .form__input, .form__field > .form__textarea');
    const events = ['input', 'blur', 'focus', 'change', 'keyup', 'mouseup'];

    const checkEmpty = (input) => {
        input.classList.toggle('_input', input.value.length > 0);
    };

    floatingInputs.forEach(input => {
        checkEmpty(input);

        events.forEach(eventType => {
            input.addEventListener(eventType, () => checkEmpty(input));
        });
    });
}

function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    const getInputNumbersValue = (input) => input.value.replace(/\D/g, '');

    const onPhonePaste = (e) => {
        const input = e.target;
        const inputNumbersValue = getInputNumbersValue(input);
        const pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            const pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
            }
        }
    };

    const onPhoneInput = (e) => {
        const input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        const selectionStart = input.selectionStart;
        let formattedInputValue = "";

        if (!inputNumbersValue) {
            input.value = "";
            return;
        }

        if (input.value.length !== selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
            const firstSymbols = (inputNumbersValue[0] === "8") ? "8" : "+7";
            formattedInputValue = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    };

    const onPhoneKeyDown = (e) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode === 8 && inputValue.length === 1) {
            e.target.value = "";
        }
    };

    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    });
}

function initFormValidation() {
    const forms = document.querySelectorAll('.journey__form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form__control');
        const submitBtn = form.querySelector('.form__submit');

        const validateInput = (input) => {
            const value = input.value.trim();
            let isValid = true;

            if (input.type === 'email') {
                const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailReg.test(value);
            } else if (input.type === 'tel') {
                isValid = value.length >= 18;
            } else {
                isValid = value.length > 1;
            }

            if (!isValid && value !== "") {
                input.classList.add('_error');
            } else {
                input.classList.remove('_error');
            }

            return isValid;
        };

        const checkFormState = () => {
            let isFormValid = true;
            inputs.forEach(input => {
                const value = input.value.trim();
                if (value === "" || input.classList.contains('_error')) {
                    isFormValid = false;
                }
            });
            submitBtn.disabled = !isFormValid;
        };

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
                checkFormState();
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('_error')) {
                    validateInput(input);
                }
                checkFormState();
            });
        });

        form.addEventListener('submit', (e) => {
            if (submitBtn.disabled) {
                e.preventDefault();
            }
        });
    });
}

class MobileSwiper {
    constructor(sliderName, options, condition = 767.98) {
        this.$slider = document.querySelector(sliderName);
        this.options = options;
        this.init = false;
        this.swiper = null;
        this.condition = condition;

        if (this.$slider) {
            this.handleResize();
            window.addEventListener("resize", () => this.handleResize());
        }
    }

    handleResize() {
        if (window.innerWidth <= this.condition) {
            if (!this.init) {
                this.init = true;
                this.swiper = new Swiper(this.$slider, this.options);
            }
        } else if (this.init) {
            if (this.swiper) {
                this.swiper.destroy(true, true);
                this.swiper = null;
            }
            this.init = false;
        }
    }
}

HTMLElement.prototype.slideToggle = function (duration = 400) {
    if (window.getComputedStyle(this).display === 'none') {
        return this.slideDown(duration);
    } else {
        return this.slideUp(duration);
    }
};

HTMLElement.prototype.slideUp = function (duration = 400) {
    this.classList.add('_sliding');
    this.style.transitionProperty = 'height, margin, padding';
    this.style.transitionDuration = duration + 'ms';
    this.style.boxSizing = 'border-box';
    this.style.height = this.offsetHeight + 'px';
    this.offsetHeight;
    this.style.overflow = 'hidden';
    this.style.height = '0';
    this.style.paddingTop = '0';
    this.style.paddingBottom = '0';
    this.style.marginTop = '0';
    this.style.marginBottom = '0';

    window.setTimeout(() => {
        this.style.display = 'none';
        this.style.removeProperty('height');
        this.style.removeProperty('padding-top');
        this.style.removeProperty('padding-bottom');
        this.style.removeProperty('margin-top');
        this.style.removeProperty('margin-bottom');
        this.style.removeProperty('overflow');
        this.style.removeProperty('transition-duration');
        this.style.removeProperty('transition-property');
        this.classList.remove('_sliding');
    }, duration);
};

HTMLElement.prototype.slideDown = function (duration = 400) {
    this.classList.add('_sliding');
    this.style.removeProperty('display');
    let display = window.getComputedStyle(this).display;
    if (display === 'none') display = 'block';
    this.style.display = display;

    let height = this.offsetHeight;
    this.style.overflow = 'hidden';
    this.style.height = '0';
    this.style.paddingTop = '0';
    this.style.paddingBottom = '0';
    this.style.marginTop = '0';
    this.style.marginBottom = '0';
    this.offsetHeight;

    this.style.transitionProperty = "height, margin, padding";
    this.style.transitionDuration = duration + 'ms';
    this.style.height = height + 'px';
    this.style.removeProperty('padding-top');
    this.style.removeProperty('padding-bottom');
    this.style.removeProperty('margin-top');
    this.style.removeProperty('margin-bottom');

    window.setTimeout(() => {
        this.style.removeProperty('height');
        this.style.removeProperty('overflow');
        this.style.removeProperty('transition-duration');
        this.style.removeProperty('transition-property');
        this.classList.remove('_sliding');
    }, duration);
};