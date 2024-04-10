
package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Account;
import tcd.ie.securesocial.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
                .build();
        accountRepository.save(account);
    }

    public void login(AuthDto request) {
        if(!accountRepository.existsByUsername(request.username())){
            throw new IllegalArgumentException("Username does not exist: " + request.username());
        }
        Account account = getByUsername(request.username());
        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        // if(!request.cert().equals(account.getCert())){
        //     throw new IllegalArgumentException("Invalid cert");
        // }
    }

    public Account getByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }


}
