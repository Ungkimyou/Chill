const Discord = require("discord.js");

module.exports = {
    name: "customcommandslist",
    aliases: ["cclist"],
    category: "Commands",
    description: "Get a list of all custom commands on this server",
    usage: "customcommandlist [command]\n**e.g.**\n\`customcommandlist\`\n> Get a list of all custom commands currently available on this server\n\`customcommandlist command1\`\n> Get info a about the custom command *command1*",
    run: async (client, msg, arg) => {
        
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist on this server!`)
        const nocmdyetEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ This server has not set any custom command yet!`)
        let ccEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Custom Commands')

        let cmdmsg = "";
        if (!client.customcmd.has(msg.guild.id)) return msg.channel.send(nocmdyetEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!arg[0]) { 
            var cmds = client.customcmd.fetch(msg.guild.id);
            for (const [key] of Object.entries(cmds)) {
                cmdmsg += (`\`${key}\` `);
            };
            ccEmbed.setDescription(cmdmsg);
            if (cmdmsg.length<=0) return msg.channel.send(nocmdyetEmbed).then(msg => msg.delete({ timeout: 5000 }));
            return msg.channel.send(ccEmbed).then(msg => msg.delete({ timeout: 30000 }));
        } else if (client.customcmd.has(msg.guild.id, arg[0])) {
            cmdmsg = `\`\`\`asciidoc\n${arg[0]} :: ${client.customcmd.get(msg.guild.id, arg[0])}\n\`\`\``
            ccEmbed.setDescription(cmdmsg);
            return msg.channel.send(ccEmbed).then(msg => msg.delete({ timeout: 10000 }));
        } else return msg.channel.send(nocmdEmbed).then(msg => msg.delete({ timeout: 5000 }));

    }
}
