/* =========================================================
   UYIRMANN — INTERACTIVE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const preloader = document.getElementById("preloader");
    const navbar = document.getElementById("navbar");
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const backTop = document.getElementById("backTop");



    /* =====================================================
       PRELOADER
    ===================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (preloader) {
                preloader.classList.add("hide");
            }

        }, 900);

    });



    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("open");

        });


        const mobileLinks =
            mobileMenu.querySelectorAll("a");


        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

            });

        });

    }



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function updateBackTop() {

        if (!backTop) return;

        if (window.scrollY > 700) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }

    window.addEventListener("scroll", updateBackTop);

    updateBackTop();


    if (backTop) {

        backTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }



    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll("main section[id]");

    const navLinks =
        document.querySelectorAll(".desktop-nav a");


    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                currentSection = section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const target =
                link.getAttribute("href");

            if (target === "#" + currentSection) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );



    /* =====================================================
       SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .crop-card, .story-card, .timeline-item, .stat-item, .district-explorer, .newsletter-box"
        );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(35px)";

        element.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

    });


    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });



    /* =====================================================
       ANIMATED STATISTICS
    ===================================================== */

    const counters =
        document.querySelectorAll("[data-count]");

    let countersStarted = false;


    function animateCounters() {

        if (countersStarted) return;

        countersStarted = true;


        counters.forEach(counter => {

            const target =
                Number(counter.dataset.count);

            let current = 0;

            const duration = 1400;

            const startTime =
                performance.now();


            function updateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;

                const progress =
                    Math.min(elapsed / duration, 1);


                const eased =
                    1 - Math.pow(1 - progress, 3);


                current =
                    Math.floor(target * eased);


                counter.textContent =
                    current;


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                } else {

                    counter.textContent =
                        target;

                }

            }


            requestAnimationFrame(
                updateCounter
            );

        });

    }


    const statistics =
        document.querySelector(".statistics");


    if (statistics) {

        const statisticsObserver =
            new IntersectionObserver(
                entries => {

                    if (entries[0].isIntersecting) {

                        animateCounters();

                    }

                },
                {
                    threshold: 0.3
                }
            );


        statisticsObserver.observe(
            statistics
        );

    }



    /* =====================================================
       DISTRICT EXPLORER
    ===================================================== */

    const districtButtons =
        document.querySelectorAll(".district");

    const districtTitle =
        document.querySelector(".district-info h3");

    const districtDescription =
        document.querySelector(".district-info p");

    const districtBackground =
        document.querySelector(".district-preview-bg");


    const districtData = {

        "Thanjavur": {
            description:
                "Known for its fertile agricultural landscapes and strong connection with paddy cultivation.",
            image:
                "https://images.unsplash.com/photo-1592982537447-6f7a5c4f4d9d?auto=format&fit=crop&w=1400&q=85"
        },

        "Thoothukudi": {
            description:
                "A coastal district with diverse agricultural activities shaped by its climate and water availability.",
            image:
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=85"
        },

        "Madurai": {
            description:
                "An important agricultural region where crops and farming communities are closely connected with the surrounding landscape.",
            image:
                "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=85"
        },

        "Coimbatore": {
            description:
                "A major agricultural region known for varied crops, irrigation and increasingly technology-driven farming.",
            image:
                "https://images.unsplash.com/photo-1536631006386-1e5e8b4c4d8f?auto=format&fit=crop&w=1400&q=85"
        },

        "Tirunelveli": {
            description:
                "A region with a long agricultural history influenced by rivers, rainfall and traditional water systems.",
            image:
                "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1400&q=85"
        },

        "Erode": {
            description:
                "An agricultural region with diverse crops and an important role in Tamil Nadu's farming economy.",
            image:
                "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1400&q=85"
        }

    };


    districtButtons.forEach(button => {

        button.addEventListener("click", () => {

            districtButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            const name =
                button.textContent
                    .replace(/[0-9→]/g, "")
                    .trim();


            const data =
                districtData[name];


            if (!data) return;


            if (districtTitle) {

                districtTitle.style.opacity = "0";

                setTimeout(() => {

                    districtTitle.textContent =
                        name;

                    districtTitle.style.opacity =
                        "1";

                }, 150);

            }


            if (districtDescription) {

                districtDescription.style.opacity =
                    "0";

                setTimeout(() => {

                    districtDescription.textContent =
                        data.description;

                    districtDescription.style.opacity =
                        "1";

                }, 150);

            }


            if (districtBackground) {

                districtBackground.style.opacity =
                    "0";

                setTimeout(() => {

                    districtBackground.style.backgroundImage =
                        `linear-gradient(
                            0deg,
                            rgba(3,12,7,0.95),
                            rgba(3,12,7,0.1)
                        ),
                        url("${data.image}")`;

                    districtBackground.style.opacity =
                        "1";

                }, 200);

            }

        });

    });



    /* =====================================================
       CROP CARD TILT EFFECT
    ===================================================== */

    const cropCards =
        document.querySelectorAll(".crop-card");


    cropCards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (window.innerWidth < 700)
                    return;


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;


                const y =
                    event.clientY - rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) /
                        centerY) * -2;


                const rotateY =
                    ((x - centerX) /
                        centerX) * 2;


                card.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "perspective(800px) rotateX(0) rotateY(0)";

            }
        );

    });



    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const heroImage =
        document.querySelector(".hero-image");


    window.addEventListener(
        "scroll",
        () => {

            if (!heroImage) return;

            if (window.scrollY <
                window.innerHeight) {

                heroImage.style.transform =
                    `translateY(${window.scrollY * 0.18}px) scale(1.02)`;

            }

        }
    );



    /* =====================================================
       MOUSE GLOW
    ===================================================== */

    const hero =
        document.querySelector(".hero");


    if (hero && window.innerWidth > 800) {

        const mouseGlow =
            document.createElement("div");


        mouseGlow.style.position =
            "absolute";

        mouseGlow.style.width =
            "300px";

        mouseGlow.style.height =
            "300px";

        mouseGlow.style.borderRadius =
            "50%";

        mouseGlow.style.pointerEvents =
            "none";

        mouseGlow.style.background =
            "radial-gradient(circle, rgba(158,234,99,0.10), transparent 65%)";

        mouseGlow.style.transform =
            "translate(-50%, -50%)";

        mouseGlow.style.zIndex =
            "1";

        hero.appendChild(mouseGlow);


        hero.addEventListener(
            "mousemove",
            event => {

                const rect =
                    hero.getBoundingClientRect();


                mouseGlow.style.left =
                    `${event.clientX - rect.left}px`;

                mouseGlow.style.top =
                    `${event.clientY - rect.top}px`;

            }
        );

    }



    /* =====================================================
       NEWSLETTER
    ===================================================== */

    const newsletterForm =
        document.querySelector(".newsletter-form");


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const input =
                    newsletterForm.querySelector("input");


                const button =
                    newsletterForm.querySelector("button");


                if (!input.value.trim())
                    return;


                const originalText =
                    button.textContent;


                button.textContent =
                    "Joined ✓";


                button.style.color =
                    "#c6ff8a";


                input.value = "";


                setTimeout(() => {

                    button.textContent =
                        originalText;

                    button.style.color =
                        "";

                }, 3000);

            }
        );

    }



    /* =====================================================
       LANGUAGE BUTTON
    ===================================================== */

    const languageButton =
        document.querySelector(".language-btn");


    if (languageButton) {

        languageButton.addEventListener(
            "click",
            () => {

                const current =
                    languageButton
                        .childNodes[0]
                        .textContent
                        .trim();


                if (current === "EN") {

                    languageButton.childNodes[0]
                        .textContent = "தமிழ் ";

                } else {

                    languageButton.childNodes[0]
                        .textContent = "EN ";

                }

            }
        );

    }



    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });



    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        "open"
                    );

                }

            }

        }
    );


    /* =====================================================
       CONSOLE BRANDING
    ===================================================== */

    console.log(
        "%c🌱 UYIRMANN",
        "font-size:25px;font-weight:bold;color:#9eea63;"
    );

    console.log(
        "%cFrom Tamil Soil to the World.",
        "font-size:14px;color:#a5b0a6;"
    );

});
