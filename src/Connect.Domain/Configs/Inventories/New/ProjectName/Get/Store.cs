namespace Connect.Configs.Inventories.New.ProjectName.Get;

public interface IStore
{
    Task<IEnumerable<string>?> GetList();
}