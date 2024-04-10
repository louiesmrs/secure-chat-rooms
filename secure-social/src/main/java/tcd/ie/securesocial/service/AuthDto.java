package tcd.ie.securesocial.service;

import java.security.cert.X509Certificate;

public record AuthDto(
        String username,
        String password
) {
}