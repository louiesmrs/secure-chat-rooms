package tcd.ie.securesocial.controller;
import tcd.ie.securesocial.service.MessageDto;
import tcd.ie.securesocial.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SignatureException;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @MessageMapping("/message/{roomName}")
    @SubscribeMapping("/message/{roomName}")
    @SendTo("/topic/message/{roomName}")
    public MessageDto postMessage(@RequestParam("signature") String sigAndMsg) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, CertificateException, SignatureException, JsonMappingException, JsonProcessingException, IOException, NoSuchProviderException {
        System.out.println("Message Received");
        ObjectMapper mapper = new ObjectMapper();
        MessageDto messageDto = mapper.readTree(sigAndMsg).get("message").traverse(mapper).readValueAs(MessageDto.class);
        System.out.println(messageDto);
        return messageService.saveMessage(messageDto);
    }

    @GetMapping("/message")
    public ResponseEntity<List<MessageDto>> getAllMessages() {
        List<MessageDto> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/message/{roomName}")
    public ResponseEntity<List<MessageDto>> getMessagesByRoom(@PathVariable String roomName) {
        List<MessageDto> messages = messageService.getMessagesByRoom(roomName);
        return ResponseEntity.ok(messages);
    }

}