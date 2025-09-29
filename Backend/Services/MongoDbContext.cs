using MongoDB.Driver;

public class MongoDbContext : IMongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(string connectionString, string databaseName)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);

        Users = _database.GetCollection<User>("Users");
        Payments = _database.GetCollection<Payment>("Payments");
    }

    public IMongoCollection<User> Users { get; private set; }
    public IMongoCollection<Payment> Payments { get; private set; }
}
