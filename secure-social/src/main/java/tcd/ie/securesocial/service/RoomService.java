package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Room;
import tcd.ie.securesocial.model.RoomKey;
import tcd.ie.securesocial.repository.MessageRepository;
import tcd.ie.securesocial.repository.RoomRepository;
import tcd.ie.securesocial.repository.UserRepository;
import tcd.ie.securesocial.repository.RoomKeyRepository;
import lombok.RequiredArgsConstructor;

import tcd.ie.securesocial.model.User;
import tcd.ie.securesocial.model.UserKey;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.StreamSupport;

import static java.util.stream.Collectors.toList;

import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final MessageRepository messageRepository;
    private final RoomKeyRepository RoomKeyRepository;
    private final UserRepository userRepository;

    public RoomDto saveRoom(RoomDto uiRoom) throws NoSuchAlgorithmException {
        Room room = Room.builder()
                .roomname(HtmlUtils.htmlEscape(uiRoom.getRoomName()))
                .numbermembers(uiRoom.getNumberMembers())
                .build();
        Room savedRoom = roomRepository.save(room);
        genNewRoomKey(savedRoom);
        return RoomDto.fromRoom(savedRoom);
    }

    public List<RoomDto> getAllRooms() {
        Iterable<Room> rooms = roomRepository.findUnlockedRooms();
        return StreamSupport
                .stream(rooms.spliterator(), false)
                .sorted(Comparator.comparing(Room::getNumbermembers).reversed())
                .map(RoomDto::fromRoom)
                .collect(toList());
    }


    public RoomDto getRoomByName(String roomName) {
        System.out.println("Room Name: " + roomName);
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        return RoomDto.fromRoom(room);
    }

    public void memberJoin(String roomName, String username) throws NoSuchAlgorithmException {
        System.out.println("Joining Room: " + roomName);
        if(!roomRepository.existsByRoomname(roomName)){
            throw new IllegalArgumentException("Room does not exist");
        }
        if(roomRepository.findByRoomname(roomName).get().isLocked()){
            throw new IllegalArgumentException("Room is locked");
        }
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        roomRepository.incrementNumberMembers(roomName);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        user.getRooms().add(room);
        userRepository.save(user); 
        genNewRoomKey(room);
    }

    @Transactional
    public void memberLeave(String roomName, String username) throws NoSuchAlgorithmException {
        System.out.println("Leaving Room: " + roomName);
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        if (room.getNumbermembers() > 1) {
            roomRepository.decrementNumberMembers(roomName);
            user.getRooms().remove(room);
            userRepository.save(user); 
            genNewRoomKey(room);
        } else {
            user.getKeys().removeIf(k -> k.getRoomname().equals(roomName));
            userRepository.save(user);
            roomRepository.delete(room);
            messageRepository.deleteByRoomname(roomName);
        }
    }

    @Transactional
    public void lockRoom(String roomName) {
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        if(room.isLocked()){
            throw new IllegalArgumentException("Room is already locked");
        } else {
            roomRepository.lockRoom(roomName);
        }
    }

    @Transactional
    public void unlockRoom(String roomName) {
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        if(!room.isLocked()){
            throw new IllegalArgumentException("Room is already unlocked");
        } else {
            roomRepository.unlockRoom(roomName);
        }
    }

    @Transactional
    public void genNewRoomKey(Room room) throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();   
        RoomKey newKey = RoomKey.builder()
                .publicKey(keyPair.getPublic())
                .privateKey(keyPair.getPrivate())
                .room(room)
                .build();
        RoomKeyRepository.save(newKey);
        for(User u : room.getUsers()){
           u.getKeys().add(
            UserKey.builder()
            .publicKey(newKey.getPublicKey())
            .roomname(room.getRoomname())
            .keyID(newKey.getId())
            .user(u)
            .build()
            );
           userRepository.save(u); 
        }
    }

    public List<UserKey> getUserKeysByRoom(String roomName, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        return user.getKeys().stream()
                .filter(k -> k.getRoomname().equals(roomName))
                .collect(toList());
    }
}