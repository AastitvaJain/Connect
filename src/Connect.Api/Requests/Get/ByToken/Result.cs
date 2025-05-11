namespace Connect.Requests.Get.ByToken;

public interface IResult { }

public sealed record GetResult(List<ApproveRequestDto> Requests) : IResult;

public sealed record NotFoundResult : IResult;