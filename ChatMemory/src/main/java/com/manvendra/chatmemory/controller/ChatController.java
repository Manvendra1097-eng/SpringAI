package com.manvendra.chatmemory.controller;


import com.manvendra.chatmemory.dtos.ChatRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/")
public class ChatController {

    private final ChatClient chatClient;
    private final ChatMemory inMemoryChatMemory;
    private final ChatMemory jdbcMemoryChatMemory;

    public ChatController(ChatClient chatClient, ChatMemory inMemoryChatMemory, ChatMemory jdbcMemoryChatMemory) {
        this.chatClient = chatClient;
        this.inMemoryChatMemory = inMemoryChatMemory;
        this.jdbcMemoryChatMemory = jdbcMemoryChatMemory;
    }

    @PostMapping("chat/stream")
    public Flux<String> chatMemory(@RequestBody String message) {
        MessageChatMemoryAdvisor memoryAdvisor = MessageChatMemoryAdvisor.builder(inMemoryChatMemory).build();

        return chatClient.prompt().user(message)
                .advisors(a -> a.advisors(memoryAdvisor).param(ChatMemory.CONVERSATION_ID, "123"))
                .stream().content();
    }

    @PostMapping("chat/jdbc/stream")
    public Flux<String> jdbcChatMemory(@RequestBody ChatRequest chatRequest) {
        MessageChatMemoryAdvisor memoryAdvisor = MessageChatMemoryAdvisor.builder(jdbcMemoryChatMemory).build();

        return chatClient.prompt().user(chatRequest.message())
                .advisors(a -> a.advisors(memoryAdvisor).param(ChatMemory.CONVERSATION_ID, chatRequest.conversationId()))
                .stream().content();
    }
}
