using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapGet("/", () => "Hello World!");

// Products endpoints
app.MapGet("/api/products", async (AppDbContext db) =>
    await db.Products.AsNoTracking().ToListAsync());

app.MapGet("/api/products/{id}", async (int id, AppDbContext db) =>
    await db.Products.FindAsync(id) is { } product ? Results.Ok(product) : Results.NotFound());

app.MapPost("/api/products", async (Product product, AppDbContext db) =>
{
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/api/products/{product.Id}", product);
});

app.MapPut("/api/products/{id}", async (int id, Product updatedProduct, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();
    product.Name = updatedProduct.Name;
    product.Description = updatedProduct.Description;
    product.Price = updatedProduct.Price;
    product.Category = updatedProduct.Category;
    product.ImageUrl = updatedProduct.ImageUrl;
    product.IsVegetarian = updatedProduct.IsVegetarian;
    product.IsAvailable = updatedProduct.IsAvailable;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/products/{id}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();
    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Customizations endpoints
app.MapGet("/api/customizations", async (AppDbContext db) =>
    await db.Customizations.AsNoTracking().ToListAsync());

app.MapPost("/api/customizations", async (Customization customization, AppDbContext db) =>
{
    db.Customizations.Add(customization);
    await db.SaveChangesAsync();
    return Results.Created($"/api/customizations/{customization.Id}", customization);
});

// Combos endpoints
app.MapGet("/api/combos", async (AppDbContext db) =>
    await db.Combos.Include(c => c.ComboItems).ThenInclude(ci => ci.Product).AsNoTracking().ToListAsync());

app.MapPost("/api/combos", async (Combo combo, AppDbContext db) =>
{
    db.Combos.Add(combo);
    await db.SaveChangesAsync();
    return Results.Created($"/api/combos/{combo.Id}", combo);
});

// Orders endpoints
app.MapGet("/api/orders", async (AppDbContext db) =>
    await db.Orders.Include(o => o.OrderItems).AsNoTracking().ToListAsync());

app.MapPost("/api/orders", async (Order order, AppDbContext db) =>
{
    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Created($"/api/orders/{order.Id}", order);
});

// LLM suggestion endpoint
app.MapPost("/api/llm/suggest", async (HttpClient httpClient, SuggestRequest request) =>
{
    var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        return "Configura la variable OPENROUTER_API_KEY para usar OpenRouter. Usa modelos gratuitos.";
    }
    var prompt = $"Eres un experto en cocina guatemalteca. Sugiere un combo creativo y personalizado de tamales y bebidas para {request.People} personas. Opciones disponibles: Masa (maíz amarillo, maíz blanco, arroz), Relleno (recado rojo de cerdo, negro de pollo, chipilín vegetariano, mezcla chuchito), Envoltura (hoja de plátano, tusa de maíz), Picante (sin chile, suave, chapín), Tipo bebida (atol de elote, atole shuco, pinol, cacao batido), Endulzante (sin azúcar, panela, miel), Topping (ninguno, malvaviscos, canela, ralladura cacao). Devuelve una sugerencia atractiva, apetecida en español con ejemplos específicos de personalizaciones y precio aproximado.";
    var payload = new
    {
        model = "microsoft/wizardlm-2-8x22b",
        messages = new[] { new { role = "user", content = prompt } },
        max_tokens = 400,
        temperature = 0.7
    };
    var jsonString = JsonSerializer.Serialize(payload);
    var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
    var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
    httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    httpRequest.Content = content;
    var response = await httpClient.SendAsync(httpRequest);
    if (response.IsSuccessStatusCode)
    {
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "No se generó sugerencia.";
    }
    else
    {
        var error = await response.Content.ReadAsStringAsync();
        return $"Error de OpenRouter: {error}";
    }
});

// LLM sales analysis endpoint
app.MapPost("/api/llm/analyze-sales", async (HttpClient httpClient, List<Order> orders) =>
{
    var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        return "Configura la variable OPENROUTER_API_KEY para usar OpenRouter. Usa modelos gratuitos.";
    }
    var salesData = JsonSerializer.Serialize(orders);
    var prompt = $"Analiza los siguientes datos de ventas de La Cazuela Chapina y proporciona un análisis detallado en español: tendencias, productos más vendidos, patrones de personalización, recomendaciones para mejorar ventas. Datos: {salesData}";
    var payload = new
    {
        model = "microsoft/wizardlm-2-8x22b",
        messages = new[] { new { role = "user", content = prompt } },
        max_tokens = 600,
        temperature = 0.5
    };
    var jsonString = JsonSerializer.Serialize(payload);
    var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
    var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
    httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    httpRequest.Content = content;
    var response = await httpClient.SendAsync(httpRequest);
    if (response.IsSuccessStatusCode)
    {
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "No se generó análisis.";
    }
    else
    {
        var error = await response.Content.ReadAsStringAsync();
        return $"Error de OpenRouter: {error}";
    }
});

// LLM voice suggestion endpoint
app.MapPost("/api/llm/voice-suggest", async (HttpClient httpClient, VoiceRequest request) =>
{
    var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        return "Configura la variable OPENROUTER_API_KEY para usar OpenRouter. Usa modelos gratuitos.";
    }
    var prompt = $"Basado en esta solicitud de voz del cliente: '{request.VoiceText}', sugiere un combo personalizado de tamales y bebidas de La Cazuela Chapina. Interpreta la solicitud y proporciona una sugerencia atractiva en español con personalizaciones específicas y precio aproximado.";
    var payload = new
    {
        model = "microsoft/wizardlm-2-8x22b",
        messages = new[] { new { role = "user", content = prompt } },
        max_tokens = 500,
        temperature = 0.7
    };
    var jsonString = JsonSerializer.Serialize(payload);
    var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
    var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
    httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    httpRequest.Content = content;
    var response = await httpClient.SendAsync(httpRequest);
    if (response.IsSuccessStatusCode)
    {
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "No se generó sugerencia.";
    }
    else
    {
        var error = await response.Content.ReadAsStringAsync();
        return $"Error de OpenRouter: {error}";
    }
});

// Migrate and seed database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureDeleted();
    db.Database.EnsureCreated();

    // Seed sample data
    if (!db.Customizations.Any())
    {
        // Tamale customizations
        db.Customizations.Add(new Customization { Name = "Masa", Type = "masa", Options = "maíz amarillo,maíz blanco,arroz", ExtraPrice = 0 });
        db.Customizations.Add(new Customization { Name = "Relleno", Type = "relleno", Options = "recado rojo de cerdo,negro de pollo,chipilín vegetariano,mezcla chuchito", ExtraPrice = 0 });
        db.Customizations.Add(new Customization { Name = "Envoltura", Type = "envoltura", Options = "hoja de plátano,tusa de maíz", ExtraPrice = 0 });
        db.Customizations.Add(new Customization { Name = "Picante", Type = "picante", Options = "sin chile,suave,chapín", ExtraPrice = 0 });
        // Drink customizations
        db.Customizations.Add(new Customization { Name = "Tipo", Type = "tipo", Options = "atol de elote,atole shuco,pinol,cacao batido", ExtraPrice = 0 });
        db.Customizations.Add(new Customization { Name = "Endulzante", Type = "endulzante", Options = "sin azúcar,panela,miel", ExtraPrice = 0 });
        db.Customizations.Add(new Customization { Name = "Topping", Type = "topping", Options = "ninguno,malvaviscos,canela,ralladura cacao", ExtraPrice = 0 });
        db.SaveChanges();
    }

    if (!db.Products.Any())
    {
        db.Products.Add(new Product { Name = "Tamales", Description = "Personalizable", Price = 15.00M, Category = "tamales", IsVegetarian = false });
        db.Products.Add(new Product { Name = "6 Tamales", Description = "Media docena personalizable", Price = 85.00M, Category = "tamales", IsVegetarian = false });
        db.Products.Add(new Product { Name = "12 Tamales", Description = "Docena personalizable", Price = 160.00M, Category = "tamales", IsVegetarian = false });
        db.Products.Add(new Product { Name = "Bebida", Description = "Personalizable", Price = 10.00M, Category = "bebida", IsVegetarian = true });
        db.SaveChanges();
    }

    if (!db.Combos.Any())
    {
        var combo1 = new Combo { Name = "Fiesta Patronal", Description = "Docena surtida y dos jarros", Price = 200.00M, IsEditable = false, IsSeasonal = false };
        db.Combos.Add(combo1);
        // Add items, but for simplicity, skip or add later
        db.SaveChanges();
    }
}

app.Run();
