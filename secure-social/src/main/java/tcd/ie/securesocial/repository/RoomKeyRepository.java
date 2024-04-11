package tcd.ie.securesocial.repository;

import tcd.ie.securesocial.model.RoomKey;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import tcd.ie.securesocial.model.Room;

import java.security.Key;


public interface RoomKeyRepository extends JpaRepository<RoomKey, Long> {
    @Query("select r.publicKey from RoomKey r where r.room = ?1")
    Iterable<Key> findPublicKeyByRoom(Room room);
    @Modifying
    @Query("delete from RoomKey r where r.room = ?1")
    void deleteByRoom(Room room);
}
