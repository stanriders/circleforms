#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim AS base
WORKDIR /app
EXPOSE 3001

FROM mcr.microsoft.com/dotnet/sdk:6.0-bullseye-slim AS build

WORKDIR /src
COPY ["CircleForms/CircleForms.csproj", "CircleForms/"]
RUN dotnet restore "CircleForms/CircleForms.csproj"
COPY . .
WORKDIR "/src/CircleForms"
RUN dotnet build "CircleForms.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CircleForms.csproj" -c Release -o /app/publish

FROM base AS final

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CircleForms.dll"]