$SUPABASE_URL = "https://kbjavbfbwamlqvbqougm.supabase.co"
$SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiamF2YmZid2FtbHF2YnFvdWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc5MjE5NywiZXhwIjoyMDg5MzY4MTk3fQ.HwML6CB0MsL4U-bOTG3U4ZkARFXj4u8jq3xsXIKMBEk"
$headers = @{
    "apikey"        = $SERVICE_KEY
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=representation"
}
$casos = @(
    @{ nombre="Castor Perez";email="castor.perez@cmac.com";monto=1000;plazo=12;tea=43.92;cuota=100.95;ingreso=800;gasto=300 }
    @{ nombre="Eneida Mamani";email="eneida.mamani@cmac.com";monto=3000;plazo=12;tea=40.92;cuota=299.59;ingreso=1500;gasto=500 }
    @{ nombre="Ovidio Torres";email="ovidio.torres@cmac.com";monto=5000;plazo=18;tea=43.92;cuota=366.02;ingreso=2000;gasto=700 }
    @{ nombre="Dante Flores";email="dante.flores@cmac.com";monto=8000;plazo=6;tea=43.92;cuota=1480.73;ingreso=5000;gasto=1500 }
    @{ nombre="Laura Mendoza";email="laura.mendoza@cmac.com";monto=10000;plazo=12;tea=43.92;cuota=1009.46;ingreso=4000;gasto=1200 }
    @{ nombre="Boccaccio Vargas";email="boccaccio.vargas@cmac.com";monto=12000;plazo=24;tea=40.92;cuota=700.94;ingreso=3500;gasto=1000 }
    @{ nombre="Orlando Rios";email="orlando.rios@cmac.com";monto=15000;plazo=18;tea=43.92;cuota=1098.07;ingreso=5000;gasto=1500 }
    @{ nombre="Gerusalemme Huanca";email="gerusalemme.huanca@cmac.com";monto=18000;plazo=24;tea=43.92;cuota=1072.10;ingreso=5500;gasto=1600 }
    @{ nombre="Pedro Calderon";email="pedro.calderon@cmac.com";monto=20000;plazo=36;tea=43.92;cuota=927.12;ingreso=4500;gasto=1300 }
    @{ nombre="Felix Chavez";email="felix.chavez@cmac.com";monto=25000;plazo=24;tea=40.92;cuota=1460.29;ingreso=6000;gasto=1800 }
    @{ nombre="Hildegarda Huanca";email="hildegarda.huanca@cmac.com";monto=2000;plazo=12;tea=43.92;cuota=201.89;ingreso=900;gasto=300 }
    @{ nombre="Stendhal Aguilar";email="stendhal.aguilar@cmac.com";monto=4000;plazo=18;tea=43.92;cuota=292.82;ingreso=1800;gasto=600 }
    @{ nombre="Kipling Soto";email="kipling.soto@cmac.com";monto=6000;plazo=12;tea=40.92;cuota=599.17;ingreso=2500;gasto=800 }
    @{ nombre="Erinna Espinoza";email="erinna.espinoza@cmac.com";monto=7500;plazo=6;tea=43.92;cuota=1388.18;ingreso=4500;gasto=1400 }
    @{ nombre="Annie Espinoza";email="annie.espinoza@cmac.com";monto=9000;plazo=24;tea=43.92;cuota=536.05;ingreso=3000;gasto=900 }
    @{ nombre="Homero Quispe";email="homero.quispe@cmac.com";monto=11000;plazo=18;tea=40.92;cuota=793.03;ingreso=3800;gasto=1100 }
    @{ nombre="Virgilio Mamani";email="virgilio.mamani@cmac.com";monto=13500;plazo=12;tea=43.92;cuota=1362.77;ingreso=5000;gasto=1500 }
    @{ nombre="Ovidio Torres2";email="ovidio.torres2@cmac.com";monto=16000;plazo=36;tea=43.92;cuota=741.70;ingreso=4000;gasto=1200 }
    @{ nombre="Dante Flores2";email="dante.flores2@cmac.com";monto=17000;plazo=24;tea=40.92;cuota=993.00;ingreso=5000;gasto=1500 }
    @{ nombre="Laura Mendoza2";email="laura.mendoza2@cmac.com";monto=19000;plazo=18;tea=43.92;cuota=1390.89;ingreso=6000;gasto=1800 }
    @{ nombre="Boccaccio Vargas2";email="boccaccio.vargas2@cmac.com";monto=22000;plazo=36;tea=43.92;cuota=1019.83;ingreso=6500;gasto=2000 }
    @{ nombre="Orlando Rios2";email="orlando.rios2@cmac.com";monto=24000;plazo=24;tea=40.92;cuota=1401.88;ingreso=7000;gasto=2100 }
    @{ nombre="Gerusalemme Huanca2";email="gerusalemme.huanca2@cmac.com";monto=1500;plazo=6;tea=43.92;cuota=277.64;ingreso=700;gasto=200 }
    @{ nombre="Pedro Calderon2";email="pedro.calderon2@cmac.com";monto=3500;plazo=12;tea=43.92;cuota=353.31;ingreso=1600;gasto=500 }
    @{ nombre="Felix Chavez2";email="felix.chavez2@cmac.com";monto=5500;plazo=18;tea=40.92;cuota=396.52;ingreso=2200;gasto=700 }
    @{ nombre="Hildegarda Huanca2";email="hildegarda.huanca2@cmac.com";monto=7000;plazo=24;tea=43.92;cuota=416.93;ingreso=2800;gasto=900 }
    @{ nombre="Stendhal Aguilar2";email="stendhal.aguilar2@cmac.com";monto=8500;plazo=12;tea=43.92;cuota=858.04;ingreso=3500;gasto=1000 }
    @{ nombre="Kipling Soto2";email="kipling.soto2@cmac.com";monto=10500;plazo=36;tea=40.92;cuota=473.77;ingreso=3200;gasto=950 }
    @{ nombre="Erinna Espinoza2";email="erinna.espinoza2@cmac.com";monto=14000;plazo=18;tea=43.92;cuota=1024.87;ingreso=4500;gasto=1300 }
    @{ nombre="Annie Espinoza2";email="annie.espinoza2@cmac.com";monto=30000;plazo=24;tea=43.92;cuota=1786.83;ingreso=8000;gasto=2500 }
)
$i = 1
foreach ($caso in $casos) {
    Write-Host "[$i/30] $($caso.nombre)..." -ForegroundColor Yellow
    $bodyAuth = @{ email=$caso.email; password="cmac1234"; email_confirm=$true; user_metadata=@{ full_name=$caso.nombre } } | ConvertTo-Json
    try {
        $respAuth = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" -Method POST -Headers $headers -Body $bodyAuth -ErrorAction Stop
        $userId = $respAuth.id
        Write-Host "  OK Usuario: $userId" -ForegroundColor Green
    } catch { Write-Host "  ERR usuario: $_" -ForegroundColor Red; $i++; continue }
    $bodyRol = @(@{ user_id=$userId; rol="cliente" }) | ConvertTo-Json
    try { Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/roles_usuario" -Method POST -Headers $headers -Body $bodyRol | Out-Null; Write-Host "  OK Rol" -ForegroundColor Green } catch { Write-Host "  ERR rol: $_" -ForegroundColor Red }
    $disponible = $caso.ingreso - $caso.gasto
    $rds   = [math]::Round(($caso.cuota / $disponible) * 100, 2)
    $score = [math]::Max(0, [math]::Min(100, [math]::Round(100 - $rds, 2)))
    if ($caso.monto -le 10000) { $nivel="asesor"; $estado="desembolsado" }
    elseif ($caso.monto -le 50000) { $nivel="comite"; $estado=if($score -ge 60){"desembolsado"}else{"en_comite"} }
    else { $nivel="jefe_regional"; $estado="en_comite" }
    $bodySol = @(@{ user_id=$userId; monto=$caso.monto; plazo_meses=$caso.plazo; tasa_anual=$caso.tea; cuota_mensual=$caso.cuota; ingreso_neto=$caso.ingreso; gasto_familiar=$caso.gasto; rds=$rds; score=$score; nivel_aprobacion=$nivel; estado=$estado; tipo_credito="empresarial" }) | ConvertTo-Json
    try { Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/solicitudes_prestamo" -Method POST -Headers $headers -Body $bodySol | Out-Null; Write-Host "  OK Solicitud S/$($caso.monto) Score:$score Estado:$estado" -ForegroundColor Green } catch { Write-Host "  ERR solicitud: $_" -ForegroundColor Red }
    $i++
    Start-Sleep -Milliseconds 200
}
Write-Host "`nListo! 30 casos procesados." -ForegroundColor Cyan
