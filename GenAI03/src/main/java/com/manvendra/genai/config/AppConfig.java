package com.manvendra.genai.config;

import com.manvendra.genai.aitools.CalculatorTool;
import com.manvendra.genai.aitools.CurrencyExchangeTool;
import com.manvendra.genai.aitools.WeatherTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class AppConfig {

    private final Resource resource;


    private final CalculatorTool calculatorTool;
    private final WeatherTool weatherTool;
    private final CurrencyExchangeTool currencyExchangeTool;

    public AppConfig(@Value("classpath:/templates/system_prompt1.st") Resource resource
            , CalculatorTool calculatorTool, WeatherTool weatherTool, CurrencyExchangeTool currencyExchangeTool) {
        this.resource = resource;
        this.calculatorTool = calculatorTool;
        this.weatherTool = weatherTool;
        this.currencyExchangeTool = currencyExchangeTool;
    }


    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(resource)
                .defaultTools(calculatorTool, weatherTool, currencyExchangeTool)
                .build();
    }
}
