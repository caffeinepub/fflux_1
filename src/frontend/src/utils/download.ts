export function downloadFile(bytes: Uint8Array, filename: string): void {
  // Create a Blob from the bytes - convert to regular Uint8Array to ensure compatibility
  const uint8Array = new Uint8Array(bytes);
  const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
  
  // Create an object URL
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
