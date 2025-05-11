namespace Connect.Requests.Get.ByStatus;

public interface IResult { }

public sealed record GetResult(PagedResult<ApproveRequestDto> Requests) : IResult;

public sealed record NotFoundResult : IResult;