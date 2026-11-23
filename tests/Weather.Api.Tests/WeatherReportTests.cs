using Weather.Api;
using Xunit;

namespace Weather.Api.Tests;

public class WeatherReportTests
{
    [Fact]
    public void ReturnsCanonicalCitiesInOrdinalOrder()
    {
        var cities = WeatherReport.GetCities();
        Assert.Equal(new[] { "Cairo", "London", "Madrid", "Oslo", "Riga" }, cities);
        foreach (var city in cities)
            Assert.Equal(city, WeatherReport.Lookup(city).Reading?.City);
    }

    [Theory]
    [InlineData("Riga", 12, "Cloudy", 75, "2026-01-15T09:00:00Z", 10.5)]
    [InlineData("London", 15, "Rainy", 80, "2026-01-15T09:00:00Z", 13)]
    [InlineData("Oslo", 8, "Cloudy", 65, "2026-01-15T09:00:00Z", 7.5)]
    [InlineData("Madrid", 26, "Sunny", 35, "2026-01-15T09:00:00Z", 26)]
    [InlineData("Cairo", 32, "Sunny", 25, "2026-01-15T09:00:00Z", 32)]
    public void ReturnsFixedReadings(string city, int temperature, string condition, int humidity, string observedAt, decimal feelsLike)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.Success, result.Status);
        var expectedObservedAt = DateTime.Parse(observedAt, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.RoundtripKind);
        Assert.Equal(new WeatherReading(city, temperature, condition, humidity, expectedObservedAt), result.Reading);
        Assert.Equal(DateTimeKind.Utc, result.Reading!.ObservedAt.Kind);
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
        var reading = new WeatherReading("Test city", 12, "Cloudy", humidity, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc));
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
