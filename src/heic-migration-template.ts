/**
 * HEIC Migration page template — admin tool for converting existing
 * HEIC/HEIF files in R2 to WebP. Must be opened in Safari (macOS/iOS)
 * because only Safari can decode HEIC natively.
 *
 * One-time use: delete this file after migration is complete.
 */
export function renderHeicMigrationPage(secret: string): string {
	const safeSecret = secret.replace(/[\\'"<>&]/g, (c) => {
		const map: Record<string, string> = {
			"\\": "\\\\",
			"'": "\\'",
			'"': '\\"',
			"&": "\\x26",
			"<": "\\x3C",
			">": "\\x3E",
		};
		return map[c] ?? c;
	});

	return `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HEIC Migration</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; background: #f9fafb; color: #111827; }
h1 { font-size: 1.5rem; }
p { color: #4b5563; line-height: 1.6; }
.file { padding: 12px; margin: 8px 0; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.file.done { border-color: #22c55e; background: #f0fdf4; }
.file.error { border-color: #ef4444; background: #fef2f2; }
.file .name { font-size: 14px; color: #374151; word-break: break-all; }
.file .status { font-size: 13px; color: #6b7280; white-space: nowrap; margin-left: 12px; }
button { background: #ff3d6f; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; }
button:disabled { background: #9ca3af; cursor: not-allowed; }
#progress { margin: 16px 0; font-size: 14px; color: #374151; }
</style>
</head>
<body>
<h1>HEIC → WebP Migrácia</h1>
<p>Otvorte túto stránku v <strong>Safari</strong> (macOS/iOS) — iba Safari dokáže dekódovať HEIC súbory.</p>
<div id="progress"></div>
<button id="startBtn">Spustiť migráciu</button>
<div id="files"></div>
<script>
(function() {
  var SECRET = '${safeSecret}';
  var filesDiv = document.getElementById('files');
  var progressDiv = document.getElementById('progress');
  var startBtn = document.getElementById('startBtn');

  startBtn.addEventListener('click', startMigration);

  async function startMigration() {
    startBtn.disabled = true;
    progressDiv.textContent = 'Načítavam zoznam HEIC súborov...';

    var res = await fetch('/api/admin/heic-files', { headers: { 'x-api-key': SECRET } });
    var data = await res.json();

    if (!data.files || data.files.length === 0) {
      progressDiv.textContent = 'Žiadne HEIC súbory na konverziu. Všetko je v poriadku.';
      startBtn.textContent = 'Hotovo';
      return;
    }

    progressDiv.textContent = 'Nájdených ' + data.count + ' HEIC súborov. Konvertujem...';

    var done = 0;
    var errors = 0;

    for (var i = 0; i < data.files.length; i++) {
      var file = data.files[i];

      var div = document.createElement('div');
      div.className = 'file';

      var nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = file.fileName;
      div.appendChild(nameSpan);

      var statusSpan = document.createElement('span');
      statusSpan.className = 'status';
      statusSpan.textContent = 'konvertujem...';
      div.appendChild(statusSpan);

      filesDiv.appendChild(div);

      try {
        var imgRes = await fetch('/api/photos/' + file.id + '/full');
        var blob = await imgRes.blob();

        var bitmap = await createImageBitmap(blob);
        var canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        var webpBlob = await new Promise(function(resolve) {
          canvas.toBlob(resolve, 'image/webp', 0.9);
        });
        if (!webpBlob) throw new Error('Canvas conversion failed');

        var formData = new FormData();
        var newName = file.fileName.replace(/\\.(heic|heif)$/i, '.webp');
        formData.append('file', webpBlob, newName);

        var uploadRes = await fetch('/api/admin/convert-heic/' + file.id, {
          method: 'POST',
          headers: { 'x-api-key': SECRET },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Upload failed: ' + uploadRes.status);

        div.className = 'file done';
        statusSpan.textContent = 'hotovo (' + Math.round(webpBlob.size / 1024) + ' KB)';
        done++;
      } catch (err) {
        div.className = 'file error';
        statusSpan.textContent = err.message;
        errors++;
      }

      progressDiv.textContent = done + '/' + data.count + ' hotových' + (errors ? ', ' + errors + ' chýb' : '');
    }

    progressDiv.textContent = 'Hotovo! ' + done + ' skonvertovaných' + (errors ? ', ' + errors + ' chýb' : '');
    startBtn.textContent = 'Hotovo';
  }
})();
</script>
</body>
</html>`;
}
