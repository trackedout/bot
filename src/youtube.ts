import { DOMParser } from "xmldom";

export type Video = {
    videoId: string;
    title: string;
    thumbnail: string;
    timestamp: Date;
};

export const getLatestVideo = async (channelId: string): Promise<Video> => {
    const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );
    const text = await res.text();
    const str = new DOMParser().parseFromString(text, "text/xml");
    const latestVid = str.getElementsByTagName("entry")[0];
    const data = {
        videoId:
            latestVid.getElementsByTagName("yt:videoId")[0].childNodes[0]
                .textContent!,
        title: latestVid.getElementsByTagName("title")[0].childNodes[0]
            .textContent!,
        thumbnail: `https://i2.ytimg.com/vi/${latestVid.getElementsByTagName(
            "yt:videoId"
        )[0].childNodes[0].textContent!}/hqdefault.jpg`,
        timestamp: new Date(
            latestVid.getElementsByTagName(
                "published"
            )[0].childNodes[0].textContent!
        ),
    };
    return data;
};

import { Cron } from "croner";
import { hermits } from "./hermits.js";
import { prisma, roles, sendAlert } from "./index.js";

export const checkYt = Cron("* * * * *", async () => {
    console.log("Checking YouTube");
    await Promise.allSettled(
        hermits.map(async (hermit) => {
            await checkChannel(hermit.channelId, hermit.name, "video");
            if (hermit.secondChannelId)
                await checkChannel(hermit.secondChannelId, hermit.name, "vod");
        })
    );
});

const checkChannel = async (
    channelId: string,
    name: string,
    type: keyof typeof roles
) => {
    const video = await getLatestVideo(channelId);
    const lastLogged = await prisma.latestVideo.findFirst({
        where: {
            channelId: channelId,
        },
    });
    if (!lastLogged || lastLogged.videoId !== video.videoId) {
        console.log(`New video for ${name}`, video);
        sendAlert(
            {
                title: video.title,
                url: `https://youtu.be/${video.videoId}`,
                imageUrl: video.thumbnail,
                timestamp: video.timestamp,
            },
            type
        );
    } else {
        console.log(`No new video:`, name);
    }
    await prisma.latestVideo.upsert({
        where: {
            channelId: channelId,
        },
        update: {
            videoId: video.videoId,
        },
        create: {
            channelId: channelId,
            videoId: video.videoId,
        },
    });
};
