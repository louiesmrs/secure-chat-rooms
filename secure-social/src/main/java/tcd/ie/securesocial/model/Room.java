package tcd.ie.securesocial.model;





import java.util.List;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;

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

    @ColumnDefault("false")
    @Column(name = "locked", nullable = false)
    private boolean locked;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST,
            CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH })
    @JoinTable(name = "ACCOUNT_ROOM_MAPPING", joinColumns = @JoinColumn(name = "ROOM_ID"), inverseJoinColumns = @JoinColumn(name = "ACCOUNT_ID"))
    private Set<Account> users;

    @OneToMany(mappedBy = "room", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<RoomKey> keys;
    
}