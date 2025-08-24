# AGR Web - Login/Registro listo (backend)

## Pasos
1) Revisa tu `appsettings.json` -> ConnectionStrings:MiConexion apunta a tu SQL Server.
2) En Package Manager Console:
   Add-Migration CreateUsuarios
   Update-Database
3) Arranca la app y usa /Usuario/Registro y /Usuario/Login

Contraseñas con SHA-256 y sesiones habilitadas.
