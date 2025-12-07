"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ===================== UTILITAS SINGKAT =====================
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  
  // ===================== NAVBAR ACTIVE SAAT SCROLL =====================
  const sections = $$("main .section");
  const navLinks = $$(".nav-links a");
  
  if ("IntersectionObserver" in window && sections.length > 0) {
    const navMap = new Map();
    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").replace("#", "");
      navMap.set(targetId, link);
    });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = navMap.get(id);
          if (activeLink) activeLink.classList.add("active");
        });
      },
      {
        threshold: 0.4,
      }
    );
    
    sections.forEach((sec) => observer.observe(sec));
  } else {
    // fallback kalau IntersectionObserver tidak ada
    const onScroll = () => {
      const scrollPos = window.scrollY + 120;
      let currentId = "";
      
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.id;
        }
      });
      
      navLinks.forEach((link) => {
        const href = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", href === currentId);
      });
    };
    
    window.addEventListener("scroll", onScroll);
    onScroll();
  }
  
  // ===================== SMOOTH SCROLL KETIKA KLIK NAV =====================
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const target = $(href);
      if (!target) return;
      
      const offset = 80; // kompensasi navbar sticky
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
  
  // ===================== KALKULATOR KEDUDUKAN TITIK =====================
  const pointForm = $("#pointChecker");
  const resultBox = $("#resultBox");
  
  if (pointForm && resultBox) {
    pointForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Ambil input
      const a = parseFloat($("#centerX").value);
      const b = parseFloat($("#centerY").value);
      const r = parseFloat($("#radius").value);
      const x1 = parseFloat($("#pointX").value);
      const y1 = parseFloat($("#pointY").value);
      
      // Validasi
      if (
        Number.isNaN(a) ||
        Number.isNaN(b) ||
        Number.isNaN(r) ||
        Number.isNaN(x1) ||
        Number.isNaN(y1) ||
        r <= 0
      ) {
        resultBox.textContent =
          "Pastikan semua input terisi dengan benar dan jari-jari (r) > 0.";
        return;
      }
      
      // Hitung d² = (x1 - a)² + (y1 - b)²
      const dx = x1 - a;
      const dy = y1 - b;
      const d2 = dx * dx + dy * dy;
      const r2 = r * r;
      
      // Pembulatan agar rapi
      const roundedDx = Math.round(dx * 1000) / 1000;
      const roundedDy = Math.round(dy * 1000) / 1000;
      const roundedD2 = Math.round(d2 * 1000) / 1000;
      const roundedR2 = Math.round(r2 * 1000) / 1000;
      
      // Tentukan posisi
      let posisi;
      let alasan;
      
      if (Math.abs(d2 - r2) < 1e-9) {
        posisi = "PADA lingkaran";
        alasan = "karena d² = r²";
      } else if (d2 < r2) {
        posisi = "DI DALAM lingkaran";
        alasan = "karena d² < r²";
      } else {
        posisi = "DI LUAR lingkaran";
        alasan = "karena d² > r²";
      }
      
      // Tampilkan langkah-langkah
      resultBox.innerHTML = `
        <p><strong>Langkah-langkah:</strong></p>
        <ol style="padding-left:1.2rem; margin-top:0.3rem;">
          <li>Diketahui pusat lingkaran O(a, b) = O(${a}, ${b}) dan jari-jari r = ${r}.</li>
          <li>Titik P(x₁, y₁) = P(${x1}, ${y1}).</li>
          <li>Hitung selisih:
            <br>(x₁ - a) = ${x1} - ${a} = ${roundedDx}
            <br>(y₁ - b) = ${y1} - ${b} = ${roundedDy}
          </li>
          <li>Hitung d²:
            <br>d² = (x₁ - a)² + (y₁ - b)²
            <br>= (${roundedDx})² + (${roundedDy})²
            <br>≈ ${roundedD2}
          </li>
          <li>Hitung r²:
            <br>r² = (${r})² ≈ ${roundedR2}
          </li>
        </ol>
        <p><strong>Perbandingan:</strong> d² = ${roundedD2}, r² = ${roundedR2}</p>
        <p><strong>Kesimpulan:</strong> Titik P berada <strong>${posisi}</strong>, ${alasan}.</p>
      `;
    });
  }
});