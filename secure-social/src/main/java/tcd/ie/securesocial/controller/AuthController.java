// package tcd.ie.securesocial.controller;

// import tcd.ie.securesocial.service.AuthService;
// import lombok.RequiredArgsConstructor;
// import tcd.ie.securesocial.service.AuthDto;

// import org.springframework.http.ResponseEntity;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.security.Principal;

// @RequiredArgsConstructor
// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {
//     private final AuthService authenticationService;;
//     private final SimpMessagingTemplate simpMessagingTemplate;

//     @PostMapping("/register")
//     public ResponseEntity<Void> register(@RequestBody AuthDto request) {
//         authenticationService.register(request);   
//         return ResponseEntity.ok().build();
//     }

//     @PostMapping("/login")
//     public ResponseEntity<Void> login(@RequestBody AuthDto request) {
//         authenticationService.login(request);
//         return ResponseEntity.ok().build();
//     }

//     @PostMapping("/logout")
//     public ResponseEntity<Void> logout(Principal principal) {
//         if (principal != null) {
//             var account = authenticationService.getByUsername(principal.getName());
//         }
//         return ResponseEntity.ok().build();
//     }
// }