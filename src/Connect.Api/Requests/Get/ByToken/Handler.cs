namespace Connect.Requests.Get.ByToken;

public interface IHandler
{
    Task<IResult> Handle(ClientToken token, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(ClientToken token, CancellationToken cancellationToken)
    {
        if(!await store.Exist(token, cancellationToken))
            return new NotFoundResult();
        
        List<ApproveRequest> requests = await store.GetList(token, cancellationToken);
        
        var soldInventoryIds = requests
            .SelectMany(x => x.SellPropertyChanges ?? [])
            .Select(y => y.PropertyId)
            .Distinct()
            .ToList();
        List<SoldInventory>? soldInventories = await store.GetSoldInventories(soldInventoryIds, cancellationToken);

        var newInventoryIds = requests
            .SelectMany(x => x.BuyPropertyChanges)
            .Select(y => y.PropertyId)
            .Distinct()
            .ToList();
        List<NewInventory>? newInventories = await store.GetNewInventories(newInventoryIds, cancellationToken);
        
        if(soldInventories is null || newInventories is null)
        {
            return new NotFoundResult();
        }

        return new GetResult(requests.Select(x =>
        {
            List<SoldInventoryDto> soldInventoryDtos = soldInventories
                .Where(y => x.SellPropertyChanges?.Any(z => z.PropertyId == y.Id) ?? false)
                .Select(SoldInventoryDto.ToDto).ToList();

            List<NewInventoryDto> newInventoryDtos = newInventories
                .Where(y => x.BuyPropertyChanges.Any(z => z.PropertyId == y.Id))
                .Select(NewInventoryDto.ToDto).ToList();
            
            return new ApproveRequestDto(
                x.Id ?? 0,
                x.Client?.Name ?? string.Empty,
                x.Client?.EmailId?.Value,
                x.Client?.PhoneNo,
                x.Status,
                x.SellPropertyChanges,
                x.BuyPropertyChanges,
                soldInventoryDtos,
                newInventoryDtos,
                x.CostSheets,
                x.IsApplied);
        }).ToList());
    }
}