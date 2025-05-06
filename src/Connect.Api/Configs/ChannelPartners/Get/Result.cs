namespace Connect.Configs.ChannelPartners.Get;

public interface IResult { }

public sealed record GetResult(
    IEnumerable<ChannelPartnerDto> ChannelPartners) : IResult;
    
public sealed record CouldNotGetResult : IResult;