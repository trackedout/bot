import { CrossBuild, DiscordInteractionModule } from "crossbuild"
import { hermits } from "./hermits.js"
import { getLatestVideo } from "./youtube.js"

const bot = new CrossBuild({
    name: "Tracked Out",
    modules: [
        new DiscordInteractionModule({
            name: "discord",
            token: process.env.DISCORD_TOKEN!,
            options: {
                intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildWebhooks"]
            }
        })
    ],
    componentPaths: ["/components"],
    customChecks: []
})

bot.on("ready", async () => {
    console.log("Ready")
    console.log(await getLatestVideo(hermits[0].channelId))
})

bot.on("debug", (msg) => {
    console.log(msg)
})
