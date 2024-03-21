// package tcd.ie.securesocial.model;

// import jakarta.persistence.*;
// import lombok.*;

// @Setter
// @Getter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// @Entity
// @Table(name = "user")
// public class User {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "id")
//     private Long id;

//     @Column(unique = true, name = "username", nullable = false, length = 30)
//     private String username;

//     @Column(name = "password", nullable = false, length = 100)
//     private String password;

//     @Override
//     public String toString() {
//         return "Account{" +
//                 "id=" + id +
//                 ", username='" + username + '\'' +
//                 ", password='" + password + '\'' +
//                 '}';
//     }

//     @Override
//     public boolean equals(Object o) {
//         if (this == o) return true;
//         if (o == null || getClass() != o.getClass()) return false;

//         User account = (User) o;

//         if (!id.equals(account.id)) return false;
//         return username.equals(account.username);
//     }

//     @Override
//     public int hashCode() {
//         int result = id.hashCode();
//         result = 31 * result + username.hashCode();
//         return result;
//     }
// }