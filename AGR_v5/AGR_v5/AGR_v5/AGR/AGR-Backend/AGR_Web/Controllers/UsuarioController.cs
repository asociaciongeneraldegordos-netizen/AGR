using Microsoft.AspNetCore.Mvc;
using AGR_Web.Data;
using AGR_Web.Models;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace AGR_Web.Controllers
{
    public class UsuarioController : Controller
    {
        private readonly AGRContext _context;
        private const string SessionUserId = "UserId";
        private const string SessionUserName = "UserName";

        public UsuarioController(AGRContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Registro() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Registro(string nombre, string correo, int peso, string password)
        {
            if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(password))
            {
                ViewBag.Error = "Completa todos los campos.";
                return View();
            }

            if (_context.Usuarios.Any(u => u.Correo == correo))
            {
                ViewBag.Error = "Ese correo ya está registrado.";
                return View();
            }

            var usuario = new Usuario
            {
                Nombre = nombre,
                Correo = correo,
                Peso = peso,
                PasswordHash = Hash(password)
            };

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            HttpContext.Session.SetInt32(SessionUserId, usuario.Id);
            HttpContext.Session.SetString(SessionUserName, usuario.Nombre);

            return RedirectToAction("Perfil");
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(string correo, string password)
        {
            var user = _context.Usuarios.FirstOrDefault(u => u.Correo == correo);
            if (user == null || user.PasswordHash != Hash(password))
            {
                ViewBag.Error = "Correo o contraseña incorrectos.";
                return View();
            }

            HttpContext.Session.SetInt32(SessionUserId, user.Id);
            HttpContext.Session.SetString(SessionUserName, user.Nombre);

            return RedirectToAction("Perfil");
        }

        [HttpGet]
        public IActionResult Perfil()
        {
            var id = HttpContext.Session.GetInt32(SessionUserId);
            if (id == null) return RedirectToAction("Login");

            var user = _context.Usuarios.FirstOrDefault(u => u.Id == id.Value);
            if (user == null)
            {
                HttpContext.Session.Clear();
                return RedirectToAction("Login");
            }
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

        private static string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return System.Convert.ToHexString(bytes);
        }

        [HttpGet("leaderboard")]
        public IActionResult GetLeaderboard()
        {
            var leaderboard = _context.Usuarios
                .OrderByDescending(u => u.Peso) // Mayor peso primero
                .Take(10)
                .Select(u => new
                {
                    u.Nombre,
                    u.Peso
                })
                .ToList();

            return Ok(leaderboard);
        }
    }
}
