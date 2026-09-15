package com.manvendra.genai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private final ChatClient chatClient;

    private List<Message> history = new ArrayList<>();
    private List<Message> streamHistory = new ArrayList<>();

    public ChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String chat(String message) {
        history.add(new UserMessage(message));
        String output = chatClient.prompt()
                .options(ChatOptions.builder().model("gpt-4o-mini"))
                .messages(history)
                .call().content();
        history.add(new AssistantMessage(output));
        return output;
    }

    public Flux<String> chatStream(String message) {
        streamHistory.add(new UserMessage(message));
        StringBuilder buffer = new StringBuilder();

        return chatClient.prompt().options(ChatOptions.builder().model("gpt-4o-mini"))
                .messages(streamHistory)
                .stream().content().doOnNext(
                        buffer::append
                ).doOnComplete(() -> streamHistory.add(new AssistantMessage(buffer.toString())));
    }
}

