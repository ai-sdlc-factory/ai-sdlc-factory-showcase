using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Weather.Api.Tests;

public class WeatherApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;

    public WeatherApiTests(WebApplicationFactory<Program> factory) => this.factory = factory;

    [Theory]
    [InlineData("Riga", "Riga", 12, "Cloudy", 75, "2026-01-15T09:00:00Z")]
    [InlineData("lONDON", "London", 15, "Rainy", 80, "2026-01-15T09:00:00Z")]
    [InlineData(" Oslo ", "Oslo", 8, "Cloudy", 65, "2026-01-15T09:00:00Z")]
    [InlineData("Madrid", "Madrid", 26, "Sunny", 35, "2026-01-15T09:00:00Z")]
    [InlineData("Cairo", "Cairo", 32, "Sunny", 25, "2026-01-15T09:00:00Z")]
    public async Task ReturnsReadingContract(string input, string city, int temperature, string condition, int humidity, string observedAt)
    {
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/weather/" + Uri.EscapeDataString(input));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var reading = json.RootElement;
        Assert.Equal(5, reading.EnumerateObject().Count());
        Assert.Equal(city, reading.GetProperty("city").GetString());
        Assert.Equal(temperature, reading.GetProperty("temperatureC").GetInt32());
        Assert.Equal(condition, reading.GetProperty("condition").GetString());
        Assert.Equal(humidity, reading.GetProperty("humidityPercent").GetInt32());
        Assert.Equal(observedAt, reading.GetProperty("observedAt").GetString());
    }

    [Theory]
    [InlineData("Paris", 404)]
    [InlineData("São Paulo", 404)]
    [InlineData("", 400)]
    [InlineData("   ", 400)]
    [InlineData("Riga1", 400)]
    [InlineData("Riga!", 400)]
    [InlineData("Ri\tga", 400)]
    [InlineData("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 400)]
    [InlineData("                                                         Riga", 400)]
    public async Task ReturnsErrorContract(string city, int status)
    {
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/weather/" + Uri.EscapeDataString(city));
        Assert.Equal(status, (int)response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Single(json.RootElement.EnumerateObject());
        Assert.False(string.IsNullOrWhiteSpace(json.RootElement.GetProperty("error").GetString()));
    }

    [Theory]
    [InlineData("http://localhost:5173", true)]
    [InlineData("http://127.0.0.1:5173", true)]
    [InlineData("https://example.com", false)]
    public async Task DevelopmentCorsOnlyAllowsLocalWeb(string origin, bool allowed)
    {
        using var development = factory.WithWebHostBuilder(builder => builder.UseEnvironment("Development"));
        using var client = development.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/weather/Riga");
        request.Headers.Add("Origin", origin);
        using var response = await client.SendAsync(request);
        Assert.Equal(allowed, response.Headers.Contains("Access-Control-Allow-Origin"));
        if (allowed)
            Assert.Equal(origin, Assert.Single(response.Headers.GetValues("Access-Control-Allow-Origin")));
    }
}
