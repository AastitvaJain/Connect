using System.Security.Cryptography;

namespace Connect;

public static class Id
{
    public const long Min = 0x00038D7EA4C68000; // 10^15
    public const long Max = 0x001FFFFFFFFFFFFF; // 2^53 - 1

    private const long Range = Max - Min;

    public static long Create()
    {
        Span<byte> bytes = stackalloc byte[8];

        RandomNumberGenerator.Fill(bytes);

        long random = BitConverter.ToInt64(bytes);

        return Min + (random < 0 ? -random : random) % Range;
    }
}