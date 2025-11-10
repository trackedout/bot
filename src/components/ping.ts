import { Command, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "ping"
	description = "Ping the bot"

	async run(interaction: CommandInteraction) {
		await interaction.reply("Pong!")
	}
}
