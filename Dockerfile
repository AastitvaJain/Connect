FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://*:8080
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Connect/Connect.csproj", "src/Connect/"]
COPY ["src/Connect.Api/Connect.Api.csproj", "src/Connect.Api/"]
COPY ["src/Connect.Domain/Connect.Domain.csproj", "src/Connect.Domain/"]
COPY ["src/Connect.Infra.Data/Connect.Infra.Data.csproj", "src/Connect.Infra.Data/"]
COPY ["src/Connect.Http/Connect.Http.csproj", "src/Connect.Http/"]
RUN dotnet restore "src/Connect/Connect.csproj"
COPY . .
WORKDIR "/src/src/Connect"
RUN dotnet build "Connect.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Connect.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Connect.dll"]
