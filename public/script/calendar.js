class Calendar {
    constructor() {}

    nextMonth(curentMonth, curentYear) {
        if (curentMonth === 12) {
            curentMonth = 1;
            curentYear++;
        } else {
            curentMonth++;
        }

        window.location.href = `/all-schedule?month=${curentMonth}&year=${curentYear}`;
    }

    prevMonth(curentMonth, curentYear) {
        if (curentMonth === 1) {
            curentMonth = 12;
            curentYear--;
        } else {
            curentMonth--;
        }

        window.location.href = `/all-schedule?month=${curentMonth}&year=${curentYear}`;
    }

    returnToday() {
        window.location.href = "/all-schedule";
    }
}

const calendarAllSchedule = new Calendar();

class ClientCalender {
    constructor() {}

    nextMonth(href, curentMonth, curentYear) {
        if (curentMonth === 12) {
            curentMonth = 1;
            curentYear++;
        } else {
            curentMonth++;
        }
        window.location.href = `${href}?month=${curentMonth}&year=${curentYear}`;
    }
    prevMonth(href, curentMonth, curentYear) {
        if (curentMonth === 1) {
            curentMonth = 12;
            curentYear--;
        } else {
            curentMonth--;
        }
        window.location.href = `${href}?month=${curentMonth}&year=${curentYear}`;
    }
    returnToday(href) {
        window.location.href = href;
    }
}

const calendar = new ClientCalender();
