namespace Connect;

public sealed record JwtSection
{
    public string Issuer { get; set; } = null!;

    public string Audience { get; set; } = null!;

    public string Secret { get; set; } = null!;

    public bool IsValid()
    {
        return !string.IsNullOrEmpty(Issuer) &&
               !string.IsNullOrEmpty(Audience) &&
               !string.IsNullOrEmpty(Secret) &&
               Issuer.Length is >= 1 and <= 8 &&
               Audience.Length is >= 1 and <= 8 &&
               Secret.Length is 64;
    }
}