namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public interface IStore
{
    Task<IEnumerable<string>?> GetList();
}