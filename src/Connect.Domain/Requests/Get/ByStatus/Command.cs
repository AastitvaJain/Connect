namespace Connect.Requests.Get.ByStatus;

public sealed record Command(
    RequestStatus Status,
    int Page,
    int PageSize);