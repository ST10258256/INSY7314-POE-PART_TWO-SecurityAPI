using MongoDB.Driver;

public interface IMongoDbContext
{
    IMongoCollection<User> Users { get; }
    IMongoCollection<Payment> Payments { get; }
}