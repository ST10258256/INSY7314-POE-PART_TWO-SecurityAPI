using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Payment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; }

    [BsonElement("AccountNumber")]
    public string AccountNumber { get; set; }

    [BsonElement("amount")]
    public decimal Amount { get; set; }

    [BsonElement("currency")]
    public string Currency { get; set; }

    [BsonElement("swiftCode")]
    public string SWIFTCode { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "Pending";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("verifiedAt")]
    public DateTime? VerifiedAt { get; set; }
}
