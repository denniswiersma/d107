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
    return date.toISOString().split('.', 1)[0];
}

function getDateRange() {
    // Monday of current week
    let start = setToMonday(new Date());
    start.setHours(2, 0, 0, 0);
    // Monday 4 weeks from now
    let end = new Date(start);
    end.setDate(end.getDate() + 4 * 7);
    // Return UTC strings
    return [toUTCString(start), toUTCString(end)];
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
        rangeStart: getDateRange()[0],
        rangeEnd: getDateRange()[1],
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

function createCleanObject(item) {
    return {
        title: item["Name"],
        start: item["Start"],
        end: item["End"],
        group: item["Subgroups"][0].Name,
        // groups: item["Subgroups"].map(({Name}) => Name),
        rooms: item["Rooms"].map(({Id}) => Id),
        lecturers: item["Lecturers"].map(entry => (`${entry['Description'].replace(/(, )$/, "")} (${entry['Code']})`)),
    }
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
    BFV1: {year: 1, id: "8446"}, // Year 1
    BFV2: {year: 2, id: "8445"}, // Year 2
    BFV3: {year: 3, id: "8451"}, // Year 3
    BFVB3: {year: 3, id: "7851"}, // Minor Bio-Informatica
    DSLSR: {year: 1, id: "8286"}, // Master Data Science for Life Sciences
};
let allItems = [];
let itemsByRoom = {
    10017: [],
    10018: [],
    10033: [],
    10034: [],
};

$.each(await getAllDataForGroups(groupList), function (index, item) {
    let cleanItem = createCleanObject(item);
    allItems.push(cleanItem);

    // Sort and filter on our 'cool' rooms
    cleanItem.rooms.map( roomId => {
        if (Object.keys(itemsByRoom).includes(roomId.toString())) {
            itemsByRoom[roomId].push(cleanItem);
        }
    });
});

let timeNow = new Date();timeNow.setHours(timeNow.getHours() + 2);
download(JSON.stringify({gatherDate: toUTCString(timeNow), items: allItems}), "all-items.json", 'text/plain');
download(JSON.stringify({gatherDate: toUTCString(timeNow), items: itemsByRoom}), "items-by-room.json", 'text/plain');
