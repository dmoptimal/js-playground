const modes = [
    {
        mode: 'hour', cases: [
            {
                name: 'hourly interval, on the hour',
                start: '2020-01-01 00:00:00',
                end: '2020-01-01 05:00:00',
                opts: null,
                expected: [
                    {
                        start: '2020-01-01 00:00:00',
                        end: '2020-01-01 01:00:00'
                    },
                    {
                        start: '2020-01-01 01:00:00',
                        end: '2020-01-01 02:00:00'
                    },
                    {
                        start: '2020-01-01 02:00:00',
                        end: '2020-01-01 03:00:00'
                    },
                    {
                        start: '2020-01-01 03:00:00',
                        end: '2020-01-01 04:00:00'
                    },
                    {
                        start: '2020-01-01 04:00:00',
                        end: '2020-01-01 05:00:00'
                    }
                ]
            },
            {
                name: 'hourly interval, not on the hour',
                start: '2020-01-01 00:04:00',
                end: '2020-01-01 05:09:21',
                opts: null,
                expected: [
                    {
                        start: '2020-01-01 00:04:00',
                        end: '2020-01-01 01:00:00'
                    },
                    {
                        start: '2020-01-01 01:00:00',
                        end: '2020-01-01 02:00:00'
                    },
                    {
                        start: '2020-01-01 02:00:00',
                        end: '2020-01-01 03:00:00'
                    },
                    {
                        start: '2020-01-01 03:00:00',
                        end: '2020-01-01 04:00:00'
                    },
                    {
                        start: '2020-01-01 04:00:00',
                        end: '2020-01-01 05:00:00'
                    },
                    {
                        start: '2020-01-01 05:00:00',
                        end: '2020-01-01 05:09:21'
                    }
                ]
            }
        ]
    },
    {
        mode: 'productionWeek', cases: [
            {   
                name: 'production week, starting on tuesdays. Break in the middle of the week',
                start: '2023-03-31 15:30:00',
                end: '2023-04-06 21:15:00',
                opts: { productionWeekStartDay: 2, productionDayStartTime: 0 },
                expected: [
                    {
                        start: '2023-03-31 15:30:00',
                        end: '2023-04-04 00:00:00'
                    },
                    {
                        start: '2023-04-04 00:00:00',
                        end: '2023-04-06 21:15:00'
                    }
                ]
            }
        ]
    }
]

module.exports = modes