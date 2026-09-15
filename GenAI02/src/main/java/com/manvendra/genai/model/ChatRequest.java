package com.manvendra.genai.model;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(@NotBlank(message = "Message cannot be blank") String msg, String studentName) {
}
