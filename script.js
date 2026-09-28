// ==========================================
// NOMOR WHATSAPP ADMIN
// ==========================================

const nomorWhatsApp = "6289625037020";

// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// ==========================================
// PILIH PAKET DARI PRICE LIST
// ==========================================

function pilihPaket(namaPaket, harga, tipe) {
  const paketSelect = document.getElementById("paket");
  const total = document.getElementById("total");
  const options = paketSelect.options;

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const optionNama = option.value;
    const optionHarga = option.getAttribute("data-price");
    const optionTipe = option.getAttribute("data-type");

    if (
      optionNama === namaPaket &&
      Number(optionHarga) === harga &&
      optionTipe === tipe
    ) {
      paketSelect.selectedIndex = i;

      break;
    }
  }

  total.textContent = formatRupiah(harga);

  document.getElementById("order").scrollIntoView({
    behavior: "smooth",
  });
}

// ==========================================
// UPDATE TOTAL
// ==========================================

document.getElementById("paket").addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];

  const harga = selectedOption.getAttribute("data-price");

  const total = document.getElementById("total");

  if (harga) {
    total.textContent = formatRupiah(Number(harga));
  } else {
    total.textContent = "Rp0";
  }
});

// ==========================================
// SUBMIT PESANAN
// ==========================================

document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const paketSelect = document.getElementById("paket");

    const username = document.getElementById("username").value.trim();

    if (!paketSelect.value) {
      alert("Yuk pilih paket Robux dulu ✨");

      return;
    }

    if (!username) {
      alert("Masukkan username Roblox kamu dulu ya ♡");

      return;
    }

    const selectedOption = paketSelect.options[paketSelect.selectedIndex];

    const paket = selectedOption.value;

    const harga = Number(selectedOption.getAttribute("data-price"));

    const tipe = selectedOption.getAttribute("data-type");

    // ==========================================
    // ORDER ID
    // ==========================================

    const sekarang = new Date();

    const tahun = sekarang.getFullYear().toString().slice(-2);

    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");

    const tanggal = String(sekarang.getDate()).padStart(2, "0");

    const jam = String(sekarang.getHours()).padStart(2, "0");

    const menit = String(sekarang.getMinutes()).padStart(2, "0");

    const detik = String(sekarang.getSeconds()).padStart(2, "0");

    const orderID = `-${tanggal}${bulan}${tahun}-${jam}${menit}${detik}`;

    // ==========================================
    // PESAN WHATSAPP
    // ==========================================

    const pesan = `*PESANAN✨*

Order ID: ${orderID}

*DETAIL PESANAN*
━━━━━━━━━━━━━━━━
Jenis: ${tipe}
Paket: ${paket}
Username Roblox: ${username}
Total: ${formatRupiah(harga)}
━━━━━━━━━━━━━━━━

Halo Admin arisya Dreamy 💗
Saya mau order Robux dengan detail di atas.

Mohon info pembayaran selanjutnya ya ✨

Thank you ♡
`;

    const pesanEncoded = encodeURIComponent(pesan);

    const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${pesanEncoded}`;

    window.open(linkWhatsApp, "_blank");
  });
