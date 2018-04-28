'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var setRoomUrl = exports.setRoomUrl = function setRoomUrl(url) {
	return {
		type: 'SET_ROOM_URL',
		payload: { url: url }
	};
};

var setRoomState = exports.setRoomState = function setRoomState(state) {
	return {
		type: 'SET_ROOM_STATE',
		payload: { state: state }
	};
};

var setRoomActiveSpeaker = exports.setRoomActiveSpeaker = function setRoomActiveSpeaker(peerName) {
	return {
		type: 'SET_ROOM_ACTIVE_SPEAKER',
		payload: { peerName: peerName }
	};
};

var setMe = exports.setMe = function setMe(_ref) {
	var peerName = _ref.peerName,
	    displayName = _ref.displayName,
	    displayNameSet = _ref.displayNameSet,
	    device = _ref.device;

	return {
		type: 'SET_ME',
		payload: { peerName: peerName, displayName: displayName, displayNameSet: displayNameSet, device: device }
	};
};

var setMediaCapabilities = exports.setMediaCapabilities = function setMediaCapabilities(_ref2) {
	var canSendMic = _ref2.canSendMic,
	    canSendWebcam = _ref2.canSendWebcam,
	    canSendScreenShare = _ref2.canSendScreenShare;

	return {
		type: 'SET_MEDIA_CAPABILITIES',
		payload: { canSendMic: canSendMic, canSendWebcam: canSendWebcam }
	};
};

var setCanChangeWebcam = exports.setCanChangeWebcam = function setCanChangeWebcam(flag) {
	return {
		type: 'SET_CAN_CHANGE_WEBCAM',
		payload: flag
	};
};

var setDisplayName = exports.setDisplayName = function setDisplayName(displayName) {
	return {
		type: 'SET_DISPLAY_NAME',
		payload: { displayName: displayName }
	};
};

var setAudioOnlyState = exports.setAudioOnlyState = function setAudioOnlyState(enabled) {
	return {
		type: 'SET_AUDIO_ONLY_STATE',
		payload: { enabled: enabled }
	};
};

var setAudioOnlyInProgress = exports.setAudioOnlyInProgress = function setAudioOnlyInProgress(flag) {
	return {
		type: 'SET_AUDIO_ONLY_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setRestartIceInProgress = exports.setRestartIceInProgress = function setRestartIceInProgress(flag) {
	return {
		type: 'SET_RESTART_ICE_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var addProducer = exports.addProducer = function addProducer(producer) {
	return {
		type: 'ADD_PRODUCER',
		payload: { producer: producer }
	};
};

var removeProducer = exports.removeProducer = function removeProducer(producerId) {
	return {
		type: 'REMOVE_PRODUCER',
		payload: { producerId: producerId }
	};
};

var setProducerPaused = exports.setProducerPaused = function setProducerPaused(producerId, originator) {
	return {
		type: 'SET_PRODUCER_PAUSED',
		payload: { producerId: producerId, originator: originator }
	};
};

var setProducerResumed = exports.setProducerResumed = function setProducerResumed(producerId, originator) {
	return {
		type: 'SET_PRODUCER_RESUMED',
		payload: { producerId: producerId, originator: originator }
	};
};

var setProducerTrack = exports.setProducerTrack = function setProducerTrack(producerId, track) {
	return {
		type: 'SET_PRODUCER_TRACK',
		payload: { producerId: producerId, track: track }
	};
};

var setWebcamInProgress = exports.setWebcamInProgress = function setWebcamInProgress(flag) {
	return {
		type: 'SET_WEBCAM_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setMicInProgress = exports.setMicInProgress = function setMicInProgress(flag) {
	return {
		type: 'SET_MIC_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setScreenShareInProgress = exports.setScreenShareInProgress = function setScreenShareInProgress(flag) {
	return {
		type: 'SET_SCREENSHARE_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var addPeer = exports.addPeer = function addPeer(peer) {
	return {
		type: 'ADD_PEER',
		payload: { peer: peer }
	};
};

var removePeer = exports.removePeer = function removePeer(peerName) {
	return {
		type: 'REMOVE_PEER',
		payload: { peerName: peerName }
	};
};

var setPeerDisplayName = exports.setPeerDisplayName = function setPeerDisplayName(displayName, peerName) {
	return {
		type: 'SET_PEER_DISPLAY_NAME',
		payload: { displayName: displayName, peerName: peerName }
	};
};

var addConsumer = exports.addConsumer = function addConsumer(consumer, peerName) {
	return {
		type: 'ADD_CONSUMER',
		payload: { consumer: consumer, peerName: peerName }
	};
};

var removeConsumer = exports.removeConsumer = function removeConsumer(consumerId, peerName) {
	return {
		type: 'REMOVE_CONSUMER',
		payload: { consumerId: consumerId, peerName: peerName }
	};
};

var setConsumerPaused = exports.setConsumerPaused = function setConsumerPaused(consumerId, originator) {
	return {
		type: 'SET_CONSUMER_PAUSED',
		payload: { consumerId: consumerId, originator: originator }
	};
};

var setConsumerResumed = exports.setConsumerResumed = function setConsumerResumed(consumerId, originator) {
	return {
		type: 'SET_CONSUMER_RESUMED',
		payload: { consumerId: consumerId, originator: originator }
	};
};

var setConsumerEffectiveProfile = exports.setConsumerEffectiveProfile = function setConsumerEffectiveProfile(consumerId, profile) {
	return {
		type: 'SET_CONSUMER_EFFECTIVE_PROFILE',
		payload: { consumerId: consumerId, profile: profile }
	};
};

var setConsumerTrack = exports.setConsumerTrack = function setConsumerTrack(consumerId, track) {
	return {
		type: 'SET_CONSUMER_TRACK',
		payload: { consumerId: consumerId, track: track }
	};
};

var addNotification = exports.addNotification = function addNotification(notification) {
	return {
		type: 'ADD_NOTIFICATION',
		payload: { notification: notification }
	};
};

var removeNotification = exports.removeNotification = function removeNotification(notificationId) {
	return {
		type: 'REMOVE_NOTIFICATION',
		payload: { notificationId: notificationId }
	};
};

var removeAllNotifications = exports.removeAllNotifications = function removeAllNotifications() {
	return {
		type: 'REMOVE_ALL_NOTIFICATIONS'
	};
};