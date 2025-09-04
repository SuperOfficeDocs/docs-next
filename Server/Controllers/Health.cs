using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("api")]
    public class TestController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health() {
            return Ok(
                        new { 
                            status = "ok", 
                            now = DateTime.UtcNow
                        }
                    );
        }
    }
}