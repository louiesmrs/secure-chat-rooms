package tcd.ie.securesocial.model;

import java.security.cert.X509Certificate;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(unique = true, name = "username", nullable = false, length = 30)
    private String username;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    // @Column(name = "cert" , nullable = false, length = 100)
    // private X509Certificate cert;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST,
         CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH }) 
    @JoinTable(name = "ACCOUNT_ROOM_MAPPING", joinColumns = @JoinColumn(name = "ACCOUNT_ID"), inverseJoinColumns = @JoinColumn(name = "ROOM_ID"))
    private Set<Room> rooms;

    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserKey> keys;


    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Account account = (Account) o;

        if (!id.equals(account.id)) return false;
        return username.equals(account.username);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + username.hashCode();
        return result;
    }
}