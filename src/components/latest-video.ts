import {
	ApplicationCommandOptionType,
	type AutocompleteInteraction,
	Command,
	type CommandInteraction
} from "@buape/carbon"

import { hermits } from "../hermits.js"
import { HermitVideo } from "../premades/hermitVideo.js"
import { uploadHaste } from "../utils.js"
import { getLatestVideo, getLatestVideoRaw } from "../youtube.js"

export default class LatestVideoCommand extends Command {
	name = "latest-video"
	description = "Get the latest video from a Hermitcraft member"
	options = [
		{
			type: ApplicationCommandOptionType.String as const,
			name: "hermit",
			description: "The Hermit to get the latest video from",
			required: true,
			autocomplete: async (interaction: AutocompleteInteraction) => {
				const options = hermits.map((hermit) => ({
					name: hermit.name,
					value: hermit.name
				}))
				const currentValue = interaction.options?.getString("hermit") ?? ""
				options.filter((option) =>
					currentValue
						? option.name.toLowerCase().includes(currentValue.toLowerCase())
						: true
				)
				return await interaction.respond(options.slice(0, 25))
			}
		},
		{
			type: ApplicationCommandOptionType.Boolean as const,
			name: "second-channel",
			description:
				"Do you want to get the latest video from the Hermit's second channel?",
			required: false
		},
		{
			type: ApplicationCommandOptionType.Boolean as const,
			name: "raw",
			description: "Do you want the raw data?",
			required: false
		}
	]

	override async run(interaction: CommandInteraction) {
		const hermitName = interaction.options.getString("hermit", true)
		const secondChannel =
			interaction.options.getBoolean("second-channel") ?? false
		const raw = interaction.options.getBoolean("raw") ?? false
		const hermit = hermits.find((hermit) => hermit.name === hermitName)
		if (!hermit) return interaction.reply(`**${hermitName}** is not a hermit!`)
		if (raw) {
			const rawData = await getLatestVideoRaw(
				secondChannel ? hermit.secondChannelId! : hermit.channelId
			)
			const haste = await uploadHaste(
				rawData,
				"Tracked Out https://trackedout.org",
				"xml",
				"https://hst.sh"
			)
			return interaction.reply(`${haste}`)
		}
		if (secondChannel && !hermit.secondChannelId)
			return interaction.reply(
				`**${hermit.name}** doesn't have a second channel!`
			)
		const data = await getLatestVideo(
			secondChannel ? hermit.secondChannelId! : hermit.channelId
		)
		if (data) {
			await interaction.reply({
				content: `Here is the latest video from **${hermit.name}${
					secondChannel ? "'s** second channel!" : "**"
				}!`,
				embeds: [new HermitVideo(data)]
			})
		}
	}
}

/*




*/
