document.addEventListener('DOMContentLoaded', () => {
  const qrInput = document.getElementById('qr-input');
  const generateBtn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const qrcodeContainer = document.getElementById('qrcode');
  const errorMessage = document.getElementById('error-message');

  // Trigger QR generation on click
  generateBtn.addEventListener('click', generateQR);

  // Trigger QR generation on Enter key
  qrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  });

  // Clear error message when user starts typing
  qrInput.addEventListener('input', () => {
    errorMessage.textContent = '';
  });

  function generateQR() {
    const text = qrInput.value.trim();

    // Reset UI states
    errorMessage.textContent = '';
    qrcodeContainer.innerHTML = '';
    qrcodeContainer.style.display = 'none';
    downloadBtn.classList.add('hidden');

    // Validation
    if (!text) {
      errorMessage.textContent = 'Please enter text or a URL.';
      return;
    }

    // Check if the QRCode library is loaded successfully
    if (typeof QRCode === 'undefined') {
      errorMessage.textContent = 'Failed to load QR Code library. Please check your internet connection.';
      return;
    }

    try {
      // Create QRCode instance
      new QRCode(qrcodeContainer, {
        text: text,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      // Show container immediately
      qrcodeContainer.style.display = 'block';

      // Check for canvas or image to enable the Download button
      setTimeout(() => {
        const qrImageSrc = getQRImageSrc();
        if (qrImageSrc) {
          downloadBtn.classList.remove('hidden');
        }
      }, 50);

    } catch (error) {
      console.error(error);
      errorMessage.textContent = 'An error occurred while generating the QR Code.';
    }
  }

  // Get generated QR Image source (DataURL)
  function getQRImageSrc() {
    const canvas = qrcodeContainer.querySelector('canvas');
    const img = qrcodeContainer.querySelector('img');

    if (canvas) {
      try {
        return canvas.toDataURL('image/png');
      } catch (e) {
        console.error('Canvas conversion error:', e);
      }
    }
    if (img && img.src) {
      return img.src;
    }
    return null;
  }

  // Download QR Code PNG
  downloadBtn.addEventListener('click', () => {
    const qrImgSrc = getQRImageSrc();
    if (!qrImgSrc) {
      errorMessage.textContent = 'Could not find QR Code image to download.';
      return;
    }

    const link = document.createElement('a');
    link.href = qrImgSrc;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
