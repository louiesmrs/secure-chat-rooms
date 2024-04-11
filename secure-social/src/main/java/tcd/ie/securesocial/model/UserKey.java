package tcd.ie.securesocial.model;




import java.util.Set;

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

    @Column(name = "publicKey" , nullable = false, columnDefinition = "LONGTEXT")
    private String publicKey;

    @Column(name = "roomname" , nullable = false, length = 100)
    private String roomname;

    @Column(name = "keyID" , nullable = false, length = 100)
    private Long keyID;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST,
        CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH }) 
    @JoinTable(name = "ACCOUNT_KEY_MAPPING", joinColumns = @JoinColumn(name = "USER_KEY_ID"), inverseJoinColumns = @JoinColumn(name = "ACCOUNT_ID"))
    private Set<Account> accounts;
    
    

    
}