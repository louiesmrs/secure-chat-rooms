
package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.User;
import tcd.ie.securesocial.repository.UserRepository;
import tcd.ie.securesocial.service.AuthDto;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(AuthDto request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists: " + request.username());
        }
        User account = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .cert(request.cert())
                .build();
        userRepository.save(account);
    }

    public void login(AuthDto request) {
        User account = getByUsername(request.username());
        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        if(!request.cert().equals(account.getCert())){
            throw new IllegalArgumentException("Invalid cert");
        }
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }
}
