@echo off
TITLE BurguerSync Ourinhos - Launcher Local
color 06

echo ========================================================
echo   BURGUERSYNC OURINHOS - CARDAPIO & KDS REALTIME
echo   Desenvolvido com Google Antigravity, Stitch & Firebase
echo ========================================================
echo.

echo [1/3] Validando contratos de dados e integridade do schema...
node execution\validate-schema.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha na validacao do contrato. Abortando inicializacao.
    pause
    exit /b 1
)

echo.
echo [2/3] Executando testes unitarios...
node --test tests\unit\orders.test.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha nos testes unitarios. Abortando inicializacao.
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando servidor estatico local na porta 3000...
echo Abrindo navegador em http://localhost:3000/
start http://localhost:3000/

npx serve . -l 3000
pause
