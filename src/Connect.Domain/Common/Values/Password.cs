using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Connect;

public sealed record Password(
    byte[] Salt,
    byte[] Hash,
    int IterationCount,
    DateTime UpdateTime)
{
    private const KeyDerivationPrf Prf = KeyDerivationPrf.HMACSHA256;
    
    public static Password Create(
        PlainPassword password,
        int iterationCount,
        DateTime time)
    {
        byte[] salt = new byte[16];
        RandomNumberGenerator.Fill(salt);

        byte[] hash = KeyDerivation.Pbkdf2(password, salt, Prf, iterationCount, 32);

        return new Password(salt, hash, iterationCount, time);
    }

    public bool Matches(PlainPassword password)
    {
        byte[] hash = KeyDerivation.Pbkdf2(password, Salt, Prf, IterationCount, 32);

        return hash.SequenceEqual(Hash);
    }
}