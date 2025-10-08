using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("firstName")]
    public string FirstName { get; set; }
    [BsonElement("lastName")]
    public string LastName { get; set; }
    [BsonElement("username")]
    public string Username { get; set; }

    [BsonElement("idNumber")]
    public string IdNumber { get; set; }

    [BsonElement("accountNumber")]
    public string AccountNumber { get; set; }

    [BsonElement("email")]
    public string Email { get; set; }

    [BsonElement("passwordHash")]
    public byte[] PasswordHash { get; set; }

    [BsonElement("passwordSalt")]
    public byte[] PasswordSalt { get; set; }

    [BsonElement("role")]
    public string Role { get; set; } = "User";
}
