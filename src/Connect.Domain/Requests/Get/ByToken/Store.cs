namespace Connect.Requests.Get.ByToken;

public interface IStore
{
    Task<bool> Exist(ClientToken token, CancellationToken cancellationToken);
    Task<List<ApproveRequest>> GetList(ClientToken token, CancellationToken cancellationToken);
    
    Task<List<SoldInventory>?> GetSoldInventories(List<Guid> ids, CancellationToken cancellationToken);
    
    Task<List<NewInventory>?> GetNewInventories(List<Guid> ids, CancellationToken cancellationToken);
}