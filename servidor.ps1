# Servidor local para testar a landing page (http://localhost:8780)
param([string]$Root = $PSScriptRoot, [int]$Port = 8780)
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Landing Eusebio Cup rodando em http://localhost:$Port/  (feche esta janela para encerrar)"
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript'; '.jpg'='image/jpeg'; '.png'='image/png'; '.webp'='image/webp'; '.svg'='image/svg+xml'; '.mp4'='video/mp4'; '.css'='text/css' }
while ($l.IsListening) {
  $c = $l.GetContext(); $req = $c.Request; $res = $c.Response
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ($rel -eq '') { $rel = 'index.html' }
    $f = Join-Path $Root $rel
    if (Test-Path $f -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($f).ToLower(); $res.ContentType = $types[$ext]; $res.AddHeader('Accept-Ranges', 'bytes')
      $fs = [IO.File]::Open($f, 'Open', 'Read', 'ReadWrite, Delete'); $len = $fs.Length; $start = 0; $end = $len - 1
      $range = $req.Headers['Range']
      if ($range -match 'bytes=(\d*)-(\d*)') {
        if ($matches[1]) { $start = [long]$matches[1] }
        if ($matches[2]) { $end = [long]$matches[2] }
        $end = [Math]::Min($end, $start + 2MB - 1)
        $res.StatusCode = 206; $res.AddHeader('Content-Range', "bytes $start-$end/$len")
      }
      $count = $end - $start + 1; $res.ContentLength64 = $count; $fs.Seek($start, 'Begin') | Out-Null
      $buf = New-Object byte[] 262144
      while ($count -gt 0) { $n = $fs.Read($buf, 0, [Math]::Min($buf.Length, $count)); if ($n -le 0) { break }; $res.OutputStream.Write($buf, 0, $n); $count -= $n }
      $fs.Close()
    } else { $res.StatusCode = 404 }
  } catch { } finally { try { $res.Close() } catch { } }
}
