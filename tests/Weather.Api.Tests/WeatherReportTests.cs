using Weather.Api;
using Xunit;

namespace Weather.Api.Tests;

public class WeatherReportTests
{
    [Theory]
    [InlineData("Riga", 12, "Cloudy", 75, "2026-01-15T09:00:00Z")]
    [InlineData("London", 15, "Rainy", 80, "2026-01-15T09:00:00Z")]
    [InlineData("Oslo", 8, "Cloudy", 65, "2026-01-15T09:00:00Z")]
    [InlineData("Madrid", 26, "Sunny", 35, "2026-01-15T09:00:00Z")]
    [InlineData("Cairo", 32, "Sunny", 25, "2026-01-15T09:00:00Z")]
    public void ReturnsFixedReadings(string city, int temperature, string condition, int humidity, string observedAt)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.Success, result.Status);
        var expectedObservedAt = DateTime.Parse(observedAt, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.RoundtripKind);
        Assert.Equal(new WeatherReading(city, temperature, condition, humidity, expectedObservedAt), result.Reading);
        Assert.Equal(DateTimeKind.Utc, result.Reading!.ObservedAt.Kind);
        Assert.Equal(result, WeatherReport.Lookup(city));
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
