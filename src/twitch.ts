// import { RefreshingAuthProvider } from "@twurple/auth";
// import { ApiClient } from "@twurple/api";
// import { EventSubWsListener } from "@twurple/eventsub-ws";
// import { prisma, sendAlert } from "./index.js";
// import { CrossBuild } from "crossbuild";

// const clientId = process.env.TWITCH_CLIENT_ID!;
// const accessToken = process.env.TWITCH_ACCESS_TOKEN!;
// const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
// const refreshToken = process.env.TWITCH_REFRESH_TOKEN!;

// const tokenData = JSON.parse(
//     (
//         await prisma.kv.findFirst({
//             where: {
//                 key: "twitchToken",
//             },
//         }) || ""
//     )?.value
// );

// const authProvider = new RefreshingAuthProvider({
//     clientId,
//     clientSecret,
// });

// authProvider.onRefresh(
//     async (_userId, newTokenData) =>
//         await prisma.kv.upsert({
//             where: {
//                 key: "twitchToken",
//             },
//             update: {
//                 value: JSON.stringify(newTokenData),
//             },
//             create: {
//                 key: "twitchToken",
//                 value: JSON.stringify(newTokenData),
//             },
//         })
// );

// await authProvider.addUserForToken(tokenData, ["chat"]);

// const apiClient = new ApiClient({ authProvider });

// export const loadTwitch = async (_client: CrossBuild) => {
//     const listener = new EventSubWsListener({ apiClient });
//     listener.start();

//     listener.onStreamOnline("956490146", async (event) => {
//         console.log(event);
//         const stream = await event.getStream();
//         const broadcaster = await event.getBroadcaster();
//         sendAlert(
//             {
//                 title: `${event.broadcasterDisplayName} is live!`,
//                 url: `https://twitch.tv/${broadcaster.name}`,
//                 imageUrl: stream?.thumbnailUrl ?? broadcaster.profilePictureUrl,
//                 timestamp: event.startDate,
//             },
//             "stream"
//         );
//     });
// };
