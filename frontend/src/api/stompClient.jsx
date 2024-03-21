import SockJS from 'sockjs-client';
import {BASE_URL} from './baseApi';
import Stomp from 'stompjs';

let stompClient;

export function getOrCreateStompClient() {
  if (stompClient) {
    return stompClient;
  }
  const socket = new SockJS(`${BASE_URL}/chat`);
  // @ts-ignore
  stompClient = Stomp.over(socket);
  stompClient.debug = () => {};
  return stompClient;
}