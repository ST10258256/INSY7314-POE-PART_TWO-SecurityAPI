using MongoDB.Driver;

namespace Backend.Repositories
{
    public class PaymentRepository
    {
        private readonly IMongoCollection<Payment> _payments;

        public PaymentRepository(IMongoDbContext context)
        {
            _payments = context.Payments;
        }

        public async Task CreateAsync(Payment payment) =>
            await _payments.InsertOneAsync(payment);

        public async Task<List<Payment>> GetAllAsync() =>
            await _payments.Find(_ => true).ToListAsync();

        public async Task<Payment?> GetByIdAsync(string id) =>
            await _payments.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task UpdateStatusAsync(string id, string status)
        {
            var filter = Builders<Payment>.Filter.Eq(p => p.Id, id);
            var update = Builders<Payment>.Update
                .Set(p => p.Status, status)
                .Set(p => p.VerifiedAt, DateTime.UtcNow);
            await _payments.UpdateOneAsync(filter, update);
        }

        public async Task<List<Payment>> GetByUserIdAsync(string userId) =>
            await _payments.Find(p => p.UserId == userId).ToListAsync();
    }
}
