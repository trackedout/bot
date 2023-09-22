import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
    constructor(cb: CrossBuild) {
        super("streamsquads", "command", cb, {
            description: "Get a streamsquads link!"
        })
    }

    override async run(interaction: ReceivedInteraction) {
        
    }
}
