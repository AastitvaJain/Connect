namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public interface IStore
{
    Task<IEnumerable<string>?> GetList();
}