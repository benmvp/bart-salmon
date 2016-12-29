import getSuggestedSalmonRoutesFromETDs from '../_salmon'
import etdsLookup from '../../api/__mocks__/etds.json'

it('returns no suggestions when 0 suggestions are requested', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'SSAN', 'WDUB', 0)

    expect(actualSalmonSuggestions).toHaveLength(0)
})

it('returns single suggestion when 1 suggestion is requested', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'SANL', 'BALB', 1)

    expect(actualSalmonSuggestions).toHaveLength(1)
})

it('returns no suggestions when at origin station (Westbound)', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'PITT', 'SFIA', 5)

    expect(actualSalmonSuggestions).toHaveLength(0)
})

it('returns no suggestions when at origin station (Eastbound)', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'MLBR', 'RICH', 5)

    expect(actualSalmonSuggestions).toHaveLength(0)
})

it('returns suggestions for PITT line', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'POWL', 'PITT', 5)

    // console.log(actualSalmonSuggestions)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

it('returns suggestions for DUBL line', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'EMBR', 'CAST', 5)

    // console.log(actualSalmonSuggestions)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

it('returns suggestions for RICH line', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '16TH', 'NBRK', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

xit('returns suggestions for WARM line', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'MONT', 'FRMT', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

it('returns suggestions for Westbound line', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'PHIL', 'EMBR', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

it('returns suggestions when more than one Northbound line is available', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '19TH', 'PLZA', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

xit('returns suggestions when more than one Southbound line is available', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '12TH', 'BAYF', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

it('returns suggestions when more than one Eastbound line is available', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '16TH', 'MCAR', 10)

    expect(actualSalmonSuggestions).toHaveLength(10)
})

it('returns suggestions when many Westbound lines are available', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'WOAK', 'DALY', 10)

    expect(actualSalmonSuggestions).toHaveLength(10)
})

xit('returns suggestions when changing trains is needed (Eastbound)', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'COLS', 'NCON', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})

xit('returns suggestions when changing trains is needed (Westbound)', () => {
    let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'LAFY', 'HAYW', 5)

    expect(actualSalmonSuggestions).toHaveLength(5)
})
