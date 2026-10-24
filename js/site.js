(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Background blobs drift toward the pointer.
  if (matchMedia("(pointer: fine)").matches && !reduce) {
    let tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--mx", cx.toFixed(3));
      root.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    addEventListener("pointermove", (e) => {
      tx = e.clientX / innerWidth;
      ty = e.clientY / innerHeight;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // Scroll reveal.
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  // Generic expand/collapse buttons.
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    const target = document.getElementById(btn.dataset.toggle);
    if (!target) return;
    btn.addEventListener("click", () => {
      const open = target.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      const label = btn.querySelector("[data-label]");
      if (label && btn.dataset.alt) {
        const current = label.textContent;
        label.textContent = btn.dataset.alt;
        btn.dataset.alt = current;
      }
    });
  });

  // Project cards.
  document.querySelectorAll(".card-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Publication filters.
  const filters = document.querySelector(".filters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const key = btn.dataset.filter;
      document.querySelectorAll("[data-group]").forEach((g) => {
        g.hidden = key !== "all" && g.dataset.group !== key;
      });
    });
  }

  // CV section map.
  const toc = document.querySelector(".toc");
  if (toc && "IntersectionObserver" in window) {
    const links = [...toc.querySelectorAll("a")];
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  document.querySelectorAll("[data-print]").forEach((b) => b.addEventListener("click", () => print()));

  // Research map: keep one circle open on tap.
  const venn = document.querySelector(".venn");
  if (venn) {
    venn.querySelectorAll(".v").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.classList.contains("is-on");
        venn.querySelectorAll(".v").forEach((b) => b.classList.remove("is-on"));
        if (!on) btn.classList.add("is-on");
      });
    });
  }

  const pop = document.querySelector(".project-pop");
  if (pop) {
    const close = pop.querySelector(".lightbox-close");
    const img = pop.querySelector("img");
    const kicker = pop.querySelector(".kicker");
    const title = pop.querySelector("h2");
    const blurb = pop.querySelector(".blurb");

    document.querySelectorAll(".card").forEach((card) => {
      card.querySelector(".card-hit").addEventListener("click", () => {
        const srcImg = card.querySelector("img");
        img.src = srcImg.currentSrc || srcImg.src;
        img.alt = srcImg.alt;
        kicker.textContent = card.querySelector(".kicker").textContent;
        title.textContent = card.querySelector(".card-title").textContent;
        blurb.textContent = card.querySelector(".blurb").textContent;
        pop.showModal();
      });
    });

    close.addEventListener("click", () => pop.close());
    pop.addEventListener("click", (event) => {
      if (event.target === pop) pop.close();
    });
  }
})();
