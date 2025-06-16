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

  reader.onload = async function (e) {
    const content = e.target.result
    console.log('Contenido del CSV:', content)

    const response = await fetch("https://vvuvvvctirpgigmpppowtgr5vu0oxnmm.lambda-url.us-east-1.on.aws/", {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: content
    });

    const responseText = await response.text();

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${JSON.stringify(errorData, null, 2)}`);
    }

    status.textContent = responseText

    console.log(response)
  }

  reader.onerror = function () {
    status.textContent = 'Error al leer el archivo.'
  }

  reader.readAsText(file)
}

async function initialLoad() {
  let fechaFinal = new Date()
  let fechaInicial = new Date(fechaFinal)
  fechaInicial.setMonth(fechaInicial.getMonth() - 1)

  fechaInicial = `${fechaInicial.getFullYear()}-${fechaInicial.getMonth() < 10 ? '0' + (fechaInicial.getMonth() + 1) : fechaInicial.getMonth() + 1}-${fechaInicial.getDate() < 10 ? '0' + fechaInicial.getDate() : fechaInicial.getDate()}`
  fechaFinal = `${fechaFinal.getFullYear()}-${fechaFinal.getMonth() < 10 ? '0' + (fechaFinal.getMonth() + 1) : fechaFinal.getMonth() + 1}-${fechaFinal.getDate() < 10 ? '0' + fechaFinal.getDate() : fechaFinal.getDate()}`

  const datepickerInicial = document.getElementById('datepickerInicial');
  const datepickerFinal = document.getElementById('datepickerFinal');

  datepickerInicial.value = fechaInicial
  datepickerFinal.value = fechaFinal

  const query = encodeURIComponent(`select * from ventas.vetas_detalle vd where fecha BETWEEN '${fechaInicial} 00:00:00' and '${fechaFinal} 00:00:00'`);

  const response = await fetch(`https://vvuvvvctirpgigmpppowtgr5vu0oxnmm.lambda-url.us-east-1.on.aws/?query=${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    const errorData = JSON.parse(responseText);
    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${JSON.stringify(errorData, null, 2)}`);
  }

  const data = JSON.parse(responseText);
  renderTabla(data)
}

async function getDataByDates() {
  const fechaInicial = document.getElementById('datepickerInicial').value;
  const fechaFinal = document.getElementById('datepickerFinal').value;
  const query = encodeURIComponent(`select * from ventas.vetas_detalle vd where fecha BETWEEN '${fechaInicial} 00:00:00' and '${fechaFinal} 00:00:00'`);
  const response = await fetch(`https://vvuvvvctirpgigmpppowtgr5vu0oxnmm.lambda-url.us-east-1.on.aws/?query=${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  const responseText = await response.text();
  if (!response.ok) {
    const errorData = JSON.parse(responseText);
    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${JSON.stringify(errorData, null, 2)}`);
  }
  const data = JSON.parse(responseText);
  renderTabla(data)

}

async function renderTabla(data) {
  const tableBody = document.getElementById('bodyTable');
  tableBody.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');
    rowData = data[i]
    for (let j = 0; j < rowData.length; j++) {
      const td = document.createElement('td');
      td.textContent = rowData[j];
      row.appendChild(td);
    }

    tableBody.appendChild(row);
  }
}

