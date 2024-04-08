
import axios from 'axios';
import {BASE_URL} from './baseApi';
import {getOrCreateStompClient} from './stompClient';

export function loadMessages() {
  return axios.get(`${BASE_URL}/message`);
}

export function loadMessagesRoom(roomName) {
    return axios.get(`${BASE_URL}/message/${roomName}`);
}

export function loadRooms() {
    return axios.get(`${BASE_URL}/room`);
}

export function loadRoomByName(roomName) {
    return axios.get(`${BASE_URL}/room/${roomName}`);
}

export function postLockRoom(roomName) {
    return axios.post(`${BASE_URL}/lockroom/${roomName}`);
}

export function postUnlockRoom(roomName) {
    return axios.post(`${BASE_URL}/unlockroom/${roomName}`);
}

export function postRoom(roomName) {
    const formData = new FormData();
    formData.append('roomName', roomName);
    formData.append('numberMembers', 1);
    return axios.post(`${BASE_URL}/room`, formData);
}

export function postJoinRoom(roomName) {
    return axios.post(`${BASE_URL}/joinroom/${roomName}`);
}

export function postLeaveRoom(roomName) {
    return axios.post(`${BASE_URL}/leaveroom/${roomName}`);
}

export function subscribeOnNewMessages(onNewMessage) {
  let stompClient = getOrCreateStompClient();
  stompClient.connect({}, () => {
    console.log("Connected");
    stompClient.subscribe('/topic/message', onNewMessage);
  });
}


export function postMessage({userName, message, room, chatColor}) {
  let stompClient = getOrCreateStompClient();
  const transaction = stompClient.begin();
  stompClient.send(`/ws/message/${room.roomName}`, {}, JSON.stringify({
    content: message,
    userName: userName,
    roomName: room.roomName,
    chatColor: chatColor
  }));
  transaction.commit();
}

export function postSystemMessage({message, roomName}) {
    let stompClient = getOrCreateStompClient();
    const transaction = stompClient.begin();
    stompClient.send(`/ws/message/${roomName}`, {}, JSON.stringify({
      content: message,
      userName: "System",
      roomName: roomName,
      chatColor: "text-white"

    }));
    transaction.commit();
  }


  