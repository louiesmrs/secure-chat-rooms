package tcd.ie.securesocial.controller;
import tcd.ie.securesocial.service.RoomService;
import tcd.ie.securesocial.service.UserKeyDto;
import tcd.ie.securesocial.model.UserKey;
import tcd.ie.securesocial.service.RoomDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/room")
    public RoomDto postRoom(@RequestParam("roomname") String roomname, @RequestParam("numberMembers") int numberMembers, @RequestParam("username") String username) throws NoSuchAlgorithmException {
        System.out.println(roomname);
        System.out.println(numberMembers);
        System.out.println(username);
        RoomDto roomDto = RoomDto.builder()
                .roomName(roomname)
                .numberMembers(numberMembers)
                .locked(false)
                .build();
        System.out.println("Room Received");
        System.out.println(roomDto);
        return roomService.saveRoom(roomDto, username);
    }

    @PostMapping("/joinroom/{roomName}/{username}")
    public ResponseEntity<Void> joinRoom(@PathVariable String roomName, @PathVariable String username) throws NoSuchAlgorithmException {
        roomService.memberJoin(roomName, username);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/leaveroom/{roomName}/{username}")
    public ResponseEntity<Void> leaveRoom(@PathVariable String roomName, @PathVariable String username) throws NoSuchAlgorithmException {
        roomService.memberLeave(roomName, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/lockroom/{roomName}")
    public ResponseEntity<Void> lockRoom(@PathVariable String roomName) {
        roomService.lockRoom(roomName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unlockroom/{roomName}")
    public ResponseEntity<Void> unlockRoom(@PathVariable String roomName) {
        roomService.unlockRoom(roomName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/room")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        List<RoomDto> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/room/{roomName}")
    public ResponseEntity<RoomDto> getRoomByName(@PathVariable String roomName) {
        return ResponseEntity.ok(roomService.getRoomByName(roomName));
    }

    @GetMapping("/getKeys/{username}/{roomName}")
    public ResponseEntity<List<UserKeyDto>> getKeys(@PathVariable String username, @PathVariable String roomName) {
        return ResponseEntity.ok(roomService.getUserKeysByRoom(roomName, username));
    }
    


}