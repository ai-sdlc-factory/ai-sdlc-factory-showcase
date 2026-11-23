namespace Weather.Api;

public sealed record WeatherReading(string City, int TemperatureC, string Condition, int HumidityPercent, DateTime ObservedAt)
{
    public decimal FeelsLikeC => Math.Round(TemperatureC - 0.1m * Math.Max(0, HumidityPercent - 60), 1);
}

public enum LookupStatus { Success, Invalid, NotFound }

public sealed record WeatherLookup(LookupStatus Status, WeatherReading? Reading = null, string? Error = null);

public static class WeatherReport
{
    private static readonly Dictionary<string, WeatherReading> Readings = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Riga"] = new("Riga", 12, "Cloudy", 75, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc)),
        ["London"] = new("London", 15, "Rainy", 80, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc)),
        ["Oslo"] = new("Oslo", 8, "Cloudy", 65, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc)),
        ["Madrid"] = new("Madrid", 26, "Sunny", 35, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc)),
        ["Cairo"] = new("Cairo", 32, "Sunny", 25, new DateTime(2026, 1, 15, 9, 0, 0, DateTimeKind.Utc))
    };

    public static string[] GetCities() => Readings.Values
        .Select(reading => reading.City)
        .OrderBy(city => city, StringComparer.Ordinal)
        .ToArray();

    public static WeatherLookup Lookup(string? city)
    {
        if (string.IsNullOrWhiteSpace(city))
            return new(LookupStatus.Invalid, Error: "Enter a city name.");
        if (city.Length > 60)
            return new(LookupStatus.Invalid, Error: "City names must be at most 60 characters.");
        if (city.EnumerateRunes().Any(character => !System.Text.Rune.IsLetter(character)
            && character.Value is not (' ' or '-' or '\'')))
            return new(LookupStatus.Invalid, Error: "City names may contain only letters, spaces, hyphens and apostrophes.");

        return Readings.TryGetValue(city.Trim(), out var reading)
            ? new(LookupStatus.Success, reading)
            : new(LookupStatus.NotFound, Error: "No weather reading is available for this city.");
    }
}
