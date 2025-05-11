namespace Connect.Requests.Get.ByStatus;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (RequestStatus status, int pageNo, int pageSize) = command;

        PagedResult<ApproveRequest> requests = await store.GetList(pageNo, pageSize, status, cancellationToken);

        if (!requests.Items.Any())
        {
            return new GetResult(new PagedResult<ApproveRequestDto>());
        }
        
        var soldInventoryIds = requests.Items
            .SelectMany(x => x.SellPropertyChanges ?? [])
            .Select(y => y.PropertyId)
            .Distinct()
            .ToList();
        List<SoldInventory>? soldInventories = await store.GetSoldInventories(soldInventoryIds, cancellationToken);

        var newInventoryIds = requests.Items
            .SelectMany(x => x.BuyPropertyChanges)
            .Select(y => y.PropertyId)
            .Distinct()
            .ToList();
        List<NewInventory>? newInventories = await store.GetNewInventories(newInventoryIds, cancellationToken);
        
        if(soldInventories is null || newInventories is null)
        {
            return new NotFoundResult();
        }

        return new GetResult(new PagedResult<ApproveRequestDto>()
        {
            TotalCount = requests.TotalCount,
            PageNumber = pageNo,
            PageSize = pageSize,
            Items = requests.Items.Select(x =>
            {
                List<SoldInventoryDto> soldInventoryDtos = soldInventories
                    .Where(y => x.SellPropertyChanges?.Any(z => z.PropertyId == y.Id) ?? false)
                    .Select(SoldInventoryDto.ToDto).ToList();

                List<NewInventoryDto> newInventoryDtos = newInventories
                    .Where(y => x.BuyPropertyChanges.Any(z => z.PropertyId == y.Id))
                    .Select(NewInventoryDto.ToDto).ToList();

                ApproveRequestDto dto = new ApproveRequestDto(
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

                return dto;
            })
        });
    }
}