// Made by Vincent Talen
// Use Digirooster API to get all items for BIN classes

// ===============================================================
// ======================== FUNCTIONS ============================
// ===============================================================
function setToMonday(date) {
    let day = date.getDay() || 7;
    if (day !== 1)
        date.setHours(-24 * (day - 1));
    return date;
}

function toUTCString(date) {
    return date.toISOString().split(".", 1)[0];
}

function getDateRange() {
    // Monday of past week
    let start = setToMonday(new Date());
    start.setHours(2, 0, 0, 0);
    start.setDate(start.getDate() - 7)
    // Monday x amount of weeks from now
    let end = new Date(start);
    end.setDate(end.getDate() + amountOfWeeks * 7);
    // Return UTC strings
    return {start: toUTCString(start), end: toUTCString(end)};
}

async function doRequest(requestUrl, requestData) {
    return $.ajax({
        url: requestUrl,
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(requestData),
    });
}

async function getAllDataForGroups(groups) {
    // Basic request information
    const baseURL = "https://digirooster.hanze.nl/API/Schedule/Group/";
    const requestData = {
        sources: ["2", "1"],
        schoolId: "14",
        rangeStart: getDateRange().start,
        rangeEnd: getDateRange().end,
        storeSelection: true,
        includePersonal: false,
        includeConnectingRoomInfo: true
    };

    // Request items for each group and add to allItems
    let allItems = [];
    await Promise.all(Object.values(groups).map(async (groupInfo) => {
        // Prepare request URL and data
        let requestUrl = baseURL + groupInfo["id"];
        requestData.year = groupInfo["year"];
        // Perform request and add items to allItems
        const groupsItems = await doRequest(requestUrl, requestData);
        allItems.push(...groupsItems);
    }));
    return allItems;
}

function createFullcalendarEventObject(item) {
    return {
        title: item["Name"],
        start: item["Start"],
        end: item["End"],
        extendedProps: {
            groups: item["Subgroups"].map(({Name}) => Name),
            rooms: item["Rooms"].map(({Id}) => Id),
            lecturers: item["Lecturers"].map(entry => (`${entry["Description"].replace(/(, )$/, "")} (${entry["Code"]})`)),
        },
    }
}

function createResponseObject(eventItems) {
    let timeNow = new Date();
    timeNow.setHours(timeNow.getHours() + 2);
    return {
        gatherDate: toUTCString(timeNow),
        dateRange: getDateRange(),
        items: eventItems
    };
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// ===============================================================
// ========================= MAIN ================================
// ===============================================================
const groupList = {
    BFV1: {year: 1, id: "10763"}, // Year 1
    BFV2: {year: 2, id: "10762"}, // Year 2
    BFV3: {year: 3, id: "10768"}, // Year 3
    BFVB3: {year: 3, id: "10197"}, // Minor Bio-Informatica
    BFVF3: {year: 3, id: "10143"}, // ???
    DSLSR: {year: 1, id: "10627"}, // Master Data Science for Life Sciences
};
const coolRooms = [11367, 11368, 11388, 11398, 11399];
//                 D1.07, D1.08, H1.122,H1.86, H1.88A

let allItems = [];
let onlyCoolRooms = [];
let amountOfWeeks = 8;

$.each(await getAllDataForGroups(groupList), function (index, item) {
    let cleanItem = createFullcalendarEventObject(item);
    allItems.push(cleanItem);

    // Filter our 'cool' rooms
    if ( coolRooms.some(coolRoom => cleanItem.extendedProps.rooms.includes(coolRoom)) ) {
        onlyCoolRooms.push(cleanItem);
    }
});

// download(JSON.stringify(createResponseObject(allItems)), "all-items.json", "text/plain");
download(JSON.stringify(createResponseObject(onlyCoolRooms)), "only-cool-rooms.json", "text/plain");
