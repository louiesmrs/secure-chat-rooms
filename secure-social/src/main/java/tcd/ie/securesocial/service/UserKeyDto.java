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

    private String privateKey;
    private long keyID;

  

    public static UserKeyDto fromUserKey(UserKey userkey) {
        return UserKeyDto.builder()
                .privateKey(userkey.getPrivateKey())
                .keyID(userkey.getKeyID())
                .build();
    }

}