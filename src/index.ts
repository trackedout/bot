import { CrossBuild, DiscordInteractionModule } from "crossbuild"

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
    componentPaths: ["/src/components"],
    customChecks: []
})

bot.on("ready", () => {
    console.log("Ready")
})

bot.on("debug", (msg) => {
    console.log(msg)
})
