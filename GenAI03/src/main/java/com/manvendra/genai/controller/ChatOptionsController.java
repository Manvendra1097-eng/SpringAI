package com.manvendra.genai.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatOptionsController {

    private final ChatClient chatClient;


    public ChatOptionsController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping("/v1/ask")
    public String ask(@RequestParam String query) {
        return chatClient.prompt().user(query).call().content();
    }

    @GetMapping("/v2/ask")
    public String askWithCustomOptions(@RequestParam String query) {
        ChatOptions.Builder<?> chatOptionsBuilder =
                ChatOptions.builder().model("gpt-4o-mini").temperature(0.8).maxTokens(100);

        return chatClient.prompt()
                .options(chatOptionsBuilder)
                .user(query).call().content();
    }
}
