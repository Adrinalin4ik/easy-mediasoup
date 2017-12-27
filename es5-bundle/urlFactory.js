"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getProtooUrl = getProtooUrl;
function getProtooUrl(media_server_wss, peerName, roomId) {
	var hostname = window.location.hostname;
	// const url = `wss://${hostname}:3443/?peerName=${peerName}&roomId=${roomId}`;
	// const url = `wss://demo.mediasoup.org:3443/?peerName=${peerName}&roomId=${roomId}`;
	if (!media_server_wss) console.error("config.media_server_wss don't set.");
	var url = media_server_wss + ("/?peerName=" + peerName + "&roomId=" + roomId);

	return url;
}