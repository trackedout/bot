import {
    Component,
    CrossBuild,
    OptionsHandler,
    ReceivedInteraction,
} from "crossbuild";

import { hermits } from "../hermits.js";
import { getLatestVideo } from "../youtube.js";

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
                    choices: hermits.map((hermit) => ({
                        name: hermit.name,
                        value: hermit.name,
                    })),
                },
                {
                    type: "boolean",
                    name: "second-channel",
                    description:
                        "Do you want to get the latest video from the Hermit's second channel?",
                    required: false,
                },
            ],
        });
    }

    override async run(
        interaction: ReceivedInteraction,
        options: OptionsHandler
    ) {
        const hermitName = options.getString("hermit")!;
        const secondChannel = options.getBoolean("second-channel") ?? false;
        const hermit = hermits.find((hermit) => hermit.name === hermitName)!;
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
