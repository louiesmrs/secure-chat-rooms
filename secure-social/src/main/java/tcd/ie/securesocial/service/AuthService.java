
package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Account;
import tcd.ie.securesocial.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(AuthDto request) {
        if (accountRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists: " + request.username());
        }
        Account account = Account.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .cert(request.cert())
                .build();
        accountRepository.save(account);
    }


    @Transactional
    public void login(AuthDto request) {
        if(!accountRepository.existsByUsername(request.username())){
            throw new IllegalArgumentException("Username does not exist: " + request.username());
        }
        Account account = getByUsername(request.username());
        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        accountRepository.updateCert(request.username(), request.cert());
        
    }

    public Account getByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }

    


}
