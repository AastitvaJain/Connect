namespace Connect.Configs.ChannelPartners.Get;

public interface IHandler
{
    Task<IResult> Handle();
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle()
    {
        IEnumerable<ChannelPartner>? channelPartners = await store.GetList();

        if (channelPartners is null)
            return new CouldNotGetResult();

        return new GetResult(channelPartners.Select(ToDto));
    }

    private ChannelPartnerDto ToDto(ChannelPartner channelPartner)
    {
        return new(channelPartner.Id, channelPartner.Name);
    }
}