package tcd.ie.securesocial.service;

import tcd.ie.securesocial.model.Message;
import tcd.ie.securesocial.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageDto saveMessage(MessageDto uiMessage) {
        Message message = Message.builder()
                .message(HtmlUtils.htmlEscape(uiMessage.getContent()))
                .username(HtmlUtils.htmlEscape(uiMessage.getUserName()))
                .roomname(HtmlUtils.htmlEscape(uiMessage.getRoomName()))
                .timestamp(LocalDateTime.now())
                .chatcolor(HtmlUtils.htmlEscape(uiMessage.getChatColor()))
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
}