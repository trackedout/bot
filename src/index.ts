import { Client } from "@buape/carbon"
import { GatewayIntents, GatewayPlugin } from "@buape/carbon/gateway"
import LatestVideoCommand from "./components/latest-video.js"
import PingCommand from "./components/ping.js"
import { checkYt } from "./youtube.js"

export const client = new Client(
	{
		clientId: process.env.DISCORD_CLIENT_ID!,
		token: process.env.DISCORD_TOKEN!,
		baseUrl: "http://localhost:3000",
		publicKey: "a",
		autoDeploy: true,
		deploySecret: "a"
	},
	{
		commands: [new PingCommand(), new LatestVideoCommand()]
	},
	[
		new GatewayPlugin({
			intents:
				GatewayIntents.Guilds |
				GatewayIntents.GuildMessages |
				GatewayIntents.MessageContent,
			autoInteractions: true
		})
	]
)

checkYt.trigger()
