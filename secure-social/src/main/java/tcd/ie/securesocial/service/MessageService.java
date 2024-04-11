package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Message;
import tcd.ie.securesocial.model.Room;
import tcd.ie.securesocial.repository.MessageRepository;
import tcd.ie.securesocial.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
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

import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;

    public MessageDto saveMessage(MessageDto uiMessage) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException {
        String crypto = encryptMessage(uiMessage.getContent(), uiMessage.getRoomName());
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

    public Long getRoomKeyId(String room) {
        Room roomObj = roomRepository.findByRoomname(room)
                .orElseThrow(() -> new IllegalArgumentException("Room does not exist"));
        return roomObj.getKeys().get(roomObj.getKeys().size()-1).getId();
    }
}