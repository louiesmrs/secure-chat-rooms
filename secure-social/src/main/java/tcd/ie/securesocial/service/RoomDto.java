package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Room;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto implements Serializable {

    private int numberMembers;
    private String roomName;
    private boolean locked;

  

    public static RoomDto fromRoom(Room room) {
        return RoomDto.builder()
                .roomName(room.getRoomname())
                .numberMembers(room.getNumbermembers())
                .locked(room.isLocked())
                .build();
    }

}