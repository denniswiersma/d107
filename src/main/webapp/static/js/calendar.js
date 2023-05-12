async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

const myTimeFormat = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    meridiem: false
}
// const groupFullNames = {
//     "BFV1": "Bioinformatics Year 1",
//     "BFV2": "Bioinformatics Year 2",
//     "BFV3": "Bioinformatics Year 3",
//     "BFV3 gr1": "Bioinformatics Minor HTHPC",
//     "BFV3 gr2": "Bioinformatics Minor Application Design>",
//     "BFVB3": "Minor Bioinformatics for the Life Sciences",
//     "DSLSR": "Master Data Science for Life Sciences",
// }
const roomNames = {
    10017: "ZP11/D1.07",
    10018: "ZP11/D1.08",
    10033: "ZP11/H1.122",
    10034: "ZP11/H1.86",
};

$(document).ready(async function () {
    // Fetch calendar events/items
    // const allItems = await fetchJSON("/api/get-all-calendar-items");
    const onlyCoolRoomsItems = await fetchJSON("/api/get-only-cool-rooms-calendar-items/");

    // Create calendar
    let calendarEl;
    let calendar;
    calendarEl = document.getElementById("calendar");
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        weekends: false,
        allDaySlot: false,
        nowIndicator: true,
        slotMinTime: "08:30:00",
        slotMaxTime: "20:00:00",
        buttonText: {today: "Current Week"},
        titleFormat: "{{dd MMMM yyyy}} '(Week 'WW')'",
        dayHeaderFormat: "EEE dd/MM",
        slotLabelFormat: myTimeFormat,
        eventTimeFormat: myTimeFormat,
        validRange: onlyCoolRoomsItems.dateRange,
        headerToolbar: {
            left: "",
            center: "title",
            right: "today prev,next"
        },
        events: onlyCoolRoomsItems.items,
        eventColor: "#6339cc",
        eventDidMount: function(arg) {
            // Collect current event element
            let contentsEl = arg.el.querySelector(".fc-event-title-container");

            // Create and append event group
            let groupEl = document.createElement("div")
            groupEl.classList.add("event-group");
            groupEl.innerHTML = arg.event.extendedProps.group;
            contentsEl.appendChild(groupEl);

            // Create and append event lecturers
            let lecturersDivEl = document.createElement("div");
            lecturersDivEl.classList.add("event-lecturers");
            arg.event.extendedProps.lecturers.forEach( function(lecturer) {
                let lecturerEl = document.createElement("i");
                lecturerEl.innerHTML = lecturer;
                lecturersDivEl.appendChild(lecturerEl);
            });
            contentsEl.appendChild(lecturersDivEl);
        }
    })
    calendar.render();

    // Create room selection element and add change listener
    const roomSelect = document.createElement("select");
    roomSelect.id = "room-select";
    roomSelect.addEventListener("change", () => {
        const selectedRoom = roomSelect.value;
        calendar.getEvents().forEach(calendarEvent => {
            let eventRooms = calendarEvent.extendedProps.rooms.map(roomInt => roomInt.toString());
            if (eventRooms.includes(selectedRoom)) {
                calendarEvent.setProp("display", "auto");
            } else {
                calendarEvent.setProp("display", "none");
            }
        });
    });

    // Add an option for each room
    for (const [roomId, roomName] of Object.entries(roomNames)) {
        const option = document.createElement("option");
        option.textContent = roomName;
        option.value = roomId;
        roomSelect.appendChild(option);
    }

    // Add the roomSelect element to the left div of the header toolbar
    const headerToolbar = calendarEl.firstChild;
    headerToolbar.firstChild.appendChild(roomSelect);
    // Trigger filter for page load
    roomSelect.dispatchEvent(new Event("change"));

    // Set the last update time
    $("#last-update-time")[0].innerHTML = luxon.DateTime.fromISO(onlyCoolRoomsItems.gatherDate).toFormat("dd MMMM yyyy 'at' HH:mm:ss");
});
