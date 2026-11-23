using Weather.Api;
using Xunit;

namespace Weather.Api.Tests;

public class WeatherReportTests
{
    [Theory]
    [InlineData("Riga", 12, "Cloudy", 75, 10.5)]
    [InlineData("London", 15, "Rainy", 80, 13)]
    [InlineData("Oslo", 8, "Cloudy", 65, 7.5)]
    [InlineData("Madrid", 26, "Sunny", 35, 26)]
    [InlineData("Cairo", 32, "Sunny", 25, 32)]
    public void ReturnsFixedReadings(string city, int temperature, string condition, int humidity, decimal feelsLike)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.Success, result.Status);
        Assert.Equal(new WeatherReading(city, temperature, condition, humidity), result.Reading);
        Assert.Equal(feelsLike, result.Reading!.FeelsLikeC);
        Assert.Equal(result, WeatherReport.Lookup(city));
    }

    [Theory]
    [InlineData(59, 12)]
    [InlineData(60, 12)]
    [InlineData(61, 11.9)]
    [InlineData(75, 10.5)]
    public void CalculatesFeelsLikeFromHumidity(int humidity, decimal expected)
    {
        var reading = new WeatherReading("Test city", 12, "Cloudy", humidity);
        Assert.Equal(expected, reading.FeelsLikeC);
    }

    [Theory]
    [InlineData("rIGA")]
    [InlineData("  Riga  ")]
    public void NormalizesCity(string city) =>
        Assert.Equal("Riga", WeatherReport.Lookup(city).Reading?.City);

    public static TheoryData<string?> InvalidCities => new()
    {
        null, "", "   ", new string('a', 61), new string(' ', 57) + "Riga",
        "Riga1", "Riga!", "Ri\tga", "Ri\nga", "Riga🙂"
    };

    [Theory]
    [MemberData(nameof(InvalidCities))]
    public void RejectsInvalidInput(string? city)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.Invalid, result.Status);
        Assert.False(string.IsNullOrWhiteSpace(result.Error));
        Assert.Null(result.Reading);
    }

    [Theory]
    [InlineData("Paris")]
    [InlineData("São Paulo")]
    [InlineData("Xi'an")]
    [InlineData("Saint-Louis")]
    [InlineData("𐐀")]
    [InlineData("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")]
    public void ValidUnknownCityIsNotFound(string city)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.NotFound, result.Status);
        Assert.False(string.IsNullOrWhiteSpace(result.Error));
    }
}
