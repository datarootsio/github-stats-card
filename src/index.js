// const core = require('@actions/core');
// const github = require('@actions/github');
// const collectStats = require('./collectStats');
// const generateSvg = require('./generateSvg');
// const _ = require('./config');
// // try {
// //   const username = core.getInput('username');
// //   console.log(`Hello ${username}!`);
// //   const time = (new Date()).toTimeString();
// //   core.setOutput("time", time);
// //   // Get the JSON webhook payload for the event that triggered the workflow
// //   const payload = JSON.stringify(github.context.payload, undefined, 2)
// //   console.log(`The event payload: ${payload}`);
// // } catch (error) {
// //   core.setFailed(error.message);
// // }


// const userName = "bart6114"
// collectStats(userName).then(stats => generateSvg({
//   stats, username: userName,
//   about: "He/him, cheese, dad, data,\nrocks & trails."
// })).then(console.log)

