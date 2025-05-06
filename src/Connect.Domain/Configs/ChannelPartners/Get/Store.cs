namespace Connect.Configs.ChannelPartners.Get;

public interface IStore
{
    Task<IEnumerable<ChannelPartner>?> GetList();
}