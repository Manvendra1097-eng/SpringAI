package com.manvendra.genai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

@Service
public class SummarizeService {

    private final ChatClient chatClient;

    public SummarizeService(ChatClient chatClient) {
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

        return chatClient.prompt()
                .options(ChatOptions.builder().model("gpt-4o-mini"))
                .user(message)
                .call().content();
    }
}

