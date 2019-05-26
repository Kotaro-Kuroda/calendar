const ls = localStorage
const date = ls["date"]
console.log(date)
const time = document.getElementById("time")
const addButton = document.getElementById("add")
let timeHtml = ""
let scheduleHtml = ""

let timeString = ""

timeHtml += "<table rules='cols' id='timetable'>"

for(let i = 0; i < 96; i++) {
    const j = i.toString()
    if (i % 4 == 0) {
        if(i >= 0 && i < 10) {
        timeString = "&nbsp&nbsp" + (i / 4) .toString() + ":" + "00"
        }
        else {
        timeString = (i / 4).toString() + ":" + "00"
        }

        timeHtml += "<tr>" + "<td class='timetd'>" + timeString + "</td>" + "<td class='schedule' id=" + j + ">" + "<hr>" + "</td>" + "</tr>"
    } else {
        timeHtml += "<tr>" + "<td class='timetd'>" + "</td>" + "<td class='schedule' id=" + j + ">" + "</td>" + "</tr>"
    }
    
}

timeHtml += "<tr>" + "<td class='timetd'>" + "&nbsp&nbsp" + "0:00" + "</td>" + "<td class='schedule'>" + "<hr>" + "</td>" + "</tr>"
timeHtml += "</table>"
time.innerHTML = timeHtml

function intHour(str) {
    const strHour = str[0] + str[1]
    return +strHour
}

function intMinute(str) {
    const strMinute = str[3] + str[4]
    return +strMinute
}

function getIndex(hour, minute) {
    index = 0
    if (minute >= 0 && minute <= 7.5) {
        index = hour * 4
    } else if (minute > 7.5 && minute <= 22.5) {
        index = hour * 4 + 1
    } else if (minute > 22.5 && minute <= 37.5) {
        index = hour * 4 + 2
    } else if (minute > 37.5 && minute <= 52.5) {
        index = hour * 4 + 3
    } else {
        index = (hour + 1) * 4
    }

    return index
}


const oneday = document.getElementById("oneday")
oneday.textContent = date
addButton.addEventListener("click", ()=>{
    window.open('schedule.html', 'mywindow2', 'width=350, height=200, menubar=no, toolbar=no, scrollbars=yes')
})

const startTime = ls[date + "startTime"]
const endTime = ls[date + "endTime"]
const startHour = intHour(startTime)
const startMinute = intMinute(startTime)

const endHour = intHour(endTime)
const endMinute = intMinute(endTime)

const startIndex = getIndex(startHour, startMinute)
const endIndex = getIndex(endHour, endMinute)

const startId = document.getElementById(startIndex.toString())
startId.innerHTML = ls[date + "event"]
for (let i = startIndex; i < endIndex + 1; i++) {
    const scheduleId = document.getElementById(i.toString())
    scheduleId.classList.add("active")
}
