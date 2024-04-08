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
@Table(name = "user_key")
public class UserKey{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "publicKey" , nullable = false, length = 100)
    private Key publicKey;

    @Column(name = "roomname" , nullable = false, length = 100)
    private String roomname;

    @Column(name = "keyID" , nullable = false, length = 100)
    private Long keyID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    

    
}