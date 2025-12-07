"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  const btnResult = document.getElementById("btnResult");
  const resultBox = document.getElementById("resultBox");
  const modal = document.getElementById("funModal");
  const modalText = document.getElementById("modalText");
  const modalClose = document.querySelector(".modal-close");
  const resultSound = document.getElementById("resultSound");

  // Kunci jawaban 15 soal
  const answerKey = {
    q1: "b",  // pusat: titik yang jaraknya sama ke semua titik
    q2: "c",  // d = 2r
    q3: "a",  // garis singgung
    q4: "a",  // juring
    q5: "b",  // tembereng
    q6: "c",  // x² + y² = 49
    q7: "a",  // (x − 3)² + (y + 2)² = 25
    q8: "b",  // pusat (3, −2)
    q9: "b",  // r = 10
    q10: "c", // (x − a)² + (y − b)² = r²
    q11: "a", // P(0,0): d² = 0 < 25 → di dalam
    q12: "b", // Q(3,0): d² = 9 = r² → pada
    q13: "b", // R(2,6): d² = 25 = r² → pada
    q14: "c", // d² > r² → di luar
    q15: "b", // S(5, −2): d² = 16 = r² → pada
  };

  function hitungSkor() {
    let benar = 0;
    let kosong = 0;
    const total = Object.keys(answerKey).length;

    for (const nomor in answerKey) {
      const jawaban = quizForm.querySelector(`input[name="${nomor}"]:checked`);
      if (!jawaban) {
        kosong++;
        continue;
      }
      if (jawaban.value === answerKey[nomor]) {
        benar++;
      }
    }

    const salah = total - benar - kosong;
    const nilai = Math.round((benar / total) * 100);

    return { benar, salah, kosong, total, nilai };
  }

  function getEssayComment() {
    const text = (document.getElementById("essayAnswer").value || "").toLowerCase();

    if (text.includes("0") && text.includes("rakus")) {
      return "Kamu paham esensi soal bonus: Harys memang rakus 😆";
    }
    if (text.includes("100")) {
      return "Secara matematika kamu benar (sisa 100 apel), tapi soal ini lagi mode bercanda, ingat: Harys rakus 😝";
    }
    if (text.trim() === "") {
      return "Bonus essai belum diisi, padahal di situlah soal mtk yang sesungguhnya 🤡";
    }
    return "Jawaban bonus essai unik juga, tapi versi resmi: sisa 0 apel karena Harys rakus 🍎🔥";
  }

  function tampilkanHasil() {
    const { benar, salah, kosong, total, nilai } = hitungSkor();
    const essayComment = getEssayComment();

    let pesanNilai;
    if (nilai === 100) {
      pesanNilai = "Sempurna! Kamu calon guru mtk selanjutnya nih 😎✨";
    } else if (nilai >= 80) {
      pesanNilai = "Keren! Tinggal sedikit lagi menuju sempurna 👏";
    } else if (nilai >= 60) {
      pesanNilai = "Lumayan, tapi masih perlu latihan lagi. Gas belajar lagi ya 💪";
    } else {
      pesanNilai = "Belum apa-apa sudah lelah? Tenang, masih bisa coba lagi kok 🙂";
    }

    resultBox.innerHTML = `
      <strong>Ringkasan Hasil:</strong><br />
      Benar: ${benar} dari ${total} soal<br />
      Salah: ${salah} soal, Kosong: ${kosong} soal<br />
      Perkiraan nilai: ${nilai}%<br /><br />
      <strong>Bonus Essai:</strong> ${essayComment}
    `;

    // Isi teks di modal
    modalText.innerHTML = `
      Kamu menjawab <strong>${benar}</strong> dari <strong>${total}</strong> soal dengan benar.<br />
      Nilai kira-kira: <strong>${nilai}%</strong>.<br /><br />
      Bonus essai: ${essayComment}
    `;

    // Tampilkan modal
    modal.classList.add("show");

    // Putar suara (kalau file-nya ada dan boleh diputar)
    if (resultSound && typeof resultSound.play === "function") {
      try {
        resultSound.currentTime = 0;
        resultSound.play();
      } catch (err) {
        // jika browser blokir autoplay, biarin saja
      }
    }
  }

  // Event klik tombol "Hasilnya"
  if (btnResult) {
    btnResult.addEventListener("click", () => {
      tampilkanHasil();
    });
  }

  // Tutup modal
  function closeModal() {
    modal.classList.remove("show");
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});