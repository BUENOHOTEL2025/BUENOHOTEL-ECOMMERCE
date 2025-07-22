# PowerShell script para compilar y subir el frontend de Ecommerce a S3

# 1. Compilar en modo producción
ng build --configuration production

# 2. Subir solo el contenido del browser al bucket S3 (sin --delete)
aws s3 sync dist/webapp-ecommerce-buenohotel/browser s3://ecommerce-buenohotel-com-do-website-bucket

Write-Host "¡Deploy completado! Revisa tu sitio en producción."
