package tcd.ie.securesocial.controller;
import tcd.ie.securesocial.service.RoomService;
import tcd.ie.securesocial.service.RoomDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/room")
    public RoomDto postRoom(RoomDto roomDto) {
        System.out.println("Room Received");
        System.out.println(roomDto);
        return roomService.saveRoom(roomDto);
    }

    @PostMapping("/joinroom/{roomName}")
    public ResponseEntity<Void> joinRoom(@PathVariable String roomName) {
        roomService.memberJoin(roomName);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/leaveroom/{roomName}")
    public ResponseEntity<Void> leaveRoom(@PathVariable String roomName) {
        roomService.memberLeave(roomName);
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

}