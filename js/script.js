document.addEventListener('DOMContentLoaded', () => {

    // ================= DATA MATA KULIAH =================
    const DaftarMataKuliah = [
        { kode: 'ML', nama: 'Machine Learning', dosen: 'Santi Rahayu' },
        { kode: 'AI', nama: 'Kecerdasan Buatan', dosen: 'Ahmad Fauzi' },
        { kode: 'MP', nama: 'Metode Penelitian', dosen: 'Rinna Rachmatika' },
        { kode: 'PW1', nama: 'Pemrograman Web 1', dosen: 'Galuh Saputri' },
        { kode: 'TRO', nama: 'Teknik Riset Operasional', dosen: 'Farizi Ilham' },
        { kode: 'DE', nama: 'Digital Entrepreneurship', dosen: 'Andrian Hidayat' },
        { kode: 'SIM', nama: 'Sistem Informasi Manajemen', dosen: 'Rengga Herdiansyah' },
        { kode: 'PCD', nama: 'Pengolahan Citra Digital', dosen: 'Eka Ayu Titik' },
    ];

    // ================= STORAGE =================
    const STORAGE_KEY = 'kuliahTasks';
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveTasks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // ================= DROPDOWN =================
    function populateCourseDropdown() {
        const select = document.getElementById('task-course');
        select.innerHTML = '<option value="">-- Pilih Mata Kuliah --</option>';

        DaftarMataKuliah.forEach(mk => {
            const option = document.createElement('option');
            option.value = mk.nama;
            option.textContent = `${mk.nama} (${mk.dosen})`;
            select.appendChild(option);
        });
    }

    // ================= RENDER TASK =================
    function renderTasks(filter = 'todo') {
        const body = document.getElementById('tasks-body');
        body.innerHTML = '';

        let filteredTasks = tasks;
        if (filter === 'todo') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        filteredTasks.forEach(task => {
            const row = body.insertRow();
            const now = new Date();
            const deadline = new Date(task.deadline);

            let deadlineClass = '';
            let deadlineText = deadline.toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            if (!task.completed && deadline < now) {
                deadlineClass = 'warning-red';
                deadlineText = `⚠ DEADLINE: ${deadlineText}`;
            } else if (!task.completed && (deadline - now) <= 24 * 60 * 60 * 1000) {
                deadlineClass = 'warning-yellow';
                deadlineText = `⏰ MENDESAK:(H-1): ${deadlineText}`;
            }

            row.insertCell(0).innerHTML =
                `<span class="${task.completed ? 'completed-task' : ''}">${task.name}</span>`;
            row.insertCell(1).textContent = task.course;
            row.insertCell(2).innerHTML =
                `<span class="${deadlineClass}">${deadlineText}</span>`;
            row.insertCell(3).innerHTML =
                `<input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>`;
            row.insertCell(4).innerHTML =
                `<button data-id="${task.id}">Hapus</button>`;
        });

        document.querySelectorAll('#tasks-body input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', toggleTaskCompletion);
        });

        document.querySelectorAll('#tasks-body button').forEach(btn => {
            btn.addEventListener('click', () => deleteTask(btn.dataset.id));
        });
    }

    // ================= CRUD =================
    document.getElementById('task-form').addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('task-name').value;
        const course = document.getElementById('task-course').value;
        const deadline = document.getElementById('task-deadline').value;

        const newTask = {
            id: Date.now().toString(),
            name,
            course,
            deadline,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks(document.getElementById('filter-status').value);
        e.target.reset();
    });

    function toggleTaskCompletion(e) {
        const task = tasks.find(t => t.id === e.target.dataset.id);
        if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks(document.getElementById('filter-status').value);
        }
    }

    function deleteTask(id) {
        if (confirm('Hapus tugas ini?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks(document.getElementById('filter-status').value);
        }
    }

    // ================= FILTER =================
    document.getElementById('filter-status').addEventListener('change', e => {
        renderTasks(e.target.value);
    });

    // ================= INIT =================
    populateCourseDropdown();
    renderTasks('todo');

});// =====================================
// GREETING + HARI, TANGGAL, JAM REALTIME
// =====================================
function updateGreetingDateTime() {
    const now = new Date();
    const jamSekarang = now.getHours();

    // Tentukan greeting
    let greetingText = "";
    if (jamSekarang >= 5 && jamSekarang < 11) {
        greetingText = "Selamat Pagi 👋";
    } else if (jamSekarang >= 11 && jamSekarang < 15) {
        greetingText = "Selamat Siang 👋";
    } else if (jamSekarang >= 15 && jamSekarang < 18) {
        greetingText = "Selamat Sore Bosque 👋";
    } else {
        greetingText = "Selamat Malam Bosque 🌙";
    }

    // Hari & tanggal
    const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Jam
    const jam = now.toLocaleTimeString("id-ID");

    // Tampilkan ke HTML
    const greetingEl = document.getElementById("greeting");
    const dateTimeEl = document.getElementById("tanggal-hari-jam");

    if (greetingEl && dateTimeEl) {
        greetingEl.textContent = greetingText;
        dateTimeEl.textContent = `${hari}, ${tanggal} | ${jam} WIB`;
    }
}

// Jalankan pertama kali
updateGreetingDateTime();

// Update tiap 1 detik
setInterval(updateGreetingDateTime, 1000);
