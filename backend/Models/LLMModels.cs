namespace Backend.Models;

public record SuggestRequest(int People);

public record VoiceRequest(string VoiceText);

public class OpenRouterResponse
{
    public Choice[] choices { get; set; }
}

public class Choice
{
    public Message message { get; set; }
}

public class Message
{
    public string content { get; set; }
}
