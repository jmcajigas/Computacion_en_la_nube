function uploadCSV() {
  const fileInput = document.getElementById('csvFile')
  const status = document.getElementById('status')
  const file = fileInput.files[0]

  if (!file) {
    status.textContent = 'Por favor, selecciona un archivo CSV.'
    return
  }

  if (file.type !== 'text/csv') {
    status.textContent = 'El archivo debe ser un CSV válido.'
    return
  }

  const reader = new FileReader()

  reader.onload = function (e) {
    const content = e.target.result
    // Aquí puedes hacer algo con el contenido CSV
    console.log('Contenido del CSV:', content)
    status.textContent = 'Archivo leído correctamente en el navegador.'
  }

  reader.onerror = function () {
    status.textContent = 'Error al leer el archivo.'
  }

  reader.readAsText(file)
}