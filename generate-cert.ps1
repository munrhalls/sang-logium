# Generate self-signed SSL certificate for localhost development
# Run this script in PowerShell with Administrator privileges

Write-Host "Generating SSL certificate for localhost..." -ForegroundColor Green

# Create certificate
$cert = New-SelfSignedCertificate `
    -Subject "localhost" `
    -DnsName "localhost", "127.0.0.1" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -NotBefore (Get-Date) `
    -NotAfter (Get-Date).AddYears(2) `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -FriendlyName "Localhost Development Certificate" `
    -HashAlgorithm SHA256 `
    -KeyUsage DigitalSignature, KeyEncipherment, DataEncipherment `
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")

# Export certificate to PEM format
$certificatePath = "$PSScriptRoot\localhost.pem"
$keyPath = "$PSScriptRoot\localhost-key.pem"

# Export public certificate
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certPem = "-----BEGIN CERTIFICATE-----`n"
$certPem += [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$certPem += "`n-----END CERTIFICATE-----"
$certPem | Out-File -FilePath $certificatePath -Encoding ASCII

Write-Host "Certificate created: $certificatePath" -ForegroundColor Cyan

# Export private key (requires additional steps)
Write-Host "`nTo export the private key, we need to use certutil:" -ForegroundColor Yellow
Write-Host "1. Open 'certmgr.msc' (Certificate Manager)" -ForegroundColor White
Write-Host "2. Go to Personal > Certificates" -ForegroundColor White
Write-Host "3. Find 'localhost' certificate" -ForegroundColor White
Write-Host "4. Right-click > All Tasks > Export" -ForegroundColor White
Write-Host "5. Choose 'Yes, export the private key'" -ForegroundColor White
Write-Host "6. Select 'Personal Information Exchange (.PFX)'" -ForegroundColor White
Write-Host "7. Set a password (or leave empty for development)" -ForegroundColor White
Write-Host "8. Save as 'localhost.pfx'" -ForegroundColor White

Write-Host "`nAlternatively, we'll use a simpler Node.js-based approach..." -ForegroundColor Green
Write-Host "Installing 'devcert' package for easier certificate generation..." -ForegroundColor Green

# The simpler approach is to use a Node package
Write-Host "`nRun these commands in your project terminal:" -ForegroundColor Cyan
Write-Host "  npm install -D devcert" -ForegroundColor White
Write-Host "  npm install -D https-localhost" -ForegroundColor White
