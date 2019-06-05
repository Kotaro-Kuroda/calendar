const weeks = ['日', '月', '火', '水', '木', '金', '土'] //曜日のリスト
const date = new Date() //今日の日付
let year = date.getFullYear() //年
let month = date.getMonth() + 1 //月
let day = date.getDate()
const calendar = document.getElementById("calendar") //idがcalendarのdiv
const prev = document.getElementById("prev") //idがprevのボタン
const next = document.getElementById("next") //idがnextのボタン
const yearButton = document.getElementById("year") //idがyearのボタン
const monthButton = document.getElementById("month") //idがmonthのボタン
const todayButton = document.getElementById("today") //idがtodayのボタン
const dayButton = document.getElementById("dayButton")
const time = document.getElementById("time")
const addButton = document.getElementById("add")
const box = document.getElementById("box")
let referingDay = displayDate(date)
const config = {
    show: 1,
    unit: "month"
} //表示する月の数

const ls = localStorage //ローカルストレージ
let nowdate = ""
//カレンダーを表示する関数
function showCalendar(year, month) {
    for (let i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('section')
        sec.innerHTML = calendarHtml
        calendar.appendChild(sec)
        month++
        if (month > 12) {
            year++
            month = 1
        }
    }

}

//毎日0:00にリロードする関数
window.onload = function()
{
    const Time = new Date()
    const nextDate = new Date(Time.getFullYear(), Time.getMonth(), Time.getDate() + 1)
    Rest = nextDate - Time //ここがその残り時間(ミリ秒)を計算する処理
    console.log(Rest)
    setTimeout("location.reload()", Rest)
};
 
//表示されているカレンダーを消去する関数
function reset() {
    calendar.innerHTML = ""
    time.innerHTML = ""
    box.innerHTML = ""
}

//カレンダーを作成する関数
function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    const currentMonth = currentTime.getMonth() + 1
    const currentDate = currentTime.getDate()
    calendarHtml += '<center>'
    calendarHtml += "<table align='center' class='calendar'>"
    calendarHtml += '<caption>' + year  + '/' + month + '</caption>'

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td class="week">' + weeks[i] + '</td>'
    }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr class="table">'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
                dayCount++
            } else {
                if (year == currentYear && month == currentMonth && dayCount == currentDate){
                    calendarHtml += `<td class="today_td" data-date="${displayDate(new Date(year, month - 1, dayCount))}">${dayCount}</td>`                    
                } else {
                    calendarHtml += `<td class="calendar_td" data-date="${displayDate(new Date(year, month - 1, dayCount))}">${dayCount}</td>`
                }
                
                dayCount++
            }
        }
        calendarHtml += '</tr>'
    }
    calendarHtml += '</table>'
    calendarHtml += '</center>'
    return calendarHtml
}

//日単位のスケジュール表を作成
function createDateSchedule(date) {
    let timeHtml = ""    
    timeHtml += "<center>"
    timeHtml += `<h1>${date}</h1>`
    timeHtml += "<table rules='cols' id='timetable'>"
    for(let i = 0; i < 97; i++) {
        const j = i.toString()
        if (i == 96) {
                timeHtml += "<tr>" + "<td class='timetd'>" + "&nbsp&nbsp" + "0:00" + "</td>" + "<td class='schedule' id=" + date + j + ">" + "<hr>" + "</td>" + "</tr>"
        } else {
            if (i % 4 == 0) {
            if(i >= 0 && i < 40) {
                timeString = "&nbsp&nbsp" + (i / 4) .toString() + ":" + "00"
            }
            else {
                timeString = (i / 4).toString() + ":" + "00"
            }

            timeHtml += "<tr>" + "<td class='timetd'>" + timeString + "</td>" + "<td class='schedule' id=" + date + j + ">" + "<hr>" + "</td>" + "</tr>"
            } else {
                timeHtml += "<tr>" + "<td class='timetd'>" + "</td>" + "<td class='schedule' id=" + date + j + ">" + "</td>" + "</tr>"
            }
        }
        
        
    }

    timeHtml += "</table>"
    timeHtml += "</center>"
    time.innerHTML = timeHtml
}

//前の月のカレンダーや次の月のカレンダーを表示させる関数
function moveCalendar(e) {
    calendar.innerHTML = ''    
    if (config.unit == "year") {
        if (e.target.id === 'prev') {
            year--
        } else if (e.target.id === 'next') {
            year++
        }
        displayByYear()
    } else if (config.unit == "month") {
        if (e.target.id === 'prev') {
            month--
            if (month < 1) {
                year--
                month = 12
            }
        }
        if (e.target.id === 'next') {
            month++
            if (month > 12) {
                year++
                month = 1
            }
        }
        displayByMonth()
    } else if (config.unit == "date") {
        if (e.target.id == 'prev') {
            day--
            if (day <= 0) {
                day = new Date(year, month - 1, 0).getDate()
                month--
            }
        } else if (e.target.id == 'next') {
            day++
            const lastDate = new Date(year, month, 0).getDate()
            if (day > lastDate) {
                day = 1
                month++
            } 
        }
        const displayday = new Date(year, month - 1, day)
        displayByDate(displayDate(displayday))
    }  
}

//今日のカレンダーを表示させる関数
function displayToday() {
    const today = new Date()
    year = today.getFullYear()
    month = today.getMonth() + 1
    day = today.getDate()
    if (config.unit == "year") {
        displayByYear()
    } else if (config.unit == "month") {
        displayByMonth()
    } else if (config.unit == "date") {
        const today = displayDate(date)
        displayByDate(today)
    }
}

//カレンダーを年表示させる関数
function displayByYear() {
    yearButton.classList.add("active")
    monthButton.classList.remove("active")
    dayButton.classList.remove("active")
    config.unit = "year"
    config.show = 12
    reset()
    showCalendar(year, 1)

    const table = document.getElementsByTagName("table")
    for (let i = 0, len = table.length; i < len; i++) {
        table[i].classList.add("year")
    }

    const td = document.getElementsByTagName("td")
    for (let i = 0, len = td.length; i < len; i++) {
        td[i].classList.add("yeartd")
    }
}

//カレンダーを月表示させる関数
function displayByMonth() {
    yearButton.classList.remove("active")
    monthButton.classList.add("active")
    dayButton.classList.remove("active")
    config.unit = "month"
    config.show = 1
    reset()
    showCalendar(year, month)
}

//カレンダーを日単位で表示
function displayByDate(d) {
    referingDay = d
    year = getYear(d)
    month = getMonth(d)
    day = getDate(d)
    config.unit = "date"
    config.show = 1
    yearButton.classList.remove("active")
    monthButton.classList.remove("active")
    dayButton.classList.add("active")
    reset()
    createDateSchedule(d)
    showCalendar(getYear(d), getMonth(d))
    const table = document.getElementsByTagName("table")
    for (let i = 0, len = table.length; i < len; i++) {
        table[i].classList.add("small")
    }

    const td = document.getElementsByTagName("td")
    for (let i = 0, len = td.length; i < len; i++) {
        td[i].classList.add("yeartd")
    }
    const tdList = document.getElementsByClassName("calendar_td")
    for (let i = 0, len = tdList.length; i < len; i++) {
        if (tdList[i].dataset.date == d) {
            tdList[i].classList.add("ref")
        }
    }
    const json = ls["schedule"] || "[]"
    const list = JSON.parse(json)
    updateview(list)
}

//予定開始時刻の時間を取得
function intHour(str) {
    const strHour = str[0] + str[1]
    return +strHour
}

//予定開始時刻の分を取得
function intMinute(str) {
    const strMinute = str[3] + str[4]
    return +strMinute
}

function getIndex(hour, minute) {
    index = 0
    if (hour == 23) {
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
    } else {
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
    }
    

    return index
}

//前の月を表示
prev.addEventListener('click', moveCalendar)

//次の月を表示
next.addEventListener('click', moveCalendar)



//日をダブルクリックするとその日のサブウィンドウが表示
document.addEventListener("dblclick", function(e) {
    if(e.target.classList.contains("calendar_td") || e.target.classList.contains("today_td")) {
        year = getYear(nowdate)
        month = getMonth(nowdate)
        day = getDate(nowdate)
        nowdate = e.target.dataset.date
        displayByDate(nowdate)
    }
})

//年表示
yearButton.addEventListener('click', () => {
    displayByYear()
})

//月表示
monthButton.addEventListener('click', () => {
    displayByMonth()
})

//今日を表示
todayButton.addEventListener("click", () => {
    displayToday()
})



//日付を取得
function displayDate(day){
    const year2 = day.getFullYear()
    const month2 = day.getMonth() + 1
    const date2 = day.getDate()

    if (month2 < 10 && date2 < 10) {
        return year2 + "/" + "0" + month2 + "/" + "0" + date2
    } else if (month < 10 && date2 >= 10) {
        return year2 + "/" + "0" + month2 + "/" + date2
    } else if (month2 >= 10 && date2 < 10) {
        return year2 + "/" + month2 + "/" + "0" + date2
    } else {
        return year2 + "/" + month2 + "/" + date2
    }
}

dayButton.addEventListener("click", ()=>{
    const day = displayDate(new Date())
    displayByDate(day)
    //window.open('date.html', 'mywindow1', 'width=400, height=600, menubar=no, toolbar=no, scrollbars=yes')
})
//年を取得
function getYear(str) {
    let year = ""
    for (let i = 0; i < 4; i ++) {
        year += str[i]
    }

    return +year
}

//月を取得
function getMonth(str) {
    const month = str[5] + str[6]
    return +month
}

//日を取得
function getDate(str) {
    const day = str[8] + str[9]
    return +day
}

//イベント作成画面を表示
function createEvent() {
    let eventHtml = ""
    eventHtml +=  "<div id='eventBox'>" + "<span>イベント名</span>:<input id='event' type='text' name='event'>" +
        "<br>" +
        "<span>開始時刻</span>:<input id='startdate' type='date' name='startdate'><input id='startTime' type='time' name='startTime'>" +
        "<br>" +
        "<span>終了時刻</span>:<input  id='enddate' type='date' name='enddate'><input id='endTime' type='time' name='endTime'>" +
        "<br>" +
        "<span>場所</span>:<input  type='text' name='place' id='place'>" +
        "<br>" +
        "</div>" +
        "<br>" +
        "<button id='complete' onclick='completeButton()' >完了</button>"

    box.innerHTML = eventHtml
}

//時刻を取得
function getTime(hour, minute) {
    if (hour >= 24) {
        hour = hour - 24
    }
    if (hour < 10 && minute < 10) {
        return "0" + hour + ":" + "0" + minute
    } else if (hour < 10 && minute >= 10) {
        return "0" + hour + ":" + minute
    } else if (hour >= 10 && minute < 10) {
        return hour + ":" + "0" + minute
    } else {
        return hour + ":" + minute
    }
}

let startDate = 0
let endDate = 0
let startTime = 0
let endTime = 0
//イベントを作成
function addEvent() {
    createEvent()
    const startDateForm = document.getElementById("startdate")
    const endDateForm = document.getElementById("enddate")
    const startTimeForm = document.getElementById("startTime")
    const endTimeForm = document.getElementById("endTime")
    startDateForm.value = referingDay.replace(/\//g, "-")
    endDateForm.value = referingDay.replace(/\//g, "-")
    startTimeForm.value = getTime(date.getHours(), date.getMinutes())
    endTimeForm.value = getTime(intHour(startTimeForm.value) + 1, intMinute(startTimeForm.value))
    startDate = startDateForm.value
    endDate = endDateForm.value
    startTime = startTimeForm.value
    endTime = endTimeForm.value
    startTimeForm.addEventListener("change", () => {
        const start = startTimeForm.value
        const hour = intHour(start)
        const minute = intMinute(start)
        endTimeForm.value = getTime(hour + 1, minute)
    })
}

addButton.addEventListener("click", () => {
    displayByDate(referingDay)
    addEvent()
    //window.open('schedule.html?date=' + encodeURIComponent(referingDay), 'mywindow1', 'width=400, height=600, menubar=no, toolbar=no, scrollbars=yes')
})


time.addEventListener("click", (e)=>{
    if(e.target.classList.contains("delete")){
        const result = confirm("削除してよろしいですか？")
        if (result) {
            deleteSchedule(e.target.dataset.index)
        }
    }
})

//スケジュールをカレンダーに反映させる関数
function completeButton() {
    const eventNameForm = document.getElementById("event")
    const placeForm = document.getElementById("place")
    const startDateForm = document.getElementById("startdate")
    const endDateForm = document.getElementById("enddate")
    const startTimeForm = document.getElementById("startTime")
    const endTimeForm = document.getElementById("endTime")
    const startDate = startDateForm.value
    const endDate = endDateForm.value
    const startTime = startTimeForm.value
    const endTime = endTimeForm.value
    const eventName = eventNameForm.value
    const place = placeForm.value
    if (eventName == null || eventName == "" || /^\s*$/.test(eventName)) {
        alert("イベント名を入力してください")
    } else {
        const scheduleList = [startDate, endDate, startTime, endTime, eventName, place]
        const json = ls["schedule"] || "[]"
        const list = JSON.parse(json)
        list.push(scheduleList)
        const newJson = JSON.stringify(list);
        ls["schedule"] = newJson;
        updateview(list)
        displayByDate(startDate.replace(/\-/g, "/"))
    }
}

const deleteSchedule = (index)=>{
    const json = ls["schedule"] || "[]"
    const list = JSON.parse(json);
    list.splice(index, 1)
    const newJson = JSON.stringify(list);
    ls["schedule"] = newJson;
    displayByDate(referingDay)
}


function updateview(list) {
    list.forEach((a, index) => {
        const startDate = a[0]
        const endDate = a[1]
        if (a[0].replace(/\-/g, "/") == referingDay) {
            const startTime = a[2]
            const endTime = a[3]
            const eventName = a[4]
            const place = a[5]
            const startHour = intHour(startTime)
            const startMinute = intMinute(startTime)
            const endHour = intHour(endTime)
            const endMinute = intMinute(endTime)
            const startIndex = getIndex(startHour, startMinute)
            if (a[0] == a[1]) {
                console.log("same")
                console.log(a)
                const endIndex = getIndex(endHour, endMinute)
                const startId = document.getElementById(startDate.replace(/\-/g, "/") + startIndex.toString())
                const endId = document.getElementById(endDate.replace(/\-/g, "/") + endIndex.toString())
                startId.innerHTML = startTime + "<button class='delete' data-index=" + index + ">削除</button>"
                for (let i = startIndex; i < endIndex + 1; i++) {
                    const scheduleId = document.getElementById(startDate.replace(/\-/g, "/") + i.toString())
                    if (i == Math.floor((endIndex + startIndex) / 2)) {    
                        scheduleId.innerHTML += eventName 
                    }
                    scheduleId.classList.add("active")
                    box.innerHTML = ""
                }
            } else {
                list.splice(index, 1)
                const scheduleList = [startDate, startDate, startTime, "23:59", eventName, place]
                list.push(scheduleList)
                const def = deference(startDate, endDate)
                for (let i = 0; i < def - 1; i++) {
                    const scheduleList1 = [addDay(startDate, i).replace(/\//g, "-"), addDay(startDate, i).replace(/\//g, "-"), "00:00", "23:59", eventName, place]
                    list.push(scheduleList1)
                }
                const scheduleList2 = [endDate, endDate, "00:00", endTime, eventName, place]
                list.push(scheduleList2)
                const newJson = JSON.stringify(list)
                ls["schedule"] = newJson
            }
        } 
    })
}

function addDay(day1, day2) {
    const year1 = getYear(day1)
    const month1 = getMonth(day1)
    const date1 = getDate(day1)
    const addDay = new Date(year1, month - 1, date1 + day2)
    return displayDate(addDay)
}

function deference(day1, day2) {
    const year1 = getYear(day1)
    const month1 = getMonth(day1)
    const date1 = getDate(day1)
    const year2 = getYear(day2)
    const month2 = getMonth(day2)
    const date2 = getDate(day2)
    const deference = (new Date(year2, month2 - 1, date2) - new Date(year1, month1 - 1, date1)) / (1000 * 60 * 60 * 24)

    return deference
}
/*
var sc = (function(){
    var scrollElement = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;
    var scrollPoint,prePoint,flag;
    return function(){
        scrollPoint = scrollElement.scrollTop;
        flag = prePoint > scrollPoint ? true : false;
        prePoint = scrollPoint;
        return flag;
    }
})();


//使用方法
window.addEventListener("scroll",function(){
    let scrollElement = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;
    let scrollPoint = scrollElement.scrollTop
    if(sc()){
        if(scrollPoint > window.innerWidth * 0.95){
            prevCalendar()
        }
    }else{
        if (scrollPoint < window.innerWidth * 0.05) {
            nextCalendar()
        }
    }
});
*/


showCalendar(year, month)

