const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')
try {
	const statuses = {
		"started": "❕", 
		"failure": "❗",
		"success": "✅", 
		"cancelled": "❕"
	};
	
	const status = core.getInput('status');
	if(!statuses[status]) throw Error("Status not found!");

	const botId = core.getInput("token");
	if(!botId) throw Error("Token not found!");

	const chatId = core.getInput("to");
	if(!chatId) throw Error("Chat Id not found");

	const branch = core.getInput("branch");
	if(!branch) throw Error("Branch not found");

    let apiUrl = "https://api.telegram.org/bot{botId}/sendMessage".replace("{botId}", botId);

	const { eventName, workflow, job, runId, actor, ref, sha } = github.context;
	const { owner, repo } = github.context.repo;
	const shortRef = ref.replace(/^refs\/heads\//, '');
	const shortSha = sha.slice(0, 7);

	const a = escapeEntities(`${owner}/${repo}`);
	const shortRefE = escapeEntities(shortRef);
	const workflowE = escapeEntities(workflow);
	const jobE = escapeEntities(job);
	const actorE = escapeEntities(actor);
	const eventNameE = escapeEntities(eventName);
	const link = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
	const text = `
*${a}* ${shortRefE}\\(${shortSha}\\)
${workflowE} ${jobE} ${status}
Triggered by ${actorE} with a ${eventNameE} event
[View details](${link})
`;
	axios.post(apiUrl, {
		"chat_id": chatId,
		"text": `${statuses[status]} Build ${status}, branch: ${branch}::` + text,
		"parse_mode": "MarkdownV2"
	}).then(r => console.log(r)).catch(e => console.log(e));
} catch (error) {
  	core.setFailed(error.message);
}

function escapeEntities(input) {
  const len = input.length;
  let output = '';
  for (let i = 0; i < len; i++) {
    const c = input[i];
    if (charsNeedEscape.indexOf(c) >= 0) {
      output += '\\' + c;
    } else {
      output += c;
    }
  }
  return output;
}