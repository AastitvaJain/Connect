namespace Connect.Requests.Get.ByStatus;

public interface IStore
{
    Task<PagedResult<ApproveRequest>> GetList(int page, int pageSize, RequestStatus status, CancellationToken cancellationToken);
    
    Task<List<SoldInventory>?> GetSoldInventories(List<Guid> ids, CancellationToken cancellationToken);
    
    Task<List<NewInventory>?> GetNewInventories(List<Guid> ids, CancellationToken cancellationToken);
}