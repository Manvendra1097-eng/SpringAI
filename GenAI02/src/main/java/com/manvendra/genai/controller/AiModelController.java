package com.manvendra.genai.controller;

import com.manvendra.genai.model.ChatRequest;
import jakarta.validation.Valid;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AiModelController {

    private final ChatClient chatClient;

    public AiModelController(ChatClient builder) {
        this.chatClient = builder;
    }

    @GetMapping("/chat")
    public String chat(@Valid @RequestBody ChatRequest chatRequest) {

        String promptTemplate = """
                Below query is asked by full stack student, student name is {studentName}
                Student query: {query}
                Rules:
                    - Answer to the point and tone should be humble
                    - Explain features of the course if query about courses
                    - Answer should be with in (1 to 5) lines
                """;

        return chatClient.prompt()

                .user(promptUserSpec -> promptUserSpec.text(promptTemplate).param("studentName",
                        chatRequest.studentName()).param("query", chatRequest.msg())).call().content();
    }
}
