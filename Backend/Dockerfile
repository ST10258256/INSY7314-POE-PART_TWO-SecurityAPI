# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy csproj and restore dependencies
COPY Backend.csproj ./
RUN dotnet restore

# Copy everything else
COPY . ./

# Build the project in Release mode
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

COPY --from=build /app .

# Expose default port
EXPOSE 5000

# Run the app
ENTRYPOINT ["dotnet", "Backend.dll"]
