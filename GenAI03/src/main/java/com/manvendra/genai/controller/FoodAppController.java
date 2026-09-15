package com.manvendra.genai.controller;

import com.manvendra.genai.service.FoodAppService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/foodapp")
public class FoodAppController {

    private final FoodAppService foodAppService;

    public FoodAppController(FoodAppService foodAppService) {
        this.foodAppService = foodAppService;
    }

    @PostMapping("/summarize")
    public String summarize(@RequestBody String ticket) {
        return foodAppService.summarize(ticket);
    }

    @PostMapping(value = "/chat")
    public String chat(@RequestBody String message) {
        return foodAppService.chat(message);
    }
}
