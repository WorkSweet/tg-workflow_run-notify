const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

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

	const branch = core.getInput("branch");
	if(!branch) throw Error("Branch not found");

    const message = `${statuses[status]} Build ${status}, branch: ${branch}`;
	var url = `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}text=${message}&parse_mode=MarkdownV2`;
    https.get(url, r=> console.log(r));
} catch (error) {
  	core.setFailed(error.message);
}