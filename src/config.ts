export const roles = {
	video: "1153761322043986042",
	vod: "1153765954774372484",
	stream: "1153765972491128915"
} as const

export const channels = {
	video: "1238129448960786533",
	vod: "1153717537985536061",
	stream: "1153717537985536061"
} as const

export type roleTypes = keyof typeof roles
export type channelTypes = keyof typeof channels
