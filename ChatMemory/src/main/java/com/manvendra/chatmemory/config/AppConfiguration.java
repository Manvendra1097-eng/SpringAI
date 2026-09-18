package com.manvendra.chatmemory.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

    private final JdbcChatMemoryRepository jdbcChatMemoryRepository;

    public AppConfiguration(JdbcChatMemoryRepository jdbcChatMemoryRepository) {
        this.jdbcChatMemoryRepository = jdbcChatMemoryRepository;
    }

    @Bean
    public ChatMemory jdbcMemoryChatMemory() {
        return MessageWindowChatMemory.builder().chatMemoryRepository(jdbcChatMemoryRepository).build();
    }

    @Bean
    public ChatMemory inMemoryChatMemory() {
        return MessageWindowChatMemory.builder().chatMemoryRepository(new InMemoryChatMemoryRepository()).build();
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}
