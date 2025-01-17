const Discord = require("discord.js");

module.exports = {
    name: "customcommandremove",
    aliases: ["ccremove"],
    category: "Commands",
    description: "Delete a custom command",
    usage: "customcommandremove <command-name>\n**e.g.**\n\`customcommandremove randomcommand\`\n> It will delete the custom command named `randomcommand`",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ Please provide a valid custom command in order to delete it!`)
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist on this server!`)
        const nocmdyetEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ This server has not set any custom command yet!`)
            
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!client.customcmd.has(msg.guild.id)) return msg.channel.send(nocmdyetEmbed).then(msg => msg.delete({ timeout: 5000 }));

        if (!arg[0]) return msg.channel.send(noargsEmbed).then(msg => msg.delete({ timeout: 5000 }));

        let command = arg[0].toLowerCase();

        if(!client.customcmd.has(msg.guild.id, command)) return msg.channel.send(nocmdEmbed).then(msg => msg.delete({ timeout: 5000 }));

        client.customcmd.delete(msg.guild.id, command)
        const deletedEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Custom Commands')
            .setDescription(`Custom command \`${command}\` has been deleted.`)
        msg.channel.send(deletedEmbed).then(msg => msg.delete({ timeout: 10000 }));
        
    }
}
