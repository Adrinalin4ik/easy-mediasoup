export function getProtooUrl({media_server_wss, roomId, peerId, forceH264 })
{
	const hostname = window.location.hostname;
	// const url = `wss://${hostname}:3443/?peerName=${peerName}&roomId=${roomId}`;
	// const url = `wss://demo.mediasoup.org:3443/?peerName=${peerName}&roomId=${roomId}`;
	if (!media_server_wss) console.error("config.media_server_wss don't set.")
	let url = media_server_wss+`/?peerId=${peerId}&roomId=${roomId}`;

	if (forceH264)
		url = `${url}&forceH264=true`;

	return url;
}
