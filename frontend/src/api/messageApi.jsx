
import axios from 'axios';
import {BASE_URL} from './baseApi';
import {getOrCreateStompClient} from './stompClient';
import { number } from 'sockjs-client/lib/utils/random';

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

export function postRoom(roomName, username) {
    const formData = new FormData();
    formData.append('roomname', roomName);
    formData.append('username', username);
    formData.append('numberMembers', 1);
    return axios({
      method: 'post',
      url: `${BASE_URL}/room`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export function postJoinRoom(roomName, username) {
  const values = {
    username: username
  }
  return axios.post(`${BASE_URL}/joinroom/${roomName}`, values);
}

export function postLeaveRoom(roomName, username) {
const values = {
    username: username
  }
  return axios.post(`${BASE_URL}/leaveroom/${roomName}`, values);
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


  