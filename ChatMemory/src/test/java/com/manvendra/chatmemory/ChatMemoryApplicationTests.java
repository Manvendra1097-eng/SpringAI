package com.manvendra.chatmemory;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.messages.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ChatMemoryApplicationTests {

    @Autowired
    JdbcChatMemoryRepository jdbcChatMemoryRepository;


    @Test
    void contextLoads() {
        List<Message> byConversationId = jdbcChatMemoryRepository.findByConversationId("231");
        for (Message message : byConversationId) {
            System.out.println(message.getText());
            System.out.println(message.getMetadata());
        }
    }

}
