gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

reinitializePage();

function setUpLoader() {
  //Telling the browser to load the animations.js file

  function init() {
    setUpAnimation();
  }

  window.addEventListener("load", init);

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      init();
    }
  });
}

function setUpHome() {
  const showLoader = !sessionStorage.getItem("kaiveraVisited");
  const lenis = new Lenis({
    duration: 2,
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    smoothTouch: true,
    touchMultiplier: 2,
    infinite: false,
  });

  // Scroll update loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  document.fonts.ready.then(() => {
    if (showLoader) {

      // Disabling scrolling in all platform
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
      document.addEventListener("wheel", preventScroll, { passive: false });
      lenis.stop();

      function preventScroll(e) {
        e.preventDefault();
      }
      sessionStorage.setItem("kaiveraVisited", "true");

      // Loading Animation


      document.querySelector(".loader").style.display ="block"


      let counterElement = document.querySelector(".loader .counter p");
      let currentValue = 0;


      function updateCounter() {
        if (currentValue < 100) {
          let increment = Math.floor(Math.random() * 10) + 1;
          currentValue = Math.min(currentValue + increment, 100);
          counterElement.textContent = currentValue;

          let delay = Math.floor(Math.random() * 200) + 25;
          setTimeout(updateCounter, delay);
        }
      }


      const loader_bg = document.querySelectorAll(".loader .loader_bg");
      const loading_text = document.querySelectorAll(".loader .text_content h1");
      const arr_text = [];


      loading_text.forEach((el) => {
        const split = new SplitText(el, {
          type: "chars"
        });
        arr_text.push(split);
      });

      arr_text.forEach((split) => {
        gsap.from(split.chars, {
          y: -100,
          duration: 1,
          stagger: 0.03,
          ease: "power4.out"
        })
        gsap.to(split.chars, {
          y: 100,
          duration: 1,
          stagger: 0.02,
          ease: "power4.in",
          delay: 2.5
        })
      });

      gsap.from(counterElement, {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power4.out"
      })
      gsap.to(counterElement, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power4.in",
        delay: 2.5
      })


      gsap.set(".loader .loader_bg_top , .loader .loader_bg_bottom ", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      });
      gsap.to(loader_bg, {
        scale: 0.4,
        duration: 1.5,
        ease: "power4.inOut",
        delay: 2
      });

      gsap.to(".loader .loader_bg_top", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.3,
        ease: "power4.inOut",
        delay: 2.5,
      })
      gsap.to(".loader .loader_bg_bottom", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.3,
        ease: "power4.inOut",
        delay: 2.8,
        //When the page loading complete
        onComplete: () => {


          function preventScroll(e) {
            e.preventDefault();
          }

          document.querySelector(".loader").style.display = "none";
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          document.body.removeEventListener("touchmove", preventScroll);
          document.removeEventListener("wheel", preventScroll);
          lenis.start();
          requestAnimationFrame(raf);
        }
      });

      gsap.to(".loader", {
        delay: 6,
        onComplete: () => {
          document.querySelector(".loader").style.display = "none";
        },
      });

      updateCounter();

      startMainAnimation(2.2);


    } else {
      document.querySelector(".loader").style.display = "none";
      lenis.start();
      requestAnimationFrame(raf);
      startMainAnimation(0);
    }

    function startMainAnimation(delay = 0) {

      requestAnimationFrame(raf);
      //Landing page animation

      const heroTexts = document.querySelectorAll(".landing-page h1");
      const heroSplit = [];

      const heroPara = document.querySelectorAll(".heroPara");
      const heroParaSplit = [];

      heroPara.forEach((el) => {
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "line-wrapper",
          autoSplit: true,
        });

        heroParaSplit.push(split);
      });

      heroParaSplit.forEach((split) => {
        gsap.from(split.lines, {
          y: 100,
          duration: 2,
          ease: "power4.out",
          stagger: 0.05,
          delay: delay + 1,
        });
      });

      heroTexts.forEach((el) => {
        const split = new SplitText(el, {
          type: "chars",
          autoSplit: true,
        });

        heroSplit.push(split);
      });
      heroSplit.forEach((split) => {
        gsap.from(split.chars, {
          y: 200,
          duration: 2,
          ease: "power4.out",
          stagger: 0.1,
          delay: delay + 0.5,
          onComplete: () => {
            document.body.style.overflowX = "hidden";
          },
        });
      });
      gsap.from(".landing-page .hero-img img", {
        scale: 1.3,
        duration: 3,
        ease: "power4.inOut",
        delay: delay,
      });
    }
  });

  // Scroll Trigger
  gsap.set(".horizontalText p", {
    x: -100,
  });
  gsap.to(".horizontalText p", {
    x: 200,
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontalText",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  //Testimonial Cards

  const track = document.getElementById("testimonial-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dots = document.querySelectorAll(".indicator-dot");
  const carousel = document.getElementById("carousel");

  let currentIndex = 0;
  let autoSlideInterval;

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  function getVisibleCards() {
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  }

  function updateCarousel() {
    const offset = -currentIndex * getCardWidth();
    track.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active-dot", index === currentIndex);
    });

    cards.forEach((card) => {
      card.classList.remove("animate-fade");
      void card.offsetWidth; // Reflow
      card.classList.add("animate-fade");
    });
  }

  function nextSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = totalCards - visibleCards;
    currentIndex = (currentIndex + 1) % (maxIndex + 1);
    updateCarousel();
  }

  function prevSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = totalCards - visibleCards;
    currentIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
    updateCarousel();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      resetAutoSlide();
    });
  });

  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });

  carousel.addEventListener("mouseleave", startAutoSlide);

  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateCarousel();
  });

  const totalCards = cards.length;

  // Initialize
  updateCarousel();
  startAutoSlide();
}

function setUpAbout() {
  let linesScrollAnimationSplit = [];
  const linesScrollAnimation = document.querySelectorAll(".scrollLine");

  linesScrollAnimationSplit.forEach((split) => split.revert());
  linesScrollAnimationSplit = [];

  linesScrollAnimation.forEach((el) => {
    el.innerHTML = el.textContent;

    const split = new SplitText(el, {
      type: "lines",
      linesClass: "line-wrapper",
    });

    split.lines.forEach((line) => {
      const inner = document.createElement("span");
      inner.classList.add("line");
      inner.innerHTML = line.innerHTML;
      line.innerHTML = "";
      line.appendChild(inner);
    });

    linesScrollAnimationSplit.push(split);
  });

  linesScrollAnimationSplit.forEach((split) => {
    split.lines.forEach((lineWrapper) => {
      const line = lineWrapper.querySelector(".line");

      gsap.set(line, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
        y: 100,
      });

      gsap.to(line, {
        scrollTrigger: {
          trigger: lineWrapper,
          start: "-100px 90%",
          end: "bottom 20%",
          scrub: true,
          // markers: true
        },
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
        y: 0,
        duration: 3,
        ease: "power4.out",
      });
    });
  });

  const about_video = document.querySelector(".about-video video");
  gsap.set(about_video, {
    borderRadius: "50px",
  });
  gsap.from(about_video, {
    y: -450,
    duration: 2,
    scale: 0.2,
    ease: "easeInOut",
    scrollTrigger: {
      trigger: about_video,
      scrub: true,
      start: "top 70%",
      end: "bottom 20%",
    },
    borderRadius: "500px",
    onComplete() {
      gsap.to(about_video, {
        borderRadius: "50px",
      });
    },
  });

  const scrollText = document.querySelectorAll(".scrollText");

  document.fonts.ready.then(() => {
    const scrollTextSplit = new SplitText(scrollText, {
      type: "lines",
      linesClass: "lineChildren",
    });

    const scrollTextChars = new SplitText(scrollText, {
      type: "chars",
      charsClass: "charChildren",
    });

    gsap.from(scrollTextSplit.lines, {
      x: -200,
      stagger: 0.3,
      scrollTrigger: {
        trigger: scrollText,
        start: "-200px 80%",
        end: "bottom 60%",
        scrub: true,
        // markers:true
      },
    });
    gsap.from(scrollTextChars.chars, {
      opacity: 0.1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: scrollText,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });
  });

  const animateImage = document.querySelector(".animateImage1");
  gsap.from(animateImage, {
    x: -300,
    rotate: -15,
    opacity: 0.5,
    ease: "easeInOut",
    scrollTrigger: {
      trigger: animateImage,
      scrub: true,
      start: "top bottom",
      end: "bottom 20%",
    },
  });

  const animateImage2 = document.querySelector(".animateImage2");
  gsap.from(animateImage2, {
    x: 300,
    rotate: 15,
    opacity: 0.5,
    ease: "easeInOut",
    scrollTrigger: {
      trigger: animateImage2,
      scrub: true,
      start: "top 90%",
      end: "bottom 20%",
    },
  });
}

function setUpAnimation() {
  // Text Animation by Chars
  document.fonts.ready.then(() => {
    const charsAnimation = document.querySelectorAll(".charsAnimation");
    const charsSplit = [];

    charsAnimation.forEach((el) => {
      const split = new SplitText(el, { type: "chars" });
      charsSplit.push(split);
    });

    charsSplit.forEach((split) => {
      gsap.set(split.chars, {
        y: 100,
      });

      gsap.to(split.chars, {
        scrollTrigger: {
          trigger: split.chars,
          start: "top 80%",
          end: "bottom 20%",
          once: true,
        },
        y: 0,
        duration: 0.8,
        ease: "power4.Out",
        stagger: 0.02,
      });
    });
  });

  // Text Animation by Lines

  document.fonts.ready.then(() => {
    const linesAnimation = document.querySelectorAll(".linesAnimation");
    const linesSplit = [];

    linesAnimation.forEach((el) => {
      const split = new SplitText(el, {
        type: "lines",
        linesClass: "line-wrapper",
        autoSplit: true,
      });

      split.lines.forEach((line) => {
        const inner = document.createElement("span");
        inner.classList.add("line");
        inner.innerHTML = line.innerHTML;
        line.innerHTML = "";
        line.appendChild(inner);
      });

      linesSplit.push(split);
    });

    linesSplit.forEach((split) => {
      split.lines.forEach((lineWrapper) => {
        const line = lineWrapper.querySelector(".line");
        gsap.set(line, {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
          y: 100,
        });

        gsap.to(line, {
          scrollTrigger: {
            trigger: lineWrapper,
            start: "top 80%",
            end: "bottom 20%",
            once: true,
          },
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
          duration: 2,
          ease: "power4.out",
        });
      });
    });
  });

  // Intro Text Animation by Lines
  document.fonts.ready.then(() => {
    const introlinesAnimation = document.querySelectorAll(
      ".introLineAnimation"
    );
    const introlinesSplit = [];

    introlinesAnimation.forEach((el) => {
      const split = new SplitText(el, {
        type: "lines",
        linesClass: "line-wrapper",
        autoSplit: true,
      });

      split.lines.forEach((line) => {
        const inner = document.createElement("span");
        inner.classList.add("line");
        inner.innerHTML = line.innerHTML;
        line.innerHTML = "";
        line.appendChild(inner);
      });

      introlinesSplit.push(split);
    });

    introlinesSplit.forEach((split) => {
      split.lines.forEach((lineWrapper) => {
        const line = lineWrapper.querySelector(".line");
        gsap.set(line, {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
          y: 100,
        });
        gsap.to(line, {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
          duration: 3,
          ease: "power4.out",
          delay: 0.5,
        });
      });
    });
  });

  //Fade in elements

  const fadeElements = document.querySelectorAll(".fade-in");

  fadeElements.forEach((e) => {
    gsap.set(fadeElements, {
      opacity: 0,
      y: 50,
    });

    gsap.to(fadeElements, {
      scrollTrigger: {
        trigger: fadeElements,
        start: "top 80%",
        end: "bottom 20%",
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.Out",
      stagger: 0.1,
    });
  });
}

function setUpContact() {
  const contact_row = document.querySelectorAll(".contact-row");

  gsap.from(contact_row, {
    opacity: 0,
    x: 300,
    duration: 2,
    ease: "power4.InOut",
    stagger: 0.3,
  });

  ScrollTrigger.create({
    trigger: ".contact-form",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => {
      gsap.to("html", {
        filter: "invert(1)",
        duration: 1,
        ease: "power2.out",
      });
    },
    onLeave: () => {
      gsap.to("html", {
        filter: "invert(0)",
        duration: 1,
        ease: "power2.out",
      });
    },
    onEnterBack: () => {
      gsap.to("html", {
        filter: "invert(1)",
        duration: 1,
        ease: "power2.out",
      });
    },
    onLeaveBack: () => {
      gsap.to("html", {
        filter: "invert(0)",
        duration: 1,
        ease: "power2.out",
      });
    },
  });

  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      ScrollTrigger.create({
        trigger: ".contact-container",
        start: "top top",
        end: "bottom bottom",
        pin: ".left-section",
        scrub: true,
        pinSpacing: false,
      });
    },
  });
}
function setUpLenis() {
  const lenis = new Lenis({
    duration: 2,
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    smoothTouch: true,
    touchMultiplier: 2,
    infinite: false,
  });

  // Scroll update loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  lenis.start();
  requestAnimationFrame(raf);
}

function setUpHelpBubble() {
  // Help Bubble

  const helpBubble = document.querySelector(".help-bubble");
  let active = false;

  document.addEventListener("mousemove", (e) => {
    if (active) {
      helpBubble.style.left = `${e.clientX}px`;
      helpBubble.style.top = `${e.clientY}px`;
    }
  });

  document.querySelectorAll(".help-target").forEach((div) => {
    div.addEventListener("mouseenter", (e) => {
      const helpText = div.dataset.help;
      helpBubble.textContent = helpText;
      helpBubble.style.transform = "scale(1)";
      active = true;
    });

    div.addEventListener("mouseleave", () => {
      helpBubble.style.transform = "scale(0)";
      active = false;
    });
  });
}

function setUpNavigation() {
  // Set initial positions navigation
  const navigation = document.querySelector(".navigation");
  const navBtn = document.querySelector(".nav-btn");
  const navigation_link = document.querySelectorAll('.navigation_links');







  let isOpen = false;

  gsap.set(navigation, {
    yPercent: -100,
    clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)"

  })
  navigation_link.forEach((link) => {
    gsap.set(link, {
      y: 100
    })
  })
  navBtn.addEventListener("click", () => {
    if (!isOpen) {

      gsap.to(navigation, {
        yPercent: -50,
        duration: 2,
        ease: "power4.out",


      })
      gsap.to(navigation, {
        duration: 1.5,
        ease: "power4.out",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"

      })

      navigation_link.forEach((link) => {
        gsap.to(link, {
          y: 0,
          duration: 1.3,
          ease: "power4.out",
          stagger:1
        })
      })

    } else {
      gsap.to(navigation, {
        yPercent: -100,
        duration: 2,
        ease: "power4.inOut",

      })

      gsap.to(navigation, {
        duration: 2,
        ease: "power3.inOut",
        clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)"
      })

      navigation_link.forEach((link) => {
        gsap.to(link, {
          y: 100,
          duration: 1.5,
          ease: "power4.inOut",
          stagger:1
        })
      })
      navigation.classList.remove("visible");
    }


    isOpen = !isOpen;
  });


  // Navigation Count

  const navData = {
    HOME: "01",
    PRODUCTS: "02",
    CART: "03",
    CONTACT: "04",
    ABOUT: "05",
    SIGNUP: "06",
  };
  const navLinks = document.querySelectorAll(".nav-link");
  const numberDisplay = document.querySelector(".navigation .right .bot h1");

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const text = link.textContent.trim().toUpperCase();
      numberDisplay.textContent = navData[text] || "00";
    });
    link.addEventListener("mouseleave", () => {
      numberDisplay.textContent = "01";
    });
  });
}

function setUpParallax() {
  //Parallax Scroll
  document.addEventListener("scroll", () => {
    const images = document.querySelectorAll(".image-parallax");
    images.forEach((img) => {
      const speed = img.dataset.speed || 0.2;
      const offset = window.scrollY * speed;
      img.style.transform = `translateY(${offset}px)`;
    });
  });

  window.addEventListener("scroll", () => {
    const imageEl = document.querySelector(".background-parallax");
    const speed = 0.2; // adjust to match your parallax feeling
    const scrollY = window.scrollY;
    const newPosY = -200 + scrollY * speed;
    imageEl.style.backgroundPositionY = `${newPosY}px`;
  });
}

function setUpProduct() {
  const slider = document.getElementById("slider");
  const buttons = document.querySelectorAll(".product-nav button");

  function goToSlide(index) {
    slider.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });

    buttons.forEach((btn) => btn.classList.remove("active"));
    buttons[index].classList.add("active");
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / window.innerWidth);
    buttons.forEach((btn) => btn.classList.remove("active"));
    buttons[index].classList.add("active");
  });
}

function setUpScrollToTop() {
  window.addEventListener("load", function () {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  });
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

function setUpSliderImage() {
  // Pinned Image Scroll Animation

  document.fonts.ready.then(() => {
    const video = document.getElementById("backgroundVideo");
    const videoFilters = [
      "sepia(0.9) saturate(1.8) brightness(1.1)",
      "grayscale(1) saturate(0)",
      "grayscale(0.4) sepia(0.2) saturate(1.5) hue-rotate(90deg)",
    ];

    const strip = document.getElementById("strip");
    const images = strip.querySelectorAll("img");
    const container = document.getElementById("container");
    const containerHeight = container.offsetHeight;
    const textContainers = gsap.utils.toArray(".text-container");

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: ".image-slider",
        start: "top top",
        end: () => "+=" + containerHeight * images.length * 2,
        scrub: true,
        pin: true,
      },
    });

    master.to(
      strip,
      {
        y: -containerHeight * (images.length - 1),
        ease: "power2.out",
        duration: 1,
      },
      0
    );

    const allTextLines = [];

    textContainers.forEach((container) => {
      const heading = container.querySelector("h1");
      const paragraph = container.querySelector("p");

      const splitHeading = new SplitText(heading, { type: "lines" });
      const splitParagraph = new SplitText(paragraph, { type: "lines" });

      const lines = [...splitHeading.lines, ...splitParagraph.lines];

      gsap.set(lines, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
        y: 50,
      });

      allTextLines.push(lines);
    });

    function getFilterValues(filterStr) {
      const values = {
        grayscale: 0,
        saturate: 1,
        sepia: 0,
        brightness: 1,
        "hue-rotate": 0,
      };

      if (filterStr === "none") return values;

      const parts = filterStr.split(" ");
      parts.forEach((part) => {
        const [name, value] = part.replace(")", "").split("(");
        values[name] = parseFloat(value);
      });

      return values;
    }

    images.forEach((_, i) => {
      const tl = gsap.timeline();
      tl.to(strip, {
        y: -containerHeight * i,
        duration: 1.5,
        ease: "power1.inOut",
      });

      if (videoFilters[i]) {
        const prev = videoFilters[i - 1] || "none";
        const prevVals = getFilterValues(prev);
        const currVals = getFilterValues(videoFilters[i]);

        tl.to(
          { ...prevVals },
          {
            ...currVals,
            duration: 1,
            ease: "none",
            onUpdate: function () {
              const prog = this.progress();
              const grayscale = gsap.utils.interpolate(
                prevVals.grayscale,
                currVals.grayscale,
                prog
              );
              const saturate = gsap.utils.interpolate(
                prevVals.saturate,
                currVals.saturate,
                prog
              );
              const sepia = gsap.utils.interpolate(
                prevVals.sepia,
                currVals.sepia,
                prog
              );
              const brightness = gsap.utils.interpolate(
                prevVals.brightness,
                currVals.brightness,
                prog
              );
              const hueRotate = gsap.utils.interpolate(
                prevVals["hue-rotate"],
                currVals["hue-rotate"],
                prog
              );

              video.style.filter = `
                        grayscale(${grayscale})
                        saturate(${saturate})
                        sepia(${sepia})
                        brightness(${brightness})
                        hue-rotate(${hueRotate}deg)
                    `;
            },
          },
          "<"
        );
      }

      if (allTextLines[i - 1]) {
        tl.to(
          allTextLines[i - 1],
          {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
            y: 50,
            duration: 0.6,
            ease: "power4.in",
          },
          "<"
        );
      }

      if (allTextLines[i]) {
        tl.to(
          allTextLines[i],
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
            y: 0,
            stagger: 0.05,
            duration: 1,
            ease: "power4.out",
          },
          ">"
        );
      }

      master.add(tl);
    });
  });
}

function setUpTransition() {
  // Page Transition
  const links = document.querySelectorAll(".transition-link");

  gsap.to(".inTransition", {
    yPercent: -100,
    duration: 0.8,
    delay: 0.5,
    ease: "power4.inOut",
    onComplete: () => {
      document.querySelector(".inTransition").style.display = "none";
    },
  });

  gsap.set(".outTransition", {
    height: 0,
    width: 800,
  });
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetUrl = link.getAttribute("href");

      // Out transition
      gsap.to(".outTransition", {
        y: -550,
        height: 800,
        width: 1535,
        duration: 1.3,
        ease: "power4.inOut",
        onStart: () => {
          overlay.style.pointerEvents = "auto";
        },
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });
    });
  });
}

function setUpSignup() {


  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.addEventListener("touchmove", preventScroll, {
    passive: false,
  });

  function preventScroll(e) {
    e.preventDefault();
  }

  const signup_form = document.getElementById('signup_form');
  const login_form = document.getElementById('login_form');
  const username_input = document.getElementById('username_input');
  const email_input = document.getElementById('email_input');

  const password_input = document.getElementById('password_input');
  const repeat_password_input = document.getElementById('repeat_password_input');
  const login_email_input = document.getElementById('login_email_input');
  const login_password_input = document.getElementById('login_password_input');


  const signup_error_msg = document.getElementById('signup_error_message');
  const login_error_msg = document.getElementById('login_error_message');



  signup_form.addEventListener('submit', (e) => {

    let errors = [];

    if (username_input) {
      errors = getSignupFormErrors(username_input.value, email_input.value,  password_input.value, repeat_password_input.value);
    }

    if (errors.length > 0) {
      e.preventDefault();
      signup_error_msg.innerText = errors.join(". ");
    }
  });

  login_form.addEventListener('submit', (e) => {
    let errors = [];

    errors = getLoginFormErrors(login_email_input.value, login_password_input.value);

    if (errors.length > 0) {
      e.preventDefault();
      login_error_msg.innerText = errors.join(". ");
    }


  });


  function getSignupFormErrors(username, email, password, repeat_password) {
    let errors = [];

    if (username === '' || username == null) {
      errors.push("Username is Required");
      username_input.parentElement.classList.add('incorrect');

    }

    if (email === '' || email == null) {
      errors.push("Email is Required");
      email_input.parentElement.classList.add('incorrect');
    }
   
    if (password === '' || password == null) {
      errors.push("Password is Required");
      password_input.parentElement.classList.add('incorrect');
    }
    if (repeat_password === '' || repeat_password == null) {
      errors.push("Repeated Password is Required");
      repeat_password_input.parentElement.classList.add('incorrect');
    }

    if (password != repeat_password) {
      errors.push("Password Does Not Match With Repeated Password");
      password_input.parentElement.classList.add('incorrect');
      repeat_password_input.parentElement.classList.add('incorrect');

    }

    return errors;
  }


  function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === '' || email == null) {
      errors.push("Email is Required");
      login_email_input.parentElement.classList.add('incorrect');
    }
    if (password === '' || password == null) {
      errors.push("Password is Required");
      login_password_input.parentElement.classList.add('incorrect');
    }
    return errors;
  }



  const allInputs = [username_input, email_input, password_input, repeat_password_input];

  allInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('incorrect')) {
        input.parentElement.classList.remove('incorrect');
        error_msg.innerText = '';
      }
    })
  })

  // Gsap animation

  const signUpBtn = document.getElementById('signUpBtn')
  const loginBtn = document.getElementById('loginBtn')
  const signUpWrapper = document.querySelector(".signup_wrapper")
  const loginWrapper = document.querySelector(".login_wrapper")

  gsap.set(loginWrapper, {
    xPercent: 100,
    clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
  })

  loginBtn.addEventListener('click', (e) => {
    gsap.set(signUpWrapper, {
      clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    })
    gsap.to(signUpWrapper, {
      xPercent: -100,
      duration: 3,
      ease: "power4.inOut",
      clipPath: "polygon(0 0, 0% 0%, 0% 100%, 0% 100%)"

    })

    gsap.to(loginWrapper, {
      xPercent: 0,
      duration: 3,
      ease: "power4.inOut",
      clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)"
    });
  });

  signUpBtn.addEventListener('click', () => {
    gsap.set(loginWrapper, {
      clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    });
    gsap.to(loginWrapper, {
      xPercent: 100,
      duration: 3,
      ease: "power4.inOut",
      clipPath: "polygon(100% 0, 0% 0%, 0% 100%, 100% 100%)"

    });
    gsap.to(signUpWrapper, {
      xPercent: 0,
      duration: 3,
      ease: "power4.inOut",
      clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    });
  })



}



// Page Load Functions

function initGlobal() {

  setUpTransition();
  setUpHelpBubble();
  setUpNavigation();
  setUpScrollToTop();
  setUpLoader();
}
function initHome() {

  setUpHome();
  setUpParallax();
  setUpSliderImage();
}

function initProduct() {

  setUpLenis();
  setUpProduct();
}

function initCart() {
  setUpLenis();

}
function initContact() {

  setUpLenis();
  setUpContact();
}

function initAbout() {

  setUpLenis();
  setUpAbout();
  setUpSliderImage();
}

function initSignup() {
  setUpSignup();
}

// Reinitialize Page
function reinitializePage() {
  initGlobal();

  const page = document.body.dataset.page;

  if (page == "home") {
    initHome();
  } else if (page == "product") {
    initProduct();
  } else if (page == "cart") {
    initCart();
  } else if (page == "contact") {
    initContact();
  } else if (page == "about") {
    initAbout();
  }
  else if (page == "signup") {
    initSignup();
  }
}
