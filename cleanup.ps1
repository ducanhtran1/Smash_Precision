Set-Location -Path "backend"

yarn remove prisma @prisma/client
yarn add @nestjs/typeorm typeorm pg @nestjs/config

if (Test-Path "prisma") {
    Remove-Item -Recurse -Force "prisma"
}

if (Test-Path "src\prisma.service.ts") {
    Remove-Item "src\prisma.service.ts" -Force
}
