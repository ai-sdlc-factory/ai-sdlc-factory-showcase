using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

public class ReadingStatesTests
{
    [Fact]
    public async Task Reading_service_supports_success_error_and_retry_used_by_footer_screen()
    {
        using var client = new HttpClient { BaseAddress = new Uri("http://127.0.0.1:5080") };
        using var failure = await client.GetAsync("/api/weather/Atlantis");
        Assert.Equal(HttpStatusCode.NotFound, failure.StatusCode);
        var error = await failure.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("No weather reading is available for this city.", error.GetProperty("error").GetString());
        for (var attempt = 0; attempt < 2; attempt++)
        {
            using var success = await client.GetAsync("/api/weather/Riga");
            Assert.Equal(HttpStatusCode.OK, success.StatusCode);
            var reading = await success.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal("Riga", reading.GetProperty("city").GetString());
            Assert.Equal(12, reading.GetProperty("temperatureC").GetInt32());
            Assert.Equal("Cloudy", reading.GetProperty("condition").GetString());
            Assert.Equal(75, reading.GetProperty("humidityPercent").GetInt32());
        }
    }
}
