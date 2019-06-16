const weeks = ['日', '月', '火', '水', '木', '金', '土'] //曜日のリスト
const moveTimeList = ["5分", "10分", "15分", "20分"]
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
const addButton = document.getElementById("add")
const box = document.getElementById("box")
let referingDay = displayDate(date)
const eventDetail = document.getElementById("eventDetail")
const parent = document.getElementById("parent")
const config = {
    show: 1,
    unit: "month"
} //表示する月の数
const num = 8
const resetStation = document.getElementById("resetStation")

const ls = localStorage //ローカルストレージ
let nowdate = ""

const originalStation = document.getElementById("originalStation")
const setStation = document.getElementById("setStation")

setStation.addEventListener("click", () => {
    if (originalStation.value != null || originalStation == "") {
        if (confirm("最寄駅を" + originalStation.value + "に設定しますか")) {
            ls["originalStation"] = originalStation.value
        } else {
            originalStation.value = ""
        }

    }
})

//カレンダーを表示する関数
function showCalendar(year, month, className) {
    for (let i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('section')
        sec.classList.add("year")
        sec.innerHTML = calendarHtml
        className.appendChild(sec)
        month++
        if (month > 12) {
            year++
            month = 1
        }
    }
    const json = ls["scheduleMap"] || "[]"
    const list = JSON.parse(json)
    updateview2(list)
}

//毎日0:00にリロードする関数
window.onload = function()
{
    const Time = new Date()
    const nextDate = new Date(Time.getFullYear(), Time.getMonth(), Time.getDate() + 1)
    Rest = nextDate - Time //ここがその残り時間(ミリ秒)を計算する処理
    setTimeout("location.reload()", Rest)
    originalStation.value = ls["originalStation"] || ""

}
 
//表示されているカレンダーを消去する関数
function reset() {
    parent.innerHTML = ""
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
    calendarHtml += "<div id='calendar'>" + '<center>'
    calendarHtml += "<table align='center' class='calendar month'>"
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
    calendarHtml += '</center>' + "</div>"
    return calendarHtml
}

function createEventDetail(map, className, list, index) {
    const startDate = map.startDate.replace(/\//g, "-")
    const endDate = map.endDate.replace(/\//g, "-")
    const eventName = map.eventName
    const place = map.place
    const startTime = map.startTime
    const endTime = map.endTime
    const moveTime = map.moveTime
    const station = map.station
    
    
    let moveTimeHtml = ""

    moveTimeList.forEach(a => {
        moveTimeHtml += `<option>${a}</option>`
    })

    list.forEach(a => {
        moveTimeHtml += `<option>${a}</option>`
    })
    let eventHtml = "<div id='box'>"
    eventHtml +=  `<form id='eventBox' name='formName'>
        <span class='eventForm'>イベント名</span>:<input id='event' type='text' name='event' value=${eventName}>&nbsp&nbsp<button id='deleteButton' onclick='deleteEventBox()'>削除</button>
        <br>
        <span class='eventForm'>開始時刻</span>:<input id='startdate' type='date' name='startdate', value=${startDate}><input id='startTime' type='time' name='startTime' value=${startTime}>
        <br>
        <span class='eventForm'>終了時刻</span>:<input id='enddate' type='date' name='enddate' value=${endDate}><input id='endTime' type='time' name='endTime' value=${endTime}>
        <br>
        <span class='eventForm'>目的地の最寄駅</span>:<input type'text' name='station' id='station' value=${station}>
        <br>
        <span class='eventForm'>最寄駅からの移動時間</span>:<select id='minute' name='minute' value=カスタム>
        <option value='none'>--分</option>
        ${moveTimeHtml}
        <option id='customize'>カスタム</option>
        </select><span class='customBox' id='customizedTime'></span>
        <br>
        <span class='eventForm'>場所</span>:<input  type='text' name='place' id='place' value=${place}>
        <br>
        </form>
        <br>
        <button id='change'>変更</button></div>`


        className.innerHTML = eventHtml 
        const sel = document.getElementById("minute")
        sel.value = moveTime
        const chang = document.getElementById("change")

        change.addEventListener("click", () => {
            completeButton()
            deleteSchedule(index)

        })
        
}



 

//日単位のスケジュール表を作成
function createDateSchedule(date) {
    let timeHtml = "<div id='container1'><div id='box1'></div></div>" + "<div id='time'>"
    timeHtml += "<table rules='cols' id='timetable'>"
    timeHtml += `<caption>${date}${getDay(date)}</caption>`
    for(let i = 0; i < num * 24 + 1; i++) {
        const j = i.toString()
        if (i == num * 24) {
            timeHtml += "<tr class='schedule'>" + "<td class='timetd'>" + "&nbsp&nbsp" + "0:00" + "</td>" + "<td class='schedule' id=" + date + j + ">" + "<hr>" + "</td>" + "</tr>"
        } else {
            if (i % num == 0) {
            if(i >= 0 && i < num * 10) {
                timeString = "&nbsp&nbsp" + (i / num) .toString() + ":" + "00"
            }
            else {
                timeString = (i / num).toString() + ":" + "00"
            }

            timeHtml += "<tr class='schedule'>" + "<td class='timetd'>" + timeString +  "</td>" + "<td class='schedule' id=" + date + j + ">" + "<hr>" + "</td>" + "</tr>"
            } else {
                timeHtml += "<tr class='schedule'>" + "<td class='timetd'>" + "</td>" + "<td class='schedule' id=" + date + j + ">" + "</td>" + "</tr>"
            }
        }
        
        
    }
    
    timeHtml += "</table>" + "</div>" + "<div id='container3'></div>"
    const sec = document.createElement('section')
    parent.innerHTML = timeHtml
}

//前の月のカレンダーや次の月のカレンダーを表示させる関数
function moveCalendar(e) {
    reset()
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
    showCalendar(year, 1, parent)

    const table = document.getElementsByTagName("table")
    for (let i = 0, len = table.length; i < len; i++) {
        table[i].classList.add("year")
        table[i].classList.remove("month")

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
    showCalendar(year, month, parent)
    const table = document.getElementsByTagName("table")
    for (let i = 0, len = table.length; i < len; i++) {
        table[i].classList.remove("year")
        table[i].classList.add("month")

    }
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
    const container3 = document.getElementById('container3')
    showCalendar(getYear(d), getMonth(d), container3)
    const table = document.getElementsByClassName("calendar")
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
    const json = ls["scheduleMap"] || "[]"
    const list = JSON.parse(json)
    updateview2(list)
    routeSearch(list)
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
    if (minute >= 0 && minute <= 7.5) {
        index = hour * num
    } else if (minute > 7.5 && minute <= 22.5) {
        index = hour * num + 2
    } else if (minute > 22.5 && minute <= 37.5) {
        index = hour * num + 4
    } else if (minute > 37.5 && minute <= 52.5) {
        index = hour * num + 6
    } else {
        index = (hour + 1) * num
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

document.addEventListener("click", function(e) {
    if(e.target.classList.contains("assigned")) {
        const box1 = document.getElementById('box1')
        const map = JSON.parse(e.target.dataset.event)
        const assigned = document.getElementsByClassName("delete")
        const index = assigned[0].dataset.index
        console.log(index)
        box1.innerHTML = ""
        const json = ls["moveTime"] || "[]"
        const list = JSON.parse(json)
        createEventDetail(map, box1, list, index)
    }
})

function createListFromString(str) {
    const list = []
    let a = ""
    for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] != ",") {
            a += str[i]
        } else {
            list.push(a)
            a = ""
        }

        if (i == len - 1) {
            list.push(a)
        }
    }
    return list
}
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("element")) {
        const event = e.target.dataset.event
        console.log(event)
        const map = JSON.parse(event)
        let display = "" 
        //display += list[0] + "\n" + list[1] + "\n" + list[2] + "\t" + list[3] + "~" + list[4]
        alert(display)
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
    let thisYear = ""
    for (let i = 0; i < 4; i ++) {
       thisYear += str[i]
    }

    return +thisYear
}

//月を取得
function getMonth(str) {
    const thisMonth = str[5] + str[6]
    return +thisMonth
}

//日を取得
function getDate(str) {
    const thisDate = str[8] + str[9]
    return +thisDate
}

function getDay(str) {
    const thisYear = getYear(str)
    const thisMonth = getMonth(str)
    const thisDate = getDate(str)
    const date1 = new Date(thisYear, thisMonth - 1, thisDate)
    const thisDay = date1.getDay()
    if (thisDay == 0) {
        return "日曜日"
    } else if (thisDay == 1) {
        return "月曜日"
    } else if (thisDay == 2) {
        return "火曜日"
    } else if (thisDay == 3) {
        return "水曜日"
    } else if (thisDay == 4) {
        return "木曜日"
    } else if (thisDay == 1) {
        return "金曜日"
    } else {
        return "土曜日"
    }
}
//イベント作成画面を表示
function createEvent(list) {
    displayByDate(referingDay)
    const conteiner1 = document.getElementById('conteiner1')
    let moveTimeHtml = ""

    moveTimeList.forEach(a => {
        moveTimeHtml += `<option>${a}</option>`
    })

    list.forEach(a => {
        moveTimeHtml += `<option>${a}</option>`
    })
    let eventHtml = "<div id='box'>"
    eventHtml +=  "<form id='eventBox' name='formName'>" + 
        "<span class='eventForm'>イベント名</span>:<input id='event' type='text' name='event'>" + "&nbsp&nbsp" + "<button id='deleteButton' onclick='deleteEventBox()'>削除</button>" +
        "<br>" +
        "<span class='eventForm'>開始時刻</span>:<input id='startdate' type='date' name='startdate'><input id='startTime' type='time' name='startTime'>" +
        "<br>" +
        "<span class='eventForm'>終了時刻</span>:<input id='enddate' type='date' name='enddate'><input id='endTime' type='time' name='endTime'>" +
        "<br>" +
        "<span class='eventForm'>目的地の最寄駅</span>:<input type'text' name='station' id='station'>" + 
        "<br>" +
        "<span class='eventForm'>最寄駅からの移動時間</span>:<select id='minute' name='minute'>" +
        "<option value='none'>--分</option>" + 
        moveTimeHtml +
        "<option value='customize' id='customize'>カスタム</option>" +
        "</select><span class='customBox' id='customizedTime'></span>" +
        "<br>" +
        "<span class='eventForm'>場所</span>:<input  type='text' name='place' id='place'>" +
        "<br>" +
        "</form>" +
        "<br>" + 
        "<button id='complete' onclick='completeButton()' >完了</button></div>" 
        

    container1.innerHTML = eventHtml
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
    const json = ls["moveTime"] || "[]"
    const list = JSON.parse(json)
    createEvent(list)
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
        if (hour == 23) {
            endDateForm.value = addDay(endDate, 1).replace(/\//g, "-")
        } else {
            endTimeForm.value = getTime(hour + 1, minute)
        }
        
    })

    startDateForm.addEventListener("change", () => {
        const start = startDateForm.value
        endDateForm.value = start.replace(/\//g, "-")
    })
    const select = document.formName.minute
    select.addEventListener("change", () => {
        const num = select.selectedIndex
        const str = select.options[num].value;
        let timeselect = ""
        if (str == "customize") {
            timeselect = `<span id='customizeSpan'><form name='customizeForm'>
            <input type='text' id='customTime' size='5'><select name='unit' id='unit'><option value='minute'>分</option><option value='hour'>時間</option></select>
            <input type='button' value='ok' id='okButton' onclick="addMoveTime()"></form></span>`
            document.getElementById("customizedTime").innerHTML = timeselect
        }
    })
    

    const cutomize = document.getElementById('customize')
    customize.addEventListener("click", () => {
    })
}

function addMoveTime() {
    const sel = document.formName.minute
    const customizeSpan = document.getElementById("customizeSpan")
    const json = ls["moveTime"] || "[]"
    const list = JSON.parse(json)
    const sel2 = document.getElementById("unit")
    const num = sel2.selectedIndex
    const val = sel2.options[num].textContent
    const customTime = document.getElementById("customTime")
    const moveTime = customTime.value + val
    if (list.indexOf(moveTime) < 0 && moveTimeList.indexOf(moveTime) < 0) {
        list.push(moveTime)
    }

    const newJson = JSON.stringify(list);
    ls["moveTime"] = newJson;
    const option = document.createElement("option")
    option.innerHTML = customTime.value + val
    sel.insertBefore(option, sel.options[sel.length - 1])
    sel.value = customTime.value + val
    customizeSpan.innerHTML = ""
}
addButton.addEventListener("click", () => {
    addEvent()
    //window.open('schedule.html?date=' + encodeURIComponent(referingDay), 'mywindow1', 'width=400, height=600, menubar=no, toolbar=no, scrollbars=yes')
})


parent.addEventListener("click", (e)=>{
    if(e.target.classList.contains("delete")){
        const result = confirm("削除してよろしいですか？")
        if (result) {
            deleteSchedule(e.target.dataset.index)
        }
    }
})

//スケジュールをカレンダーに反映させる関数
function completeButton() {
    if (originalStation.value == "") {
        alert("自宅の最寄り駅を入力してください")
    }
    const select = document.formName.minute
    const num = select.selectedIndex
    const str = select.options[num].value;
    const eventNameForm = document.getElementById("event")
    const placeForm = document.getElementById("place")
    const startDateForm = document.getElementById("startdate")
    const endDateForm = document.getElementById("enddate")
    const startTimeForm = document.getElementById("startTime")
    const endTimeForm = document.getElementById("endTime")
    const stationForm = document.getElementById("station")
    const moveTime = select.options[num].value
    const startDate = startDateForm.value.replace(/\-/g, "/")
    const endDate = endDateForm.value.replace(/\-/g, "/")
    const startTime = startTimeForm.value
    const endTime = endTimeForm.value
    const eventName = eventNameForm.value
    const place = placeForm.value
    const station = stationForm.value
    if (eventName == null || eventName == "" || /^\s*$/.test(eventName)) {
        alert("イベント名を入力してください")
    } else {
        const scheduleMap = setMap(startDate, endDate, startTime, endTime, eventName, place, moveTime, station)
        const json = ls["scheduleMap"] || "[]"
        const list = JSON.parse(json)
        list.push(scheduleMap)
        const newJson = JSON.stringify(list);
        ls["scheduleMap"] = newJson;
        updateview2(list)
        displayByDate(startDate)
    }
}

const deleteSchedule = (index)=>{
    const json = ls["scheduleMap"] || "[]"
    const list = JSON.parse(json)
    list.splice(index, 1)
    const newJson = JSON.stringify(list);
    ls["scheduleMap"] = newJson
    displayByDate(referingDay)
}

function getSchedule(list, day) {
    const array = []
    list.forEach(map => {
        if (map.startDate == day) {
            array.push(map)
        }
    })

    return sort(array)
}



function sort(list) {
    const len = list.length
    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            const startTimeInt1 = parseInt(list[i].startTime.replace(":", ""))
            const startTimeInt2 = parseInt(list[j].startTime.replace(":", ""))
            if (startTimeInt1 > startTimeInt2) {
                const temp = list[j]
                list[j] = list[i]
                list[i] = temp
            }
        }
    }        
   return list
}

function timeDifference(time1, time2) {
    const hour1 = intHour(time1)
    const hour2 = intHour(time2)
    const minute1 = intMinute(time1)
    const minute2 = intMinute(time2)

    const timeInt1 = 60 * hour1 + minute1
    const timeInt2 = 60 * hour2 + minute2

    if (timeInt1 > timeInt2) {
        return toTimeFromInt(timeInt1 - timeInt2)
    } else {
        return toTimeFromInt(timeInt2 - timeInt1)
    }
}

function addTime(time1, time2) {
    const intTime1 = toIntFromTime(time1)
    const intTime2 = toIntFromTime(time2)
    const sum = intTime1 + intTime2

    return toTimeFromInt(sum)
}

function toIntFromTime(time) {
    let hour = intHour(time)
    let minute = intMinute(time)

    return hour * 60 + minute
}

function toTimeFromInt(intTime) {
    let hour = parseInt(intTime / 60)
    let minute = parseInt(intTime % 60)

    if (hour < 10) {
        hour = "0" + hour
    } 
    if (minute < 10) {
        minute = "0" + minute
    }

    return hour + ":" + minute
}

function setMap(startDate, endDate, startTime, endTime, eventName, place, moveTime, station) {
    const map = {}
    map.startDate = startDate
    map.endDate = endDate
    map.startTime = startTime
    map.endTime = endTime
    map.eventName = eventName
    map.place = place
    map.moveTime = moveTime
    map.station = station

    return map
}

function displayString(map) {
    const eventName = map.eventName
    const place = map.place
    const startDate = map.startDate
    const endDate = map.endDate
    const startTime = map.startTime
    const endTime = map.endTime
    let list = []
    list.push(eventName)
    list.push(place)
    list.push(startDate)
    list.push(startTime)
    list.push(endTime)
    return list
}

function updateview2(list) {
    if (config.unit == "date") {
        list.forEach((map, index) => {
            const startDate = map.startDate
            const endDate = map.endDate
            const startTime = map.startTime
            const endTime = map.endTime
            const eventName = map.eventName
            const place = map.place
            const station = map.station
            const moveTime = map.moveTime
            if (startDate == referingDay) {
                if (startDate == endDate) {
                    const startHour = intHour(startTime)
                    const startMinute = intMinute(startTime)
                    const endHour = intHour(endTime)
                    const endMinute = intMinute(endTime)
                    const startIndex = getIndex(startHour, startMinute)
                    const endIndex = getIndex(endHour, endMinute)
                    for (let i = startIndex; i < endIndex + 1; i++) {
                        const scheduleId = document.getElementById(startDate + i.toString())
                        if (i == startIndex) {
                            scheduleId.innerHTML = `<div class='assigned' data-event=${JSON.stringify(map)}>${startTime}<button class='delete' data-index=${index}>削除</button></div>`
                        } else if (i == Math.floor((endIndex + startIndex) / 2)) {
                            if (i == startIndex) {
                                scheduleId.innerHTML = `<div class='assigned' data-event=${JSON.stringify(map)}>${startTime} ${eventName} <input type='button' class='delete' data-index=${index} value='削除'></div>`
                            } else {
                                scheduleId.innerHTML = `<div class='assigned' data-event=${JSON.stringify(map)}>${eventName}</div>`
                            } 
                        } else {
                            scheduleId.innerHTML = `<div class='assigned' data-event=${JSON.stringify(map)}></div>`
                        }
                        scheduleId.classList.add("active")
                    }
                } else {
                    list.splice(index, 1)
                    const scheduleMap = setMap(startDate, startDate, startTime, "23:59", eventName, place, moveTime, station)

                    list.push(scheduleMap)
                    const deff = defference(startDate, endDate)
                    if (deff > 1) {
                        for (let i = 1; i < deff; i++) {
                            const nextDay = addDay(startDate, i)
                            const scheduleMap1 = setMap(nextDay, nextDay, "00:00", "23:59", eventName, place, moveTime, station)
                            list.push(scheduleMap1)
                        }
                    }       
                    const scheduleMap2 = setMap(endDate, endDate, "00:00", endTime, eventName, place, moveTime, station)
                    list.push(scheduleMap2)
                    const newJson = JSON.stringify(list)
                    ls["scheduleMap"] = newJson
                }
            } 
        })
    } else if (config.unit == "month") {
        const tdList = document.getElementsByTagName("td")
        for (let i = 0, len = tdList.length; i < len; i++) {
            const eventList = []
            list.forEach((a, index) => {
                if (tdList[i].dataset.date == a.startDate) {
                    eventList.push(a)
                }
            })
            let eventHtml = "<div class='event'>"
            if (eventList.length != 0) {
                sort(eventList).forEach((a, index) => {
                    eventHtml += `<div class="element" data-event=${displayString(a)}>${a.eventName}</div>`
                })
                eventHtml += "</div>"
                tdList[i].innerHTML += eventHtml
            }
        }
    }
    
}

function moveTimetoInt(moveTime) {
    if (moveTime[moveTime.length - 1] == "分") {
        const result = moveTime.replace("分", "")
        return toTimeFromInt(result)  
    } else if (moveTime[moveTime.length - 2] + moveTime[moveTime.length - 1] == "時間") {
        const result = moveTime.replace("時間", "")
        return toTimeFromInt(result)
    }
}

function routeSearch(list) {
    let scheduleList = []
    list.forEach(a => {
        if (a.startDate == referingDay) {
            scheduleList.push(a)
        }
    })
    scheduleList = sort(scheduleList)

    const len = scheduleList.length

    for (let i = 0; i < len; i++) {
        const schedule = scheduleList[i]
        const startDate = (schedule.startDate).replace(/\//g, "")
        let moveTime = schedule.moveTime
        moveTime = moveTimetoInt(moveTime)
        const startTime = schedule.startTime
        const destination = schedule.station
        const endTime = schedule.endTime
        const origin = originalStation.value
        if (i == len - 1) {
            if (i == 0 && origin != destination) {
                const arrivalTime = timeDifference(startTime, moveTime).replace(":", "")
                setURI(origin, destination, startDate, arrivalTime, "arrival")
            }
            if (origin != destination) {
                const departure = addTime(endTime, moveTime).replace(":", "")
                setURI(destination, origin, startDate, departure, "departure")
            }
        } else if (i == 0) {
            if (origin != destination) {
                const arrivalTime = timeDifference(startTime, moveTime).replace(":", "")
                setURI(origin, destination, startDate, arrivalTime, "arrival")
            }
            const schedule2 = scheduleList[i + 1]
            const nextDestination = schedule2.station
            const nextStart = schedule2.startTime
            let nextMoveTime = schedule2.moveTime
            nextMoveTime = moveTimetoInt(nextMoveTime)
            if (destination != nextDestination) {
                const arrivalTime = timeDifference(nextStart, nextMoveTime).replace(":", "")
                setURI(destination, nextDestination, startDate, arrivalTime, "arrival")
            }
            
        } else {
            const schedule2 = scheduleList[i + 1]
            const nextDestination = schedule2.station
            const nextStart = schedule2.startTime
            let nextMoveTime = schedule2.moveTime
            if (destination != nextDestination) {
                nextMoveTime = moveTimetoInt(nextMoveTime)
                const arrivalTime = timeDifference(nextStart, nextMoveTime).replace(":", "")
                setURI(destination, nextDestination, startDate, arrivalTime, "arrival")
            }
            
        }
    }
}

function addDay(day1, day2) {
    const year1 = getYear(day1)
    const month1 = getMonth(day1)
    const date1 = getDate(day1)
    const addDay = new Date(year1, month - 1, date1 + day2)
    return displayDate(addDay)
}

function defference(day1, day2) {
    const year1 = getYear(day1)
    const month1 = getMonth(day1)
    const date1 = getDate(day1)
    const year2 = getYear(day2)
    const month2 = getMonth(day2)
    const date2 = getDate(day2)
    const deference = (new Date(year2, month2 - 1, date2) - new Date(year1, month1 - 1, date1)) / (1000 * 60 * 60 * 24)

    return deference
}

function deleteEventBox() {
    box.innerHTML = ""
}

function toDate(intDate) {
    let y = ""
    for (let i = 0;i < 4; i++) {
        y += intDate[i]
    }

    let m = ""
    for (let i = 4; i < 6; i++) {
        m += intDate[i]
    }

    let d = ""
    for (let i = 6; i < 8; i++) {
        d += intDate[i]
    }

    return y + "/" + m + "/" + d
}

function setURI(start, end, startDate, time, type) {
    fetch("http://api.ekispert.jp/v1/json/search/course/light?key=LE_mJQjMN29NhWXc&from=" 
                    + encodeURIComponent(start) 
                    + "&to=" 
                    + encodeURIComponent(end)
                    + "&date="
                    + encodeURIComponent(startDate)
                    + "&time="
                    + encodeURIComponent(time)
                    + "&searchType="
                    + type)
                .then(res => res.json())
                .then(json => {
                    const hour = parseInt(time / 100)
                    const minute = parseInt(time % 100)
                    let index = ""
                    if (type == "arrival") {
                        index = getIndex(hour, minute) - 1
                    } else {
                        index = getIndex(hour, minute) + 1
                    }
                    const y = toDate(startDate)
                    const scheduleId = document.getElementById(y + index.toString())
                    scheduleId.innerHTML = "<span class='route'><a class='route' target='_blank' href=" + json.ResultSet.ResourceURI + ">" + start + "から" + end + "へのルート検索" + "</a></span>"
                })
}

resetStation.addEventListener("click", () => {
    ls["originalStation"] = ""
    originalStation.value = ls["originalStation"]
})
showCalendar(year, month, parent)
