const talkedRecently = new Set();
const { xpAdd, setupCheck } = require("../functions.js");

module.exports = async (client, msg) => {
    if (!msg.guild || msg.author.bot) return;
    client.settings.ensure(msg.guild.id, defaultSettings);
    prefix = client.settings.get(msg.guild.id, "prefix");
    //mention bot
    if (msg.mentions.has(client.user) && !msg.content.includes("@here") && !msg.content.includes("@everyone")) {
        msg.reply('Hey! Type .help for more info! :smiley:');
        if(msg.member.hasPermission("ADMINISTRATOR")){ //if admin check for setup
            if (setupCheck(client, msg) === false) return msg.channel.send (":warning: Ops! It looks like you didn't complete the setup. Type .setup to create preset channels, roles, channel categories, etc...\nDon't worry you can later rename them.")
        }
    }
    //xp
    if (msg.guild && !msg.content.startsWith(prefix) && !talkedRecently.has(msg.author.id) && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) {
        xpAdd(client, msg, talkedRecently);
    }
    //old main
    if (!msg.content.startsWith(prefix) && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return;
    if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
    //music-text-channel doesn't need .play command
    if (msg.channel.id === client.settings.get(msg.guild.id, "musictextchannel") && !msg.content.startsWith(prefix)) {
        var MTC_state = true;
        let cmdplay = client.commands.get("play");
        return cmdplay.run(client, msg, MTC_state);
    }
    //commands stuff
    const arg = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = arg.shift().toLowerCase();
    //command handler
    if (cmd.length === 0) return;
    let commandh = client.commands.get(cmd);
    if (!commandh) commandh = client.commands.get(client.aliases.get(cmd));
    if (commandh) {
        if (client.settings.includes(msg.guild.id, commandh.name, "disabledcommands")) return msg.reply(`\`${commandh.name}\` is disabled on this server!`).then(msg => msg.delete({ timeout: 5000 })); //check if command is disabled on the guild
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
        commandh.run(client, msg, arg);
    }
    else { //custom command loader
        if (!client.customcmd.has(msg.guild.id)) return;
        else if(client.customcmd.has(msg.guild.id, cmd)) {
            if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
            let custommsg = client.customcmd.get(msg.guild.id, cmd);
            msg.channel.send(custommsg);
        }
    }
};

const defaultSettings = {
	prefix: ".",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true",
	autovocalchannels: [],
	autovocalcloned: [],
	disabledcommands: []
}