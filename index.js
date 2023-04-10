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
	axios.post(apiUrl, {
		"chat_id": chatId,
		"text": `${statuses[status]} Build ${status}, branch: ${branch}`,
		"parse_mode": "MarkdownV2"
	}).then(r => console.log(r)).catch(e => console.log(e));
} catch (error) {
  	core.setFailed(error.message);
}