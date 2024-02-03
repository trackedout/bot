import {
    Component,
    CrossBuild,
    OptionsHandler,
    ReceivedInteraction,
    uploadHaste,
} from "crossbuild";

import { hermits } from "../hermits.js";
import { getLatestVideo, getLatestVideoRaw } from "../youtube.js";

export default class Cmd extends Component {
    constructor(cb: CrossBuild) {
        super("latest-video", "command", cb, {
            description: "Get the latest video from a Hermitcraft member",
            options: [
                {
                    type: "string",
                    name: "hermit",
                    description: "The Hermit to get the latest video from",
                    required: true,
//                    choices: hermits.map((hermit) => ({
//                        name: hermit.name,
//                        value: hermit.name,
//                    })),
                },
                {
                    type: "boolean",
                    name: "second-channel",
                    description:
                        "Do you want to get the latest video from the Hermit's second channel?",
                    required: false,
                },
                {
                    type: "boolean",
                    name: "raw",
                    description: "Do you want the raw data?",
                    required: false,
                }
            ],
        });
    }

    override async run(
        interaction: ReceivedInteraction,
        options: OptionsHandler
    ) {
        const hermitName = options.getString("hermit")!;
        const secondChannel = options.getBoolean("second-channel") ?? false;
        const raw = options.getBoolean("raw") ?? false;
        const hermit = hermits.find((hermit) => hermit.name === hermitName)!;
        if(raw) {
            const rawData = await getLatestVideoRaw(secondChannel ? hermit.secondChannelId! : hermit.channelId)
            const haste = await uploadHaste(rawData, "undefined", "xml", "https://hst.sh")
            return interaction.reply(`${haste}`)
        }
        if (secondChannel && !hermit.secondChannelId)
            return interaction.reply(
                `**${hermit.name}** doesn't have a second channel!`
            );
        const data = await getLatestVideo(
            secondChannel ? hermit.secondChannelId! : hermit.channelId
        );
        if (data) {
            await interaction.reply({
                content: `Here is the latest video from **${hermit.name}${
                    secondChannel ? "'s** second channel!" : "**"
                }!`,
                embeds: [
                    {
                        title: data.title,
                        url: `https://youtu.be/${data.videoId}`,
                        image: {
                            url: data.thumbnail,
                        },
                        footer: {
                            text: "Uploaded at",
                        },
                        timestamp: data.timestamp.toISOString(),
                    },
                ],
            });
        }
    }
}

/*




*/
