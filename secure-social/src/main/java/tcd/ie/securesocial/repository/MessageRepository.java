package tcd.ie.securesocial.repository;

import tcd.ie.securesocial.model.Message;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomname(String roomname);
    @Modifying
    @Query("delete from Message m where m.roomname = ?1")
    void deleteByRoomname(String roomname);
}