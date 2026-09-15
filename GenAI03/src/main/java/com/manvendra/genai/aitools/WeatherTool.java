package com.manvendra.genai.aitools;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class WeatherTool {

    private final RestClient restClient;
    private final String apiKey;

    public WeatherTool(RestClient.Builder builder,
                       @Value("${spring.external.weather.api-key}")
                       String apiKey) {
        this.restClient = builder.baseUrl("http://api.weatherapi.com/v1/").build();
        this.apiKey = apiKey;
    }

    @Tool(
            description = "Get current weather of the city passed in parameter"
    )
    public String fetchCurrentWeather(
            @ToolParam(description = "Name of the city")
            String city
    ) {
        log.info("Weather tool called");
        return restClient.get().uri(uriBuilder -> uriBuilder.path("current.json").queryParam("key", apiKey)
                        .queryParam("q", city).build())
                .retrieve().body(String.class);
    }
}
