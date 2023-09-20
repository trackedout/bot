import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
    constructor(cb: CrossBuild) {
        super("ping", "command", cb, {
            description: "Ping!"
        })
    }

    override async run(interaction: ReceivedInteraction) {
        await interaction.reply("Pong!")
    }
}
