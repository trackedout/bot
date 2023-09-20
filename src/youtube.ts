import { DOMParser } from 'xmldom'

export const getLatestVideo = async (channelId: string): Promise<{videoId: string, title: string, thumbnail: string, timestamp: Date}> => {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
    const text = await res.text()
    const str = new DOMParser().parseFromString(text, "text/xml")
    const latestVid = str.getElementsByTagName("entry")[0]
    const data = {
        videoId: latestVid.getElementsByTagName("yt:videoId")[0].childNodes[0].textContent!,
        title: latestVid.getElementsByTagName("title")[0].childNodes[0].textContent!,
        thumbnail: `https://i2.ytimg.com/vi/${latestVid.getElementsByTagName("yt:videoId")[0].childNodes[0].textContent!}/hqdefault.jpg`,
        timestamp: new Date(latestVid.getElementsByTagName("published")[0].childNodes[0].textContent!)
    }
    return data
}