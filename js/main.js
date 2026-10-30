(function () {
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress span");
  var heroMedia = document.querySelector(".hero-media");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header && !header.classList.contains("solid")) header.classList.toggle("scrolled", y > 24);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (!reduceMotion && heroMedia && y < window.innerHeight) {
      heroMedia.style.transform = "translate3d(0, " + (y * 0.18) + "px, 0) scale(1.04)";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.filter.call(entry.target.parentElement.children, function (el) {
          return el.classList.contains("reveal");
        });
        var index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = Math.min(index * 80, 320) + "ms";
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    Array.prototype.forEach.call(document.querySelectorAll(".hero .reveal, .page-hero .reveal"), function (el) {
      el.classList.add("is-visible");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
      observer.observe(el);
    });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
      el.classList.add("is-visible");
    });
  }

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", menuButton.getAttribute("data-open-label") || "Open navigation");
    nav.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", open ? "false" : "true");
      menuButton.setAttribute("aria-label", open
        ? (menuButton.getAttribute("data-open-label") || "Open navigation")
        : (menuButton.getAttribute("data-close-label") || "Close navigation"));
      nav.classList.toggle("open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".accordion details"), function (detail) {
    detail.addEventListener("toggle", function () {
      if (!detail.open) return;
      Array.prototype.forEach.call(document.querySelectorAll(".accordion details"), function (other) {
        if (other !== detail) other.open = false;
      });
    });
  });

  var form = document.querySelector(".enquiry");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var error = form.querySelector(".form-error");
    if (!form.reportValidity()) {
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    var lines = [];
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (field) {
      if (!field.name || field.classList.contains("hp-field")) return;
      var label = (field.id && form.querySelector('label[for="' + field.id + '"]')) || field.closest("label");
      var name = label ? label.childNodes[0].textContent.trim() : field.name;
      lines.push(name + ": " + field.value.trim());
    });
    var subject = form.getAttribute("data-subject") || "Website enquiry";
    var note = form.querySelector(".form-note");
    if (note) note.hidden = false;
    window.location.href = "mailto:admin@nexcam.qa?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  });
})();
