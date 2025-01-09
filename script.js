// Mengambil elemen-elemen yang diperlukan
const allSections = document.querySelector('#all-sections');
const navbar = document.querySelector('nav');
const muteButton = document.querySelector('.mute-bottom');
let audio;  // Mendeklarasikan audio di luar fungsi main untuk bisa diakses secara global

// Fungsi utama untuk menyembunyikan elemen awal
function main() {
    allSections.style.display = 'none';
    navbar.style.opacity = 0;
    muteButton.style.display = 'none';
}

main();

// Klik pada tombol 'welcome-btn'
document.querySelector('#welcome-btn').onclick = function () {
    if (allSections.style.display === 'none') {
        // Menampilkan semua bagian, mengatur opacity navbar menjadi 1, dan menampilkan tombol mute
        allSections.style.display = 'block';
        navbar.style.opacity = 1;
        muteButton.style.display = 'block';

        // Membuat elemen audio dan mengatur sumbernya hanya sekali
        if (!audio) {
            audio = document.createElement('audio');
            audio.src = 'assets/music/nas.mp3';
            audio.autoplay = true;
            audio.loop = true;

            // Menambahkan elemen audio ke body
            document.body.appendChild(audio);
        }

        // Memperbarui AOS untuk elemen baru
        AOS.refresh();

        // Menghilangkan tombol 'welcome-btn'
        this.style.display = 'none';

        // Scroll ke seksi berikutnya
        const nextSection = document.querySelector('#next-section'); // Ganti dengan ID/selector seksi berikutnya
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Menambahkan event untuk tombol mute, untuk mematikan atau menghidupkan suara
muteButton.onclick = function () {
    if (audio) {
        // Toggle mute
        audio.muted = !audio.muted;

        // Mengubah ikon sesuai dengan status mute
        if (audio.muted) {
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Ikon untuk audio muted
        } else {
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Ikon untuk audio unmuted
        }
    }
};


// Set tanggal acara
var eventDate = new Date("Jan 25, 2025 08:00:00").getTime();

// Update countdown setiap 1 detik
var countdown = setInterval(function () {

    // Ambil tanggal saat ini
    var now = new Date().getTime();

    // Hitung jarak waktu antara sekarang dan tanggal acara
    var timeLeft = eventDate - now;

    // Hitung hari, jam, menit, dan detik
    var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Tampilkan hasil countdown pada elemen dengan ID yang sesuai
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

    // Jika countdown selesai
    if (timeLeft < 0) {
        clearInterval(countdown);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
    }
}, 1000);


const links = document.querySelectorAll('.circle');

// Monitor perubahan scroll untuk mengatur tampilan link active
const sections = Array.from(links).map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
});

window.onscroll = function () {
    let current = null;

    // Tentukan bagian halaman yang terlihat
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset untuk akurasi
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.id;
        }
    });

    // Perbarui kelas active berdasarkan bagian halaman
    links.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        if (id === current) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};


const webAppUrl = 'https://sheetdb.io/api/v1/bz7g8epiakspf';
function fetchSheetData() {
    fetch(webAppUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#messages').innerHTML = data.map((row) => {
                return `
                <div class="w-100 bg-white p-3 rounded mb-2" data-aos="fade-up" data-aos-duration="1000"
                data-aos-delay="200">
                    <div class="d-flex justify-content-between">
                        <h6>${row.name}</h6>
                        <h6>${row.confirmation}</h6>
                    </div>
                    <p class="text-secondary">${row.comment}</p>
                 </div>`
            }).join('');
        })
        .catch(error => {
            console.log('Terjadi Kesalahan saat memuat data', error);
        });
}

fetchSheetData();

document.querySelector('form').onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.submit_time = new Date().toLocaleString('ID-id');

    fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat mengirim pesan');
            }
            return response.text();
        })
        .then(result => {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Pesan berhasil dikirim!',
                confirmButtonText: 'OK'
            }).then(() => {
                fetchSheetData(); // Refresh data setelah mengirim
                e.target.reset(); // Reset form
            });
        })
        .catch(error => {
            console.error('Terjadi kesalahan saat memuat data', error);
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan',
                text: 'Terjadi kesalahan saat mengirim pesan',
                confirmButtonText: 'OK'
            });
        });
};

document.querySelectorAll('.circle').forEach(item => {
    item.addEventListener('click', function () {
        // Hapus kelas 'active' dari semua elemen
        document.querySelectorAll('.circle').forEach(link => link.classList.remove('active'));

        // Tambahkan kelas 'active' pada elemen yang diklik
        item.classList.add('active');
    });
});
