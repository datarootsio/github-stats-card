
const theme = {
    padding: 10,
    background: "#1E1E1E",
    textColor: "#FFFFFF",
    iconColor: "FFFFFF",
    iconSize: 12,
    metricsTextOffset: 2,
    fontSize: {
        metrics: 12,
        header: 16,
        username: 20,
        description: 10,
    }
}

const svgSafeString = (str) => str.replace("&", "&amp;").replace(">", "&gt;").replace("<", "&lt;")


const generateSVG = ({ theme: t, about, username, header, stats: { commits, followers, stargazers, avatarUrl } }) => {
    if (t == undefined) {
        t = theme
    }

    if (header == undefined) {
        header = "👋 Hi, I'm"
    }

    const aboutWrap = svgSafeString(about).split("\n").map((line, i) => `<tspan x="0" dy="${i == 0 ? 0 : 20}">${line}</tspan>`).join("")

    const svg = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: $$$/GeneralStr/196=Adobe Illustrator 27.6.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="layer1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 400 250" style="enable-background:new 0 0 400 250;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#1E1E1E;}
	.st1{fill:none;}
	.mono{font-family:monospace;}
    .sans{font-family:sans-serif;}

	.st4{fill:#fff;}
	.st5{fill:#FFFFFF; opacity:0.7;}
	.st6{fill:#FFFFFF; font-size: 20px;}
	.size10{font-size:10px;}
	.size12{font-size:12px;}
	.size20{font-size:20px;}
    .size24{font-size:24px;}
</style>



<path class="st0" d="M391.1,250H8.9C4,250,0,246,0,241.1V8.9C0,4,4,0,8.9,0h382.1c4.9,0,8.9,4,8.9,8.9v232.1
	C400,246,396,250,391.1,250z"/>

<image x="306" y="30" width="64" height="64"
     xlink:href="${svgSafeString(avatarUrl)}" clip-path="inset(0% round 64px)"/>

<text transform="matrix(1 0 0 1 15 30)" class="sans st5 size12">${header}</text>

<text transform="matrix(1 0 0 1 15 60)" class="mono st6 size24">${username}</text>

<text transform="matrix(1 0 0 1 15 105)" class="mono st5 size10">${aboutWrap}</text>
<path transform="translate(0, 25)" class="st4" d="M24.5,135c0.3,0,0.5,0.2,0.7,0.4l1.9,3.8l4.2,0.6c0.4,0.1,0.7,0.4,0.6,0.9c0,0.2-0.1,0.3-0.2,0.4l-3,3l0.7,4.2
	c0.1,0.4-0.2,0.8-0.6,0.9c-0.2,0-0.3,0-0.5-0.1l-3.8-2l-3.8,2c-0.4,0.2-0.8,0.1-1-0.3c-0.1-0.1-0.1-0.3-0.1-0.5l0.7-4.2l-3-3
	c-0.3-0.3-0.3-0.8,0-1.1c0.1-0.1,0.3-0.2,0.4-0.2l4.2-0.6l1.9-3.8C23.9,135.2,24.2,135,24.5,135z M24.5,137.5l-1.4,2.8
	c-0.1,0.2-0.3,0.4-0.6,0.4l-3.1,0.4l2.2,2.2c0.2,0.2,0.3,0.4,0.2,0.7l-0.5,3.1l2.8-1.5c0.2-0.1,0.5-0.1,0.7,0l2.8,1.5l-0.5-3.1
	c0-0.2,0-0.5,0.2-0.7l2.2-2.2l-3.1-0.4c-0.2,0-0.5-0.2-0.6-0.4L24.5,137.5L24.5,137.5z"/>

<text transform="matrix(1 0 0 1 44.0453 147) translate(0, 25)" class="mono st5 size12">${stargazers} stars contributed to</text>

<g transform="translate(0, 25)">
	<path class="st4" d="M12.5,164.8c0-0.4,0.3-0.8,0.8-0.8h5c0.4,0,0.8,0.3,0.8,0.8s-0.3,0.8-0.8,0.8h-5
		C12.8,165.6,12.5,165.2,12.5,164.8z M30,164.8c0-0.4,0.3-0.8,0.8-0.8h5c0.4,0,0.8,0.3,0.8,0.8s-0.3,0.8-0.8,0.8h-5
		C30.3,165.6,30,165.2,30,164.8z"/>
	<path class="st4" d="M24.5,170.8c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S27.8,170.8,24.5,170.8z M24.5,169.3c2.5,0,4.5-2,4.5-4.5
		s-2-4.5-4.5-4.5l0,0c-2.5,0-4.5,2-4.5,4.5S22,169.3,24.5,169.3z"/>
</g>

<text transform="matrix(1 0 0 1 44.0453 170) translate(0, 25)" class="mono st5 size12">${commits} commits in last year</text>

<path transform="translate(0, 25)"
class="st4" d="M18.5,185.4c0-1.9,1.6-3.5,3.5-3.5c1.9,0,3.5,1.6,3.5,3.5c0,1-0.4,1.9-1.1,2.5c1.6,0.8,2.7,2.3,3,4.1
	c0.1,0.4-0.2,0.8-0.6,0.9c-0.4,0.1-0.8-0.2-0.9-0.6l0,0c-0.3-2.2-2.4-3.7-4.6-3.3c-1.7,0.3-3,1.6-3.3,3.3c-0.1,0.4-0.4,0.7-0.9,0.6
	c-0.4-0.1-0.7-0.4-0.6-0.9c0,0,0,0,0,0c0.3-1.8,1.4-3.3,3-4.1C18.9,187.3,18.5,186.4,18.5,185.4z M27.5,183.9c1.7,0,3,1.3,3,3
	c0,0.7-0.3,1.5-0.8,2c1.2,0.6,2.2,1.7,2.6,3c0.1,0.4-0.1,0.8-0.5,0.9c-0.1,0-0.3,0-0.4,0c-0.3-0.1-0.5-0.3-0.5-0.5
	c-0.4-1.2-1.3-2.1-2.5-2.4c-0.3-0.1-0.6-0.4-0.6-0.7V189c0-0.3,0.2-0.5,0.4-0.7c0.7-0.4,1-1.3,0.7-2c-0.3-0.5-0.8-0.8-1.3-0.8
	c-0.4,0-0.8-0.3-0.8-0.8S27.1,183.9,27.5,183.9z M22,183.4c-1.1,0-2,0.8-2,2s0.8,2,2,2c0,0,0.1,0,0.1,0c1.1,0,2-0.9,2-2
	C24,184.3,23.1,183.5,22,183.4z"/>

<text transform="matrix(1 0 0 1 44.0453 193) translate(0, 25)" class="mono st5 size12">${followers} followers</text>


</svg>

`

    return svg;
}

module.exports = generateSVG;