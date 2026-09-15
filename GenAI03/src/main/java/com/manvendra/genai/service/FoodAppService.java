package com.manvendra.genai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FoodAppService {

    private final ChatClient chatClient;

    private List<Message> history = new ArrayList<>();

    public FoodAppService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    String prompt = """
            Summarize this support ticket in 2 line
            Ticket query : {query}
            """;

    public String summarize(String ticket) {

        return chatClient.prompt()
                .options(ChatOptions.builder().model("gpt-4o-mini"))
                .user(p -> p.text(prompt).param("query", ticket))
                .call().content();
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
}

