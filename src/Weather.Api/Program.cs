using Weather.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddPolicy("LocalWeb", policy => policy
    .WithOrigins("http://127.0.0.1:5173", "http://localhost:5173")
    .WithMethods("GET")
    .WithHeaders("Content-Type")));

var app = builder.Build();
if (app.Environment.IsDevelopment())
    app.UseCors("LocalWeb");

app.MapGet("/api/weather/{city?}", (string? city) =>
{
    var result = WeatherReport.Lookup(city);
    return result.Status switch
    {
        LookupStatus.Success => Results.Ok(result.Reading),
        LookupStatus.Invalid => Results.BadRequest(new { error = result.Error }),
        _ => Results.NotFound(new { error = result.Error })
    };
});

app.Run();

public partial class Program;
