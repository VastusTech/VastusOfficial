export function convertFromISO(dateTime) {
    let dateTimeString = String(dateTime);
    let date = new Date(dateTimeString);
    const hourInt = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const minutes = date.getMinutes().toString().length === 1 ? '0'+ date.getMinutes() : date.getMinutes(),
        hours = hourInt.toString().length === 1 ? '0'+ hourInt : hourInt,
        ampm = date.getHours() >= 12 ? 'PM' : 'AM',
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[date.getDay()]+', '+months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()+' '+hours+':'+minutes+ampm;
}

export function convertFromIntervalISO(dateTime) {
    let dateTimeString = String(dateTime);
    let dateTimes = String(dateTimeString).split("_");
    let fromDateString = dateTimes[0];
    let toDateString = dateTimes[1];
    let fromDate = new Date(fromDateString);
    let toDate = new Date(toDateString);

    // Display time logic came from stack over flow
    // https://stackoverflow.com/a/18537115
    const fromHourInt = fromDate.getHours() > 12 ? fromDate.getHours() - 12 : fromDate.getHours();
    const toHourInt = toDate.getHours() > 12 ? toDate.getHours() - 12 : toDate.getHours();
    const fromminutes = fromDate.getMinutes().toString().length === 1 ? '0'+ fromDate.getMinutes() : fromDate.getMinutes(),
        fromhours = fromHourInt.toString().length === 1 ? '0'+ fromHourInt : fromHourInt,
        fromampm = fromDate.getHours() >= 12 ? 'PM' : 'AM',
        tominutes = toDate.getMinutes().toString().length === 1 ? '0'+ toDate.getMinutes() : toDate.getMinutes(),
        tohours = toHourInt.toString().length === 1 ? '0'+ toHourInt : toHourInt,
        toampm = toDate.getHours() >= 12 ? 'PM' : 'AM',
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[fromDate.getDay()]+', '+months[fromDate.getMonth()]+' '+fromDate.getDate()+', '+fromDate.getFullYear()+' '+fromhours+':'+fromminutes+fromampm + ' - '+tohours+':'+tominutes+toampm;
}

function convertTime(time) {
    if (parseInt(time, 10) > 12) {
        return "0" + (parseInt(time, 10) - 12) + time.substr(2, 3) + "pm";
    }
    else if (parseInt(time, 10) === 12) {
        return time + "pm";
    }
    else if (parseInt(time, 10) === 0) {
        return "0" + (parseInt(time, 10) + 12) + time.substr(2, 3) + "am"
    }
    else {
        return time + "am"
    }
}

function convertDate(date) {
    let dateString = String(date);
    let year = dateString.substr(0, 4);
    let month = dateString.substr(5, 2);
    let day = dateString.substr(8, 2);

    return month + "/" + day + "/" + year;
}
