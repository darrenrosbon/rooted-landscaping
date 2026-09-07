(function () {
  "use strict";

  /* ------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------
     Scroll reveal (IntersectionObserver, no scroll listeners)
     ------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------
     Before / after compare sliders
     ------------------------------------------------------------ */
  var compares = document.querySelectorAll("[data-compare]");

  compares.forEach(function (compare) {
    var afterImg = compare.querySelector(".compare-after");
    var divider = compare.querySelector("[data-divider]");
    var handle = compare.querySelector("[data-handle]");
    var dragging = false;

    function setPosition(clientX) {
      var rect = compare.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      var percent = (x / rect.width) * 100;
      afterImg.style.clipPath = "inset(0 0 0 " + percent + "%)";
      divider.style.left = percent + "%";
      handle.style.left = percent + "%";
    }

    // Dragging is bound to the handle only, not the whole image box, so
    // touch-scrolling past this card on mobile never gets hijacked into
    // a divider jump.
    handle.addEventListener("pointerdown", function (e) {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      setPosition(e.clientX);
    });

    ["pointerup", "pointercancel"].forEach(function (evt) {
      handle.addEventListener(evt, function () {
        dragging = false;
      });
    });

    compare.addEventListener("keydown", function (e) {
      var rect = compare.getBoundingClientRect();
      var current = parseFloat(divider.style.left) || 50;
      if (e.key === "ArrowLeft") {
        setPosition(rect.left + (rect.width * Math.max(current - 5, 0)) / 100);
      } else if (e.key === "ArrowRight") {
        setPosition(rect.left + (rect.width * Math.min(current + 5, 100)) / 100);
      }
    });

    compare.setAttribute("tabindex", "0");
    compare.setAttribute("role", "slider");
    compare.setAttribute("aria-label", "Before and after comparison, drag to reveal");
    compare.setAttribute("aria-valuemin", "0");
    compare.setAttribute("aria-valuemax", "100");
    compare.setAttribute("aria-valuenow", "50");
  });

  /* ------------------------------------------------------------
     Quote form — front-end only, fake success state
     ------------------------------------------------------------ */
  var form = document.getElementById("quoteFormEl");
  var formWrap = document.getElementById("quoteForm");
  var success = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[data-field]").forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        if (!input || !input.hasAttribute("required")) return;

        var ok = input.type === "email" ? /^\S+@\S+\.\S+$/.test(input.value) : input.value.trim().length > 0;

        field.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      formWrap.classList.add("is-submitted");
      success.classList.add("is-visible");
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  }
})();
