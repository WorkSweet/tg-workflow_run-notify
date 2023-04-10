const core = require('@actions/core');
const github = require('@actions/github');

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
    
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.send();
} catch (error) {
  	core.setFailed(error.message);
}