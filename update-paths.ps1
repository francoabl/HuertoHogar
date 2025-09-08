# Script para actualizar rutas en todos los archivos HTML
# PowerShell script to update file paths

Write-Host "🔧 Actualizando rutas en archivos HTML..." -ForegroundColor Yellow

# Obtener todos los archivos HTML en src/pages
$htmlFiles = Get-ChildItem -Path "src\pages\*.html"

foreach ($file in $htmlFiles) {
    Write-Host "📝 Procesando: $($file.Name)" -ForegroundColor Cyan
    
    # Leer contenido del archivo
    $content = Get-Content $file.FullName -Raw
    
    # Actualizar rutas CSS
    $content = $content -replace 'href="huertohogar-web\.css"', 'href="../css/huertohogar-web.css"'
    
    # Actualizar rutas JS
    $content = $content -replace 'src="huertohogar-web\.js"', 'src="../js/components/huertohogar-web.js"'
    $content = $content -replace 'src="js/auth\.js"', 'src="../js/auth/auth.js"'
    $content = $content -replace 'src="js/demo-data\.js"', 'src="../js/auth/demo-data.js"'
    $content = $content -replace 'src="blog\.js"', 'src="../js/components/blog.js"'
    $content = $content -replace 'src="contacto\.js"', 'src="../js/components/contacto.js"'
    
    # Guardar archivo actualizado
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "✅ Actualizado: $($file.Name)" -ForegroundColor Green
}

Write-Host "🎉 ¡Todas las rutas han sido actualizadas!" -ForegroundColor Green
