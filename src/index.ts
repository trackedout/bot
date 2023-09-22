import { CrossBuild, DiscordInteractionModule } from "crossbuild";
import { checkYt } from "./youtube.js";
// import { loadTwitch } from "./twitch.js";
import { PrismaClient } from "@prisma/client";

export const roles = {
    video: "1153761322043986042",
    vod: "1153765954774372484",
    stream: "1153765972491128915",
};

const discord = new DiscordInteractionModule({
    name: "discord",
    token: process.env.DISCORD_TOKEN!,
    options: {
        intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildWebhooks"],
    },
});

const bot = new CrossBuild({
    name: "Tracked Out",
    modules: [discord],
    componentPaths: ["/components"],
    customChecks: [],
});

bot.on("ready", async () => {
    console.log("Ready");
    console.log(bot);
    checkYt.trigger()
});

bot.on("debug", (msg) => {
    console.log(msg);
});

export const sendAlert = async (
    data: {
        title: string;
        author: string;
        url: string;
        imageUrl: string;
        timestamp: Date;
    },
    type: keyof typeof roles
) => {
    const embed = {
        title: data.title,
        url: data.url,
        image: {
            url: data.imageUrl,
        },
        footer: {
            text: "Uploaded at",
        },
        timestamp: data.timestamp.toISOString(),
    };
    const channel = await discord.client.channels.fetch("1153717537985536061");
    if (!channel || !channel.isTextBased())
        throw new Error("Channel not found");

    await channel.send({
        content: `<@&${roles[type]}> from ${data.author}`,
        embeds: [embed],
    });
};

// loadTwitch(bot);

export const prisma = new PrismaClient();
