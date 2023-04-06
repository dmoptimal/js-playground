const generateTimeGroups = require('./index.js')
const fixtures = require('./fixtures.js')


describe('generateTimeGroups', () => {

    fixtures.forEach(fixture => {
        const { mode, cases } = fixture
        describe(mode, () => {

            cases.forEach(testCase => {
                const { name, start, end, opts, expected } = testCase
                describe(name, () => {
                    
                    test('should return an array of intervals', () => {
                        const groups = generateTimeGroups(start, end, mode, opts)
                        expect(groups).toHaveLength(expected.length)
                    })

                    test('should match the expected output', () => {
                        const groups = generateTimeGroups(start, end, mode, opts)
                        expect(groups).toEqual(expected)
                    })
                })

            })

        })



    })

})