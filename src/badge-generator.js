import { SVG } from '@svgdotjs/svg.js'
// WIP
// initialize SVG.js
var draw = SVG().addTo('body').size(400,250)
var padding = 10

var about = "He/him, cheese, dad, data,\nrocks & trails."


// draw pink square
draw.rect(250, 200).fill('#1E1E1E').radius(10)
draw.text((add) => {
add.tspan("👋 Hi I'm").x(10).dy(30).font({family:"sans-serif", fill:"#FFFFFF", opacity:.7})
add.tspan("Bart6114").x(10).dy(30).font({size:20, family:"monospace", fill:"#FFFFFF"})
about.split("\n").forEach(x => add.tspan(x).x(10).dy(12).font({size:10, family:"monospace", fill:"#FFFFFF", opacity:.7}))
})


