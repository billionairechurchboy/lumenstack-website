// Lumenstack — site interactions
(function () {
  document.documentElement.classList.remove("no-js");

  // Header: scrolled state + mobile menu
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }
  // Fallback: reveal anything already in view (e.g. after jump links or fast scrolls)
  function revealInView() {
    items.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-visible");
    });
  }
  window.addEventListener("scroll", revealInView, { passive: true });
  window.addEventListener("load", revealInView);

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Insights filter
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      var cat = btn.getAttribute("data-filter");
      document.querySelectorAll(".insight-card").forEach(function (card) {
        card.hidden = !(cat === "all" || card.getAttribute("data-cat") === cat);
      });
    });
  });

  // Preselect service on contact form from ?service=
  var params = new URLSearchParams(window.location.search);
  var svc = params.get("service");
  var svcSelect = document.getElementById("service");
  if (svc && svcSelect) {
    Array.prototype.forEach.call(svcSelect.options, function (o) {
      if (o.value === svc) svcSelect.value = svc;
    });
  }

  // Enquiry forms: client-side validation + success state (front-end demo)
  document.querySelectorAll("form[data-enquiry]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "";
        if (valid && input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        var first = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (first) first.focus();
        return;
      }
      var card = form.closest(".form-card");
      if (card) {
        card.classList.add("is-sent");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  });

  // Newsletter
  document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector("input");
      if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (input) input.focus();
        return;
      }
      form.innerHTML = '<p style="color:#00d1b2;margin:0;font-weight:500">Thanks — you’re on the list.</p>';
    });
  });
})();
