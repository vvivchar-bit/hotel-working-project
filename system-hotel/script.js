let rooms = [
    {
        number: 101,
        type: "Стандарт",
        price: 900,
        status: "Вільний"
    },
    {
        number: 102,
        type: "Стандарт",
        price: 900,
        status: "Заброньований"
    },
    {
        number: 201,
        type: "Люкс",
        price: 1800,
        status: "Вільний"
    },
    {
        number: 202,
        type: "Люкс",
        price: 1800,
        status: "Зайнятий"
    },
    {
        number: 301,
        type: "Сімейний",
        price: 1400,
        status: "Вільний"
    },
    {
        number: 302,
        type: "Сімейний",
        price: 1400,
        status: "Заброньований"
    }
];

let bookings = [];

const savedRooms = localStorage.getItem("hotelRooms");
const savedBookings = localStorage.getItem("hotelBookings");

if (savedRooms) {
    rooms = JSON.parse(savedRooms);
}

if (savedBookings) {
    bookings = JSON.parse(savedBookings);
}

const roomsList = document.getElementById("roomsList");
const bookingsList = document.getElementById("bookingsList");
const bookingForm = document.getElementById("bookingForm");
const statistics = document.getElementById("statistics");

function saveData() {
    localStorage.setItem("hotelRooms", JSON.stringify(rooms));
    localStorage.setItem("hotelBookings", JSON.stringify(bookings));
}

function getStatusClass(status) {
    if (status === "Вільний") {
        return "status-free";
    }

    if (status === "Заброньований") {
        return "status-booked";
    }

    return "status-busy";
}

function renderStatistics() {
    const totalRooms = rooms.length;
    const freeRooms = rooms.filter(room => room.status === "Вільний").length;
    const bookedRooms = rooms.filter(room => room.status === "Заброньований").length;
    const busyRooms = rooms.filter(room => room.status === "Зайнятий").length;
    const totalBookings = bookings.length;

    statistics.innerHTML = `
        <div class="stat-card">
            <h3>Усього номерів</h3>
            <p>${totalRooms}</p>
        </div>
        <div class="stat-card">
            <h3>Вільні</h3>
            <p>${freeRooms}</p>
        </div>
        <div class="stat-card">
            <h3>Заброньовані</h3>
            <p>${bookedRooms}</p>
        </div>
        <div class="stat-card">
            <h3>Зайняті</h3>
            <p>${busyRooms}</p>
        </div>
        <div class="stat-card">
            <h3>Бронювання</h3>
            <p>${totalBookings}</p>
        </div>
    `;
}

function renderRooms(roomArray) {
    roomsList.innerHTML = "";

    if (roomArray.length === 0) {
        roomsList.innerHTML = "<p>Номерів за заданими параметрами не знайдено.</p>";
        return;
    }

    roomArray.forEach(room => {
        const roomCard = document.createElement("div");
        roomCard.className = "room-card";

        roomCard.innerHTML = `
            <h3>Номер ${room.number}</h3>
            <p><strong>Тип:</strong> ${room.type}</p>
            <p><strong>Ціна:</strong> ${room.price} грн/доба</p>
            <p><strong>Статус:</strong> 
                <span class="${getStatusClass(room.status)}">${room.status}</span>
            </p>
        `;

        roomsList.appendChild(roomCard);
    });
}

function renderBookings() {
    bookingsList.innerHTML = "";

    if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>Поки що бронювань немає.</p>";
        return;
    }

    bookings.forEach((booking, index) => {
        const bookingItem = document.createElement("div");
        bookingItem.className = "booking-item";

        bookingItem.innerHTML = `
            <p><strong>Клієнт:</strong> ${booking.clientName}</p>
            <p><strong>Телефон:</strong> ${booking.clientPhone}</p>
            <p><strong>Email:</strong> ${booking.clientEmail}</p>
            <p><strong>Номер:</strong> ${booking.roomNumber}</p>
            <p><strong>Дата заїзду:</strong> ${booking.checkInDate}</p>
            <p><strong>Дата виїзду:</strong> ${booking.checkOutDate}</p>
            <p><strong>Дата бронювання:</strong> ${booking.date}</p>
            <button class="cancel-button" onclick="cancelBooking(${index})">Скасувати бронювання</button>
        `;

        bookingsList.appendChild(bookingItem);
    });
}

function filterRooms() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const statusValue = document.getElementById("statusFilter").value;

    const filteredRooms = rooms.filter(room => {
        const matchesType = room.type.toLowerCase().includes(searchValue);
        const matchesStatus = statusValue === "all" || room.status === statusValue;

        return matchesType && matchesStatus;
    });

    renderRooms(filteredRooms);
}

function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "all";

    renderRooms(rooms);
}

function cancelBooking(index) {
    const booking = bookings[index];
    const room = rooms.find(item => item.number === booking.roomNumber);

    if (room) {
        room.status = "Вільний";
    }

    bookings.splice(index, 1);
    saveData();
    renderRooms(rooms);
    renderBookings();
    renderStatistics();

    alert("Бронювання скасовано.");
}

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const clientName = document.getElementById("clientName").value.trim();
    const clientPhone = document.getElementById("clientPhone").value.trim();
    const clientEmail = document.getElementById("clientEmail").value.trim();
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const roomNumber = Number(document.getElementById("roomNumber").value);

    if (checkOutDate <= checkInDate) {
        alert("Дата виїзду повинна бути пізніше дати заїзду.");
        return;
    }

    const room = rooms.find(item => item.number === roomNumber);

    if (!room) {
        alert("Номер з таким номером кімнати не знайдено.");
        return;
    }

    if (room.status !== "Вільний") {
        alert("Цей номер недоступний для бронювання.");
        return;
    }

    room.status = "Заброньований";

    const booking = {
        clientName: clientName,
        clientPhone: clientPhone,
        clientEmail: clientEmail,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomNumber: roomNumber,
        date: new Date().toLocaleDateString("uk-UA")
    };

    bookings.push(booking);
    saveData();

    bookingForm.reset();

    renderRooms(rooms);
    renderBookings();
    renderStatistics();

    alert("Номер успішно заброньовано.");
});

renderRooms(rooms);
renderBookings();
renderStatistics();