package tcd.ie.securesocial.model;




import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "room")
public class Room{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(unique = true, name = "roomname", nullable = false, length = 30)
    private String roomname;

    @Column(name = "numbermembers", nullable = false)
    private int numbermembers;
    
}