let csvData; // Store parsed CSV data globally

function processData() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = event.target.result;
        csvData = parseCSV(data);
        displayColumnOptions(Object.keys(csvData[0]));
    };

    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j].trim()] = line[j].trim();
            }
            data.push(obj);
        }
    }
    return data;
}

function displayColumnOptions(columns) {
    const selectElement = document.getElementById('columnSelect');
    selectElement.innerHTML = ''; // Clear previous options

    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column;
        option.textContent = column;
        selectElement.appendChild(option);
    });
}

function hideAllOptions() {
    const chartOptions = document.getElementById('chartOptions');
    chartOptions.querySelectorAll('div').forEach(option => {
        option.style.display = 'none';
    });
}

function generateChart() {
    const chartType = document.getElementById('chartSelect').value;
    const selectedOptions = document.getElementById(chartType + 'Options');

    // Hide all chart options
    hideAllOptions();
    selectedOptions.style.display = 'block';

    const ctx = document.getElementById('chartContainer').getContext('2d');
    // Destroy the previous chart if it exists
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Get the selected column from the CSV data
    const selectedColumn = document.getElementById('columnSelect').value;
    const columnData = getColumnData(selectedColumn);

    switch(chartType) {
        case 'bar':
            generateBarChart(ctx, columnData);
            break;
        case 'line':
            generateLineChart(ctx, columnData);
            break;
        case 'pie':
            generatePieChart(ctx, columnData);
            break;
        case 'radar':
            generateRadarChart(ctx, columnData);
            break;
        case 'doughnut':
            generateDoughnutChart(ctx, columnData);
            break;
        // Add more cases for additional chart types
    }
}

function getColumnData(columnName) {
    const labels = [];
    const values = [];
    csvData.forEach(row => {
        labels.push(row[columnName]);
        values.push(parseFloat(row[columnName])); // Convert data to numeric if needed
    });
    return { labels, values, columnName };
}

function generateBarChart(ctx, columnData) {
    const barColor = document.getElementById('barColor').value;
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: columnData.labels,
            datasets: [{
                label: '# of ' + columnData.columnName,
                data: columnData.values,
                backgroundColor: barColor
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function generateLineChart(ctx, columnData) {
    const lineColor = document.getElementById('lineColor').value;
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: columnData.labels,
            datasets: [{
                label: columnData.columnName,
                data: columnData.values,
                borderColor: lineColor,
                tension: 0.1
            }]
        }
    });
}

function generatePieChart(ctx, columnData) {
    const pieColors = [];
    for (let i = 0; i < columnData.values.length; i++) {
        pieColors.push(getRandomColor());
    }
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: columnData.labels,
            datasets: [{
                label: columnData.columnName,
                data: columnData.values,
                backgroundColor: pieColors,
                hoverOffset: 4
            }]
        }
    });
}

function generateRadarChart(ctx, columnData) {
    const radarColor = document.getElementById('radarColor').value;
    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: columnData.labels,
            datasets: [{
                label: columnData.columnName,
                data: columnData.values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: radarColor,
                pointBackgroundColor: radarColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: radarColor
            }]
        }
    });
}

function generateDoughnutChart(ctx, columnData) {
    const doughnutColor = document.getElementById('doughnutColor').value;
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: columnData.labels,
            datasets: [{
                label: columnData.columnName,
                data: columnData.values,
                backgroundColor: [doughnutColor],
                hoverOffset: 4
            }]
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
