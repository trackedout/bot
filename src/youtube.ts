import { DOMParser, XMLSerializer } from "xmldom";

export type Video = {
    videoId: string;
    title: string;
    author: string;
    description: string;
    thumbnail: string;
    timestamp: Date;
};

export const getLatestVideoRaw = async (channelId: string): Promise<string> => {
    const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );
    const text = await res.text();
    const str = new DOMParser().parseFromString(text, "text/xml");
    const latestVid = str.getElementsByTagName("entry")[0];
    return new XMLSerializer().serializeToString(latestVid);
};

export const getLatestVideo = async (channelId: string): Promise<Video> => {
    const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );
    const text = await res.text();
    const str = new DOMParser().parseFromString(text, "text/xml");
    const latestVid = str.getElementsByTagName("entry")[0];
    const description = latestVid
        .getElementsByTagName("media:group")[0]
        .getElementsByTagName("media:description")[0].childNodes[0]?.textContent || "No description";
    const data = {
        videoId:
            latestVid.getElementsByTagName("yt:videoId")[0].childNodes[0]?.textContent || "No ID",
        title: latestVid.getElementsByTagName("title")[0].childNodes[0]?.textContent || "No Title",
        author: latestVid
            .getElementsByTagName("author")[0]
            .getElementsByTagName("name")[0].childNodes[0]?.textContent || "No Author",
        description,
        thumbnail: `https://i2.ytimg.com/vi/${latestVid.getElementsByTagName(
            "yt:videoId"
        )[0].childNodes[0]?.textContent || "No ID"}/hqdefault.jpg`,
        timestamp: new Date(
            latestVid.getElementsByTagName(
                "published"
            )[0].childNodes[0]?.textContent || new Date()
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
                await checkChannel(
                    hermit.secondChannelId,
                    `${hermit.name} 2`,
                    "vod"
                );
        })
    );
});

const checkChannel = async (
    channelId: string,
    name: string,
    type: keyof typeof roles
) => {
    const video = await getLatestVideo(channelId);
    const lastLogged = await prisma.video.findUnique({
        where: {
            channelId_videoId: {
                channelId,
                videoId: video.videoId,
            },
        },
    });
    if (!lastLogged || lastLogged.videoId !== video.videoId) {
        console.log(`New video for ${name}`, video);
        await prisma.video.create({
            data: {
                videoId: video.videoId,
                channelId,
            },
        });
        sendAlert(
            {
                title: video.title,
                author: video.author,
                url: `https://youtu.be/${video.videoId}`,
                imageUrl: video.thumbnail,
                timestamp: video.timestamp,
            },
            (type = video.description.includes("Stream Chat") ? "stream" : type),
            (type = video.description.includes("Stream Chat") ? "stream" : type)
        )
    } else {
        console.log(`No new video:`, name);
    }
};
