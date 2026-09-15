package com.manvendra.genai.controller.model;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(@NotBlank(message = "Message cannot be blank") String msg) {
}
