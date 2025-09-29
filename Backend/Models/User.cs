using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("email")]
    public string Email { get; set; }

    [BsonElement("passwordHash")]
    public byte[] PasswordHash { get; set; }

    [BsonElement("passwordSalt")]
    public byte[] PasswordSalt { get; set; }

    [BsonElement("role")]
    public string Role { get; set; } = "User";
}
