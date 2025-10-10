using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Backend.Middleware
{
    public class SimpleRateLimiter
    {
        private static readonly ConcurrentDictionary<string, (DateTime Timestamp, int Count)> _requests = new();
        private readonly int _maxRequests;
        private readonly TimeSpan _window;
        private readonly RequestDelegate _next;

        public SimpleRateLimiter(RequestDelegate next, int maxRequests, TimeSpan window)
        {
            _next = next;
            _maxRequests = maxRequests;
            _window = window;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;

            if (_requests.TryGetValue(ip, out var entry))
            {
                if (now - entry.Timestamp < _window)
                {
                    if (entry.Count >= _maxRequests)
                    {
                        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                        context.Response.Headers["Retry-After"] = ((int)(entry.Timestamp.Add(_window) - now).TotalSeconds).ToString();
                        await context.Response.WriteAsJsonAsync(new
                        {
                            message = "Too many requests. Please try again later."
                        });
                        return;
                    }

                    _requests[ip] = (entry.Timestamp, entry.Count + 1);
                }
                else
                {
                    _requests[ip] = (now, 1);
                }
            }
            else
            {
                _requests[ip] = (now, 1);
            }

            await _next(context);
        }
    }
}
