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
const oneday = document.getElementById("oneday")
const time = document.getElementById("time")
const addButton = document.getElementById("add")


const config = {
    show: 1,
    unit: "month"
} //表示する月の数

const ls = localStorage //ローカルストレージ
ls["date"] = ""
let nowdate = ""
let isYear = 0 //年表示の時1、月表示の時に0

let isDate = 0
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
 
//現在時刻を返す関数


//表示されているカレンダーを消去する関数
function reset() {
    oneday.textContent = ""
    calendar.innerHTML = ""
    time.innerHTML = ""
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
    calendarHtml += '<h1>' + year  + '/' + month + '</h1>'
    calendarHtml += "<table align='center' class='calendar'>"

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td>' + weeks[i] + '</td>'
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

function createDateSchedule(date) {
    let timeHtml = ""
    oneday.textContent = date
    
    timeHtml += "<center>"
    timeHtml += "<table rules='cols' id='timetable'>"

    oneday.textContent = date
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
    timeHtml += "</center>"
    time.innerHTML = timeHtml
    console.log("hello")
}
/*
function prevCalendar() {
    if (isYear == 1) {
        year--
        showCalendar(year, 1)
        const tdList = document.getElementsByTagName("table")
        for (let i = 0, len = tdList.length; i < len; i++) {
            tdList[i].classList.add("year")
        }
    }
    else {
        month--

        if (month < 1) {
            year--
            month = 12
        }
        reset()
        showCalendar(year, month)
    }

}

function nextCalendar() {
    if (isYear == 1) {
        year++
        showCalendar(year, 1)
        const tdList = document.getElementsByTagName("table")
        for (let i = 0, len = tdList.length; i < len; i++) {
            tdList[i].classList.add("year")
        }
    }
    else {
        month++

        if (month > 12) {
            year++
            month = 1
        }
        reset()
        showCalendar(year, month)
    }
}
*/

//前の月のカレンダーや次の月のカレンダーを表示させる関数
function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = ''    
    if (config.unit == "year") {
        if (e.target.id === 'prev') {
            year--
            showCalendar(year, 1)
            const tdList = document.getElementsByTagName("table")
            for (let i = 0, len = tdList.length; i < len; i++) {
                tdList[i].classList.add("year")
            }
        } else if (e.target.id === 'next') {
            year++
            showCalendar(year, 1)
            const tdList = document.getElementsByTagName("table")
            for (let i = 0, len = tdList.length; i < len; i++) {
                tdList[i].classList.add("year")
            }
        }
        
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
        reset()
        showCalendar(year, month)
    } else if (config.unit == "date") {
        if (e.target.id == 'prev') {
            day--
            const preday = displayDate(new Date(year, month - 1, day))
            reset()
            createDateSchedule(preday)
        } else if (e.target.id == 'next') {
            day++
            const nextday = displayDate(new Date(year, month - 1, day))
            reset()
            createDateSchedule(nextday)
        }
    }
    
}

//今日のカレンダーを表示させる関数
function displayToday() {
    const today = new Date()
    year = today.getFullYear()
    month = today.getMonth() + 1
    day = today.getDate()
    if (config.unit == "year") {
        reset()
        showCalendar(year, 1)
        const tdList = document.getElementsByTagName("table")
        for (let i = 0, len = tdList.length; i < len; i++) {
            tdList[i].classList.add("year")
        }
    } else if (config.unit == "month") {
        reset()
        showCalendar(year, month)
    } else if (config.unit == "date") {
        reset()
        createDateSchedule(displayDate(new Date(year, month - 1, day)))
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
    const tdList = document.getElementsByTagName("table")
    for (let i = 0, len = tdList.length; i < len; i++) {
        tdList[i].classList.add("year")
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

function displayByDate() {
    config.unit = "date"
    yearButton.classList.remove("active")
    monthButton.classList.remove("active")
    dayButton.classList.add("active")
    reset()
    createDateSchedule(displayDate(date))
}

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

//前の月を表示
prev.addEventListener('click', moveCalendar)

//次の月を表示
next.addEventListener('click', moveCalendar)

//日をダブルクリックするとその日のサブウィンドウが表示
document.addEventListener("dblclick", function(e) {
    if(e.target.classList.contains("calendar_td") || e.target.classList.contains("today_td")) {
        reset()
        config.unit == "date"
        nowdate = e.target.dataset.date
        day = getDate(nowdate)
        createDateSchedule(nowdate)
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

dayButton.addEventListener("click", ()=>{
    displayByDate()
    //window.open('date.html', 'mywindow1', 'width=400, height=600, menubar=no, toolbar=no, scrollbars=yes')
})

function displayDate(date){
    const year2 = date.getFullYear()
    const month2 = date.getMonth() + 1
    const date2 = date.getDate()

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

function getYear(str) {
    let year = ""
    for (let i = 0; i < 4; i ++) {
        year += str[i]
    }

    return +year
}

function getMonth(str) {
    const month = str[5] + str[6]
    return +month
}

function getDate(str) {
    const day = str[8] + str[9]
    return +day
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

