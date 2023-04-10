const core = require('@actions/core');
const github = require('@actions/github');
const nfetch = require('node-fetch');
try {
	const statuses = {
		"started": "❕", 
		"failure": "❗",
		"success": "✅", 
		"canceled": "❕"
	};
	
	const status = core.getInput('status');
	if(!statuses[status]) throw Error("Status not found!");

	const botId = core.getInput("token");
	if(!botId) throw Error("Token not found!");

	const chatId = core.getInput("to");
	if(!chatId) throw Error("Chat Id not found");

    let apiUrl = "https://api.telegram.org/bot{botId}/sendMessage".replace("{botId}", botId);
	nfetch.fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: {
			"chat_id": chatId,
			"text": `${statuses[status]} Build ${status}, branch: ${github.event.workflow_run.head_branch}`,
			"parse_mode": "MarkdownV2"
		}
	});
} catch (error) {
  	core.setFailed(error.message);
}