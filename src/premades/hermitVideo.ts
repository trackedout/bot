import { Embed } from "@buape/carbon"
import type { channelTypes, roleTypes } from "../config.js"
import { channels, roles } from "../config.js"
import { client } from "../index.js"
import type { Video } from "../youtube.js"
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
