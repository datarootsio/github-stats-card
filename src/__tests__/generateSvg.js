require('../config');
const {expect, test} = require( '@jest/globals');
const generateSvg = require('../generateSvg');
const collectStats = require('../collectStats');
const { XMLParser} = require("fast-xml-parser");

test('generateSVG', async () => {
    const stats = await collectStats('bart6114');
    const svg = generateSvg(
        {about: "He/him, cheese, dad, data,\nrocks & trails.",
        stats, username: "bart6114",}
    )

    
    const parser = new XMLParser();
    let svgDoc = parser.parse(svg);
    expect(svgDoc).toBeDefined();
    expect(svgDoc).toBeInstanceOf(Object)

})
