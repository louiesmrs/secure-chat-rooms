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

    @Column(name = "publicKey" , nullable = false, columnDefinition = "LONGTEXT")
    private String publicKey;

    @Column(name = "privateKey" , nullable = false, columnDefinition = "LONGTEXT")
    private String privateKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
    
    

    
}