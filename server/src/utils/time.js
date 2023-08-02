const moment = require('moment')

function numBetween(min, max) {
    return Math.random() * (max - min + 1) + min
}

const getTimeDifference = (time, minutes = false, hours = false) => {
    const end_time_full = moment()
    const duration = moment.duration(end_time_full.diff(time))
    if (minutes) {
        return duration.asMinutes()
    }
    if (hours) {
        return duration.asHours()
    }
    return duration.asSeconds()
}
const daysBetween = (start, end) => {
    const now = start.clone()
    const dates = []
    while (now.isSameOrBefore(end)) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(1, 'days')
    }
    return dates
}
const daysBetweenExact = (start, end) => {
    const now = start.clone().add(1, 'day')
    const dates = []
    while (now.isSameOrBefore(end)) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(1, 'days')
    }
    return dates
}
/**
 * @param {string} day
 * @param {boolean} range
 * @param {number} hours
 * @param {string} format
 */
const hoursOfDay = (
    day,
    range = true,
    hours = 24,
    format = 'YYYY-MM-DD HH:mm:ss'
) => {
    const time = []
    for (let i = 0; i < hours; i += 1) {
        if (range) {
            time.push({
                start: moment(day)
                    .set({ hour: i, minute: 0, second: 0 })
                    .format(format),
                end: moment(day)
                    .set({ hour: i, minute: 59, second: 59 })
                    .format(format),
            })
        } else {
            time.push(
                moment(day)
                    .set({ hour: i, minute: 0, second: 0 })
                    .format(format)
            )
        }
    }
    return time
}

const hoursOfDayII = (
    day,
    range = true,
    hours = 24,
    format = 'YYYY-MM-DD HH:mm:ss'
) => {
    const time = []
    for (let i = 0; i < hours; i += 1) {
        if (range) {
            const _time = moment(day).set({ hour: i, minute: 0, second: 0 })
            const start = _time.format(format)
            const end = _time.add(1, 'hours').format(format)
            time.push({
                start,
                end,
            })
        } else {
            time.push(
                moment(day)
                    .set({ hour: i, minute: 0, second: 0 })
                    .format(format)
            )
        }
    }
    return time
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

module.exports = {
    getTimeDifference,
    daysBetween,
    daysBetweenExact,
    hoursOfDay,
    hoursOfDayII,
    sleep,
    numBetween,
}
