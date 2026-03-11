"use strict";

// const { default: Swiper } = require("swiper");

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
        const toggler = document.querySelector('.header__toggler');
        const menu = document.querySelector('.menu');

        if (target.matches('.faq__item-question')) {
            target.classList.toggle('active');
            target.nextElementSibling.slideToggle()
        }

        if (target.matches('.services__tabs-btn')) {
            const btns = Array.from(document.querySelectorAll('.services__tabs-btn'));
            const blocks = document.querySelectorAll('.services__block');
            const index = btns.indexOf(target);

            btns.forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');

            blocks.forEach(block => block.classList.remove('active'));
            if (blocks[index]) {
                blocks[index].classList.add('active');
            }
        }

        if (target.matches('.footer__arrow-top')) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }

        if (target.closest('.header__toggler')) {
            toggler.classList.toggle('active');
            header.classList.toggle('open-menu');
            document.body.classList.toggle('open-mobile-menu');
        } else if (
            header.classList.contains('open-menu') &&
            !target.closest('.menu')
        ) {
            toggler.classList.remove('active');
            header.classList.remove('open-menu');
            document.body.classList.remove('open-mobile-menu');
        }
    })

    if (document.querySelector('.history__slider')) {

        new Swiper('.history__slider', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            navigation: {
                nextEl: '.history__next',
            },
        });
    }

    if (document.querySelector('.reviews__slider')) {

        const reviews__slider = new Swiper('.reviews__slider', {
            slidesPerView: "auto",
            spaceBetween: 16,
            navigation: {
                nextEl: '.reviews__next',
                prevEl: '.reviews__prev',
            },
            breakpoints: {
                991.98: {
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

    if (document.querySelector('.programm__content')) {
        const daysSwiper = new Swiper('.programm__navigation .swiper', {
            direction: 'vertical',
            slidesPerView: 4,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
            mousewheel: true,
            centeredSlides: true,
        });

        const detailsSwiper = new Swiper('.programm__details', {
            direction: 'vertical',
            spaceBetween: 20,
            mousewheel: true,
            grabCursor: true,
            effect: 'creative',
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

        });

        daysSwiper.on('slideChange', () => {
            detailsSwiper.slideTo(daysSwiper.activeIndex);
        });

        detailsSwiper.on('slideChange', () => {
            daysSwiper.slideTo(detailsSwiper.activeIndex);
        });
    }

    initPhoneMask();
    initFloatingLabels();

    // animation

    gsap.registerPlugin(ScrollTrigger)

});

function initFloatingLabels() {
    const floatingInputs = document.querySelectorAll('.form__control');

    const checkEmpty = (input) => {
        if (input.value && input.value.trim() !== "") {
            input.classList.add('_input');
        } else {
            input.classList.remove('_input');
        }
    };

    floatingInputs.forEach(input => {
        checkEmpty(input);

        input.addEventListener('input', () => checkEmpty(input));
        input.addEventListener('change', () => checkEmpty(input));
    });

    setTimeout(() => {
        floatingInputs.forEach(checkEmpty);
    }, 100);
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


HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {
    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    const elStyles = window.getComputedStyle(el);

    const elHeight = parseFloat(elStyles.getPropertyValue('height'));
    const elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    const elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    const elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    const elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    const stepHeight = elHeight / duration;
    const stepPaddingTop = elPaddingTop / duration;
    const stepPaddingBottom = elPaddingBottom / duration;
    const stepMarginTop = elMarginTop / duration;
    const stepMarginBottom = elMarginBottom / duration;

    let start;

    function step(timestamp) {
        if (start === undefined) start = timestamp;

        const elapsed = timestamp - start;

        if (isDown) {
            el.style.height = `${stepHeight * elapsed}px`;
            el.style.paddingTop = `${stepPaddingTop * elapsed}px`;
            el.style.paddingBottom = `${stepPaddingBottom * elapsed}px`;
            el.style.marginTop = `${stepMarginTop * elapsed}px`;
            el.style.marginBottom = `${stepMarginBottom * elapsed}px`;
        } else {
            el.style.height = `${elHeight - stepHeight * elapsed}px`;
            el.style.paddingTop = `${elPaddingTop - stepPaddingTop * elapsed}px`;
            el.style.paddingBottom = `${elPaddingBottom - stepPaddingBottom * elapsed}px`;
            el.style.marginTop = `${elMarginTop - stepMarginTop * elapsed}px`;
            el.style.marginBottom = `${elMarginBottom - stepMarginBottom * elapsed}px`;
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === "function") callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}