package tcd.ie.securesocial.repository;

import tcd.ie.securesocial.model.Account;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);
    boolean existsByUsername(String username);

    @Modifying
    @Query("update Account a set a.decryptionKey = ?1 where a.username = ?2")
    void updateDecryptionKey(String decryptionKey, String username);
}