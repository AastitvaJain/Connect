namespace Connect.Configs.Inventories.New.UnitNo.Get;

public interface IStore
{
    Task<IEnumerable<string>?> GetList();
}