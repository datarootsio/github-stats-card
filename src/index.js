const core = require('@actions/core');
const github = require('@actions/github');
const collectStats = require('./stats');
const renderBadge = require('./renderBadge');

try {
  const username = core.getInput('username');
  console.log(`Hello ${username}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

collectStats('bart6114').then(stats => {renderBadge(stats)});