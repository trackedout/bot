import { Embed } from "@buape/carbon"
import { client } from ".."
import type { channelTypes, roleTypes } from "../config"
import { channels, roles } from "../config"
import type { Video } from "../youtube"
export class HermitVideo extends Embed {
	constructor(data: Video) {
		super({
			title: data.title,
			url: `https://youtu.be/${data.videoId}`,
			image: {
				url: data.thumbnail
			},
			footer: {
				text: "Uploaded at"
			},
			timestamp: data.timestamp.toISOString()
		})
	}
}

export const sendAlert = async (
	video: Video,
	type: roleTypes,
	channelType: channelTypes
) => {
	const embed = new HermitVideo(video)
	const channel = await client.fetchChannel(channels[channelType])
	if (!channel || !("send" in channel)) throw new Error("Channel not found")

	await channel.send({
		content: `<@&${roles[type]}> from ${video.author}`,
		embeds: [embed]
	})
}
