package com.manvendra.genai.aitools;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
public class CalculatorTool {

    @Tool(
            name = "Calculator",
            description = """
                    Perform arithmetic operation.
                    Supported operation: add, subtract, multiplication, division, mod and power
                    """
    )
    double calculate(
            @ToolParam(description = "Operation: add, subtract, multiplication, division, mod and power")
            String operator,
            @ToolParam(description = "First number")
            double num1,
            @ToolParam(description = "Second number")
            double num2) {
        log.info("Calculator tool called");
        if (StringUtils.hasText(operator))
            operator = operator.toLowerCase();
        return switch (operator) {
            case "add" -> num1 + num2;
            case "subtract" -> num1 - num2;
            case "multiplication" -> num1 * num2;
            case "division" -> {
                if (num2 == 0) {
                    throw new ArithmeticException("Division by zero");
                }
                yield num1 / num2;
            }
            case "mod" -> num1 % num2;
            case "power" -> Math.pow(num1, num2);
            default -> throw new IllegalArgumentException("Invalid operator");
        };
    }
}
