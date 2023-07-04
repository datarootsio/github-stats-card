// load a local svg file to string
const fs = require("fs");

const renderBadge = (params) => {
    const badgeTemplate = fs.readFileSync("./badge.svg", "utf8");


    const Handlebars = require("handlebars");
    const template = Handlebars.compile(badgeTemplate);
    
    return template({ name: "Nils" })
}


module.exports = renderBadge;