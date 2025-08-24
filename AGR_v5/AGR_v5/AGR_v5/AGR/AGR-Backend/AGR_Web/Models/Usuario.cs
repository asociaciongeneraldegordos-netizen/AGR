using System.ComponentModel.DataAnnotations;

namespace AGR_Web.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(150)]
        public string Correo { get; set; } = string.Empty;

        [Required]
        public int Peso { get; set; }

        // Guardamos hash, no texto plano
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
