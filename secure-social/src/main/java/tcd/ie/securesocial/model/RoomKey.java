package tcd.ie.securesocial.model;


import java.security.Key;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "room_key")
public class RoomKey{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "publicKey" , nullable = false, length = 100)
    private Key publicKey;

    @Column(name = "privateKey" , nullable = false, length = 100)
    private Key privateKey;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
    
}