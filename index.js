const { DateTime, Interval, Duration } = require('luxon')

const startDatetime1 = '2023-03-31 15:30:00'
const endDatetime1 = '2023-04-06 21:15:00'
const mode1 = 'productionWeek'
const groups1 = generateTimeGroups(startDatetime1, endDatetime1, mode1)
// console.log(groups1)

function generateTimeGroups(startSQL, endSQL, mode, options = { productionWeekStartDay: 1, productionDayStartTime: 8}) {
    // create DateTime objects from input strings
    const start = DateTime.fromSQL(startSQL)
    const end = DateTime.fromSQL(endSQL)

    let interval
    switch (mode) {
        case 'hour':
            interval = Interval.fromDateTimes(start.startOf('hour'), end.startOf('hour'))
            break
        case 'day':
            interval = Interval.fromDateTimes(start.startOf('day'), end.startOf('day'))
            break
        case 'week':
            interval = Interval.fromDateTimes(start.startOf('week'), end.startOf('week'))
            break
        case 'month':
            interval = Interval.fromDateTimes(start.startOf('month'), end.startOf('month'))
            break
        case 'quarter':
            interval = Interval.fromDateTimes(start.startOf('quarter'), end.startOf('quarter'))
            break
        case 'productionWeek':
            const daysToShift = Duration.fromObject({ days: options.productionWeekStartDay - 1 })
            interval = Interval.fromDateTimes(start.startOf('week').plus(daysToShift), end.startOf('week').plus(daysToShift))
            break
        case 'productionDay':
            const hoursToShift = Duration.fromObject({ hours: options.productionDayStartTime })
            interval = Interval.fromDateTimes(start.startOf('day').plus(hoursToShift), end.startOf('day').plus(hoursToShift))
            break
        default:
            throw new Error(`Invalid mode parameter: ${mode}`)
    }

    const unitMode = mode === 'productionDay' ?  'day' : mode === 'productionWeek' ? 'week' : mode
    const groups = interval.splitBy({ [unitMode]: 1 })


    if (groups[0].contains(start)) {
        console.log('first group contains start time');
        //replace the first group with a new group that starts at the start time
        groups[0] = Interval.fromDateTimes(start, groups[0].end)
    }

    if (groups[groups.length - 1].contains(end)) {
        console.log('last group contains end time');
        //replace the last group with a new group that ends at the end time
        groups[groups.length - 1] = Interval.fromDateTimes(groups[groups.length - 1].start, end)
    }

    if (groups[groups.length - 1].isBefore(end)) {
        console.log('last group finishes before end time');
        //add a new group to the end
        groups.push(Interval.fromDateTimes(groups[groups.length - 1].end, end));
    }

    if (groups[0].isAfter(start)) {
        console.log('first group starts after start time');
        //add a new group to the start
        groups.unshift(Interval.fromDateTimes(start, groups[0].start));
    }

    if (groups[0].toDuration().as('seconds') === 0) {
        console.log('first group is empty');
        groups.shift();
    }

    if (groups[groups.length - 1].toDuration().as('seconds') === 0) {
        console.log('last group is empty');
        groups.pop();
    }

    // console.log(groups.map((group) => ({
    //     name: group.start.toFormat('yyyy-MM-dd HH:mm:ss'),
    //     start: group.start.toFormat('yyyy-MM-dd HH:mm:ss'),
    //     end: group.end.toFormat('yyyy-MM-dd HH:mm:ss'),
    // })))


    // console.log();
    // const reportDuration = Interval.fromDateTimes(start, end).toDuration(['seconds'])
    // const totalGroupsDuration = Duration.fromObject({ seconds: groups.reduce((acc, group) => acc + group.toDuration().as('seconds'), 0) })
    // if(reportDuration.toObject().seconds !== totalGroupsDuration.toObject().seconds) {
    //     console.log('ERROR: report duration does not match total groups duration');
    // }
    // console.log(`Durations Match! - Report:${reportDuration.toFormat('MM:dd:hh:mm:ss')} - ${totalGroupsDuration.toFormat('MM:dd:hh:mm:ss')}`);


    //add up all the durations of the groups

    return groups.map((group) => ({
            start: group.start.toFormat('yyyy-MM-dd HH:mm:ss'),
            end: group.end.toFormat('yyyy-MM-dd HH:mm:ss'),
        }))

}

module.exports = generateTimeGroups