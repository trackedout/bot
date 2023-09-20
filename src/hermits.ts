type Hermit = {
    name: string;
    emoji: `${number}`;
    channelId: string;
    twitch?: string;
};

export const hermits = [
    {
        name: "BdoubleO100",
        emoji: "1153640908852580394",
        channelId: "UClu2e7S8atp6tG2galK9hgg",
    },
] as const satisfies readonly Hermit[];
