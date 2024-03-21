package tcd.ie.securesocial.repository;

import tcd.ie.securesocial.model.Room;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomname(String roomname);
    boolean existsByRoomname(String roomname);
    @Modifying
    @Query("update Room r set r.numbermembers = r.numbermembers + 1 where r.roomname = ?1")
    void incrementNumberMembers(String roomname);
    @Modifying
    @Query("update Room r set r.numbermembers = r.numbermembers - 1 where r.roomname = ?1")
    void decrementNumberMembers(String roomname);
}