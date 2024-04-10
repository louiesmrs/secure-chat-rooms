package tcd.ie.securesocial.model;



import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false, length = 30)
    private String username;

    @Column(name = "message", nullable = false , columnDefinition = "LONGTEXT")
    private String message;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "roomname", nullable = false)
    private String roomname;

    @Column(name = "chatcolor", nullable = false)
    private String chatcolor;

    @Column(name = "keyID", nullable = false)
    private Long keyID;
}