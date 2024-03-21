package tcd.ie.securesocial.service;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import tcd.ie.securesocial.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto implements Serializable {

    private String content;
    private String userName;
    private String roomName;
    private String chatColor;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime timestamp;

    public static MessageDto fromMessage(Message message) {
        return MessageDto.builder()
                .content(message.getMessage())
                .userName(message.getUsername())
                .roomName(message.getRoomname())
                .timestamp(message.getTimestamp())
                .chatColor(message.getChatcolor())
                .build();
    }

}