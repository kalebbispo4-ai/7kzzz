@echo off
title Abrindo Painel Coleira...
cls

:: Verifica se a pasta node_modules existe, se não, instala tudo
if not exist "node_modules" (
    echo [!] Modulos nao encontrados. Instalando dependencias...
    call npm install discord.js-selfbot-v13 express
    cls
)

echo [!] Iniciando servidor e abrindo Chrome...
:: O script painel.js vai abrir o Chrome automaticamente
node painel.js

if %errorlevel% neq 0 (
    echo.
    echo [X] Erro critico ao iniciar. Verifique o console.
    pause
)
pause