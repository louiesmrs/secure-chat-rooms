package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Account;
import tcd.ie.securesocial.model.Message;
import tcd.ie.securesocial.model.Room;
import tcd.ie.securesocial.repository.AccountRepository;
import tcd.ie.securesocial.repository.MessageRepository;
import tcd.ie.securesocial.repository.RoomRepository;
import lombok.RequiredArgsConstructor;

import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMParser;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;


import com.fasterxml.jackson.databind.JsonSerializable.Base;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import static java.util.stream.Collectors.toList;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.Signature;
import java.security.SignatureException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;



@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final AccountRepository accountRepository;
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    

    public MessageDto saveMessage(MessageDto uiMessage) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, 
    IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, CertificateException, SignatureException, IOException, NoSuchProviderException {
        String decryptedMessage = uiMessage.getContent();
        if(!uiMessage.getUserName().equals("System")) {
            decryptedMessage = decryptMessage(uiMessage.getContent(), uiMessage.getUserName());
        }
        System.out.println(decryptedMessage);
        String crypto = encryptMessage(decryptedMessage, uiMessage.getRoomName());
        Long keyId = getRoomKeyId(uiMessage.getRoomName());
        Message message = Message.builder()
                .message(HtmlUtils.htmlEscape(crypto))
                .username(HtmlUtils.htmlEscape(uiMessage.getUserName()))
                .roomname(HtmlUtils.htmlEscape(uiMessage.getRoomName()))
                .timestamp(LocalDateTime.now())
                .chatcolor(HtmlUtils.htmlEscape(uiMessage.getChatColor()))
                .keyID(keyId)
                .build();
        Message savedMessage = messageRepository.save(message);
        return MessageDto.fromMessage(savedMessage);
    }

    public List<MessageDto> getAllMessages() {
        Iterable<Message> messages = messageRepository.findAll();
        return StreamSupport
                .stream(messages.spliterator(), false)
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(MessageDto::fromMessage)
                .collect(toList());
    }


    public List<MessageDto> getMessagesByRoom(String roomName) {
        Iterable<Message> messages = messageRepository.findByRoomname(roomName);
        return StreamSupport
                .stream(messages.spliterator(), false)
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(MessageDto::fromMessage)
                .collect(toList());
    }

    public Long getRoomKeyId(String room) {
        Room roomObj = roomRepository.findByRoomname(room)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        return roomObj.getKeys().get(roomObj.getKeys().size()-1).getId();
    }

    public String encryptMessage(String message, String roomName) throws NoSuchAlgorithmException,
     NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException {
        Room room = roomRepository.findByRoomname(roomName)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        Cipher cipher = Cipher.getInstance("RSA");
        byte[] key = Base64.getDecoder().decode(room.getKeys().get(room.getKeys().size()-1).getPublicKey());
        X509EncodedKeySpec spec = new X509EncodedKeySpec(key);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, kf.generatePublic(spec));
        byte[] encryptedMessage = cipher.doFinal(message.getBytes());
        return Base64.getEncoder().encodeToString(encryptedMessage);
    }


    public String decryptMessage(String message, String username) throws CertificateException, 
    NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, 
    IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, NoSuchProviderException {
        Account user = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        byte[] prvder = Base64.getDecoder().decode(user.getDecryptionKey()
            .replaceAll("-----(BEGIN|END) RSA PRIVATE KEY-----","")
            .replaceAll("\n","")
            .replaceAll("\r",""));
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, KeyFactory.getInstance("RSA","BC") .generatePrivate(new PKCS8EncodedKeySpec(prvder) ));
        byte[] decryptedMessage = cipher.doFinal(Base64.getDecoder().decode(message));
        return new String(decryptedMessage);
    }
 }