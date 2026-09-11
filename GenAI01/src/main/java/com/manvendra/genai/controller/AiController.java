package com.manvendra.genai.controller;

import com.manvendra.genai.model.ChatRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AiController {

    private final ChatClient openAiChatClient;
    private final ChatClient googleGenAiChatClient;

    public AiController(ChatClient openAiChatClient, ChatClient googleGenAiChatClient) {
        this.openAiChatClient = openAiChatClient;
        this.googleGenAiChatClient = googleGenAiChatClient;
    }


    @GetMapping("openai/chat")
    public String openAiChat(@RequestParam("msg") String msg) {
        return openAiChatClient.prompt(msg).call().content();
    }

    @GetMapping("google/chat")
    public String googleAiChat(@RequestBody ChatRequest chatRequest) {
        return googleGenAiChatClient.prompt(chatRequest.msg())
                .options(GoogleGenAiChatOptions.builder().model(chatRequest.model())).call().content();
    }
}
