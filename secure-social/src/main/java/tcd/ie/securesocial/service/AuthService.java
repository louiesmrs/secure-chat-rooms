
// package tcd.ie.securesocial.service;

// import tcd.ie.securesocial.model.User;
// import tcd.ie.securesocial.repository.UserRepository;
// import tcd.ie.securesocial.service.AuthDto;

// import lombok.RequiredArgsConstructor;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// @RequiredArgsConstructor
// @Service
// public class AuthService {
//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//     public void register(AuthDto request) {
//         if (userRepository.existsByUsername(request.username())) {
//             throw new DuplicatedException("USERNAME_ALREADY_EXISTS", request.username());
//         }
//         User account = User.builder()
//                 .username(request.username())
//                 .password(passwordEncoder.encode(request.password()))
//                 .build();
//         userRepository.save(account);
//     }

//     public void login(AuthDto request) {
//         var authenticationToken = new UsernamePasswordAuthenticationToken(request.username(), request.password());
//         var account = userRepository.findByUsername(request.username())
//                 .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + request.username()));
//         var accountResponse = new AuthDto(
//                 account.getId(),
//                 account.getUsername(),
//         );
//         return new LoginPostResponse(accessToken, accountResponse);
//     }
// }
