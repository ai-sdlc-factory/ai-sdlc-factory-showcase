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
    [InlineData("Riga", 12, "Cloudy", 75)]
    [InlineData("London", 15, "Rainy", 80)]
    [InlineData("Oslo", 8, "Cloudy", 65)]
    [InlineData("Madrid", 26, "Sunny", 35)]
    [InlineData("Cairo", 32, "Sunny", 25)]
    public void ReturnsFixedReadings(string city, int temperature, string condition, int humidity)
    {
        var result = WeatherReport.Lookup(city);
        Assert.Equal(LookupStatus.Success, result.Status);
        Assert.Equal(new WeatherReading(city, temperature, condition, humidity), result.Reading);
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
