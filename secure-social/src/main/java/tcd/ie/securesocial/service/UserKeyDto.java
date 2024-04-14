package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.UserKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserKeyDto implements Serializable {

    private String publicKey;
    private long keyID;

  

    public static UserKeyDto fromUserKey(UserKey userkey) {
        return UserKeyDto.builder()
                .publicKey(userkey.getPrivateKey())
                .keyID(userkey.getKeyID())
                .build();
    }

}