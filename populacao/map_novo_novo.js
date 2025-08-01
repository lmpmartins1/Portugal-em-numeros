<!-- map_novo.js -->
let activeCouncil = null;
let isClickOutsideBound = false;

function createMap() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 280 400");
    
	
	// Add each council path to the SVG
    for (const [council, data] of Object.entries(councilData)) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", data.path);
        path.setAttribute("id", council);
		path.setAttribute("fill", "white");
        path.setAttribute("stroke", "#333");
        path.setAttribute("stroke-width", "1");
		path.style.cursor = "pointer";
		// Add click event listener
        //path.addEventListener("click", () => showCouncilInfo(council));
		path.addEventListener("click", () => handleCouncilClick(council,sliderValue = null));
		

        path.addEventListener("mouseover", function() {
            if (this.id !== activeCouncil) {
                this.setAttribute("fill", "#007bff");
                this.setAttribute("stroke", "#333");
                this.setAttribute("stroke-width", "1");
				document.getElementById("popup").style.display = "block";
				document.getElementById("popup").innerHTML = council;
            }
        });
        
        path.addEventListener("mouseout", function() {
            if (this.id !== activeCouncil) {
                this.setAttribute("fill", "white");
                this.setAttribute("stroke", "#333");
                this.setAttribute("stroke-width", "1");
				document.getElementById("popup").style.display = "none";
				document.getElementById("popup").innerHTML = null;
            }
        });
		
		
		if (!isClickOutsideBound) {
		path.addEventListener('click', function(event) {
        if (path.contains(event.target)) return;
        
        if (path.id !== activeCouncil) {
            path.setAttribute("fill", "white");
            path.setAttribute("stroke", "#333");
            path.setAttribute("stroke-width", "1");
            document.getElementById("popup").style.display = "none";
            document.getElementById("popup").innerHTML = null;
			findCouncil(councilData_novo,council,datavar,datayear);
        }
    });
    
    isClickOutsideBound = true;
}
		
		svg.appendChild(path);
    }
      // Add to page
    document.getElementById('portugal-map').appendChild(svg);
}


function handleCouncilClick(council, sliderValue = null) {
    // Reset previously selected council
    if (activeCouncil) {
        const prevCouncil = document.getElementById(activeCouncil);
        prevCouncil.setAttribute("fill", "white");
        prevCouncil.setAttribute("stroke", "#333");
        prevCouncil.setAttribute("stroke-width", "1");
    }
    
    // Highlight newly selected council
    const selectedCouncil = document.getElementById(council);
    selectedCouncil.setAttribute("fill", "#007bff");
    selectedCouncil.setAttribute("stroke", "#333");
    selectedCouncil.setAttribute("stroke-width", "1");
    
    activeCouncil = council;
    document.getElementById("council").style.display = "block";
    document.getElementById("council").innerHTML = council;
    document.getElementById("council_info").style.display = "block";
    
    var datavar = document.getElementById("result").innerHTML;
    var datayear = sliderValue || document.getElementById("yearDisplay").innerHTML;
    var radioselection = document.getElementById("result_sub").innerHTML;
    //Selecionar o objeto de dados correto baseado no datavar
    let dataFile;
    var councilexcl = ["Portugal","Continente","Norte","Área Metropolitana de Lisboa","Centro","Alentejo"];
    if (datavar.includes("Habitantes")) {
        dataFile = councilData_novo;
		findCouncil(dataFile, council, datavar, datayear);
		const anos = Object.keys(dataFile[council][datavar]).sort();
		createCouncilTimeline(dataFile, council, datavar, anos, false, false,"Total");
		colorCouncilByData(dataFile, datavar, datayear, "#FF0000", "#15a708", councilexcl,"Total");
		document.getElementById("histogram").innerHTML = null;
        document.getElementById("pyramid-container").innerHTML = null;
		document.getElementById("suboption").innerHTML = null;
    } else if (datavar.includes("Variação")) {
        dataFile = councilData_var;
		findCouncil(dataFile, council, datavar, datayear)
		createCouncilHistogram(dataFile, datavar, datayear, councilexcl);
		const anos = Object.keys(dataFile[council][datavar]).sort();
		createCouncilTimeline(dataFile, council, datavar, anos, true, true,"Total");
		colorCouncilByData(dataFile, datavar, datayear, "#FF0000", "#15a708", councilexcl,"Total");
        document.getElementById("pyramid-container").innerHTML = null;
		document.getElementById("suboption").innerHTML = null;
		document.getElementById('radio-menu').innerHTML = null;
    } else if (datavar.includes("Etário")) {
        dataFile = councilData_etario;
		findDemographicData(dataFile,council,datayear,"Ambos");
		colorCouncilByLargestAgeRange(dataFile,datayear,"Ambos",councilexcl)
		createPopulationPyramid(dataFile, council,datayear);
        document.getElementById("histogram").innerHTML = null;
        document.getElementById("timeline").innerHTML = null;
		document.getElementById("suboption").innerHTML = null;
	} else if (datavar.includes("Imigração")) {
        dataFile = councilData_imigracao;
		findCouncil(dataFile, council, datavar, datayear);
		createRadioMenu(dataFile, council, datavar, datayear)
		const anos = Object.keys(dataFile[council][datavar]).sort();
		colorCouncilByData(dataFile, datavar, datayear, "#FF0000", "#15a708", councilexcl,radioselection);
		createCouncilTimeline(dataFile, council, datavar, anos, false, false, radioselection);
		createBarChart(dataFile,datavar,datayear,council)
        document.getElementById("pyramid-container").innerHTML = null;
    }else if (datavar.includes("Estrangeira")) {
        dataFile = councilData_varImigracao;
		findCouncil(dataFile, council, datavar, datayear)
		createCouncilHistogram(dataFile, datavar, datayear, councilexcl);
		const anos = Object.keys(dataFile[council][datavar]).sort();
		createCouncilTimeline(dataFile, council, datavar, anos, true, true, "Total");
		colorCouncilByData(dataFile, datavar, datayear, "#FF0000", "#15a708", councilexcl,"Total");
        document.getElementById("pyramid-container").innerHTML = null;
		document.getElementById("suboption").innerHTML = null;
		document.getElementById('radio-menu').innerHTML = null;
    }else if (datavar.includes("Crime")) {
		dataFile = councilData_crime;
		findCouncil(dataFile, council, datavar, datayear);
		const anos = Object.keys(dataFile[council][datavar]).sort();
		// Check if radio menu already exists
		createRadioMenu(dataFile, council, datavar, datayear)
		colorCouncilByData(dataFile, datavar, datayear, "#FF0000", "#15a708", councilexcl, radioselection);
		createCouncilTimeline(dataFile, council, datavar, anos, false, false, radioselection);
		createBarChart(dataFile,datavar,datayear,council)
        document.getElementById("pyramid-container").innerHTML = null;
	}

    // Atualizar o título do gráfico com o tipo de dado
    document.getElementById("council").innerHTML = `${council} - ${datavar}`;
    document.body.appendChild(histogram);
    document.body.appendChild(councilChart);
}

// Adicionar o event listener ao slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('#yearSlider');
    if (slider) {
        slider.addEventListener('input', function(e) {
            handleCouncilClick(activeCouncil, e.target.value);
        });
    }
});


//functions//
function findCouncil(dataFile, council, dataVariable, year) {
    // Check if all required inputs are provided
    if (!dataFile || !council || !dataVariable || !year) {
        console.error('Missing required parameters');
        return null;
    }

    // Validate dataVariable
    const validFields = document.getElementById("result").innerHTML;
    if (!validFields.includes(dataVariable)) {
        console.error(`Invalid dataVariable. Must be one of: ${validFields.join(', ')}`);
        return null;
    }

    // Convert dataFile to array of key-value pairs
    for (const [councilName, data] of Object.entries(dataFile)) {
        if (councilName === council) {
            // Check if the dataVariable exists and has the specified year
            if (data[dataVariable] && data[dataVariable][year]) {
                // Display the specific data field in council_info div
                const councilInfo = document.getElementById('council_info');
				if (['Habitantes', 'Variação','Imigração','Estrangeira'].includes(dataVariable)) {
					if (councilInfo) {
						councilInfo.innerHTML = `
							${dataVariable.charAt(0).toUpperCase() + dataVariable.slice(1)}
							<p> Total (${year}): ${data[dataVariable][year]["Total"].toFixed(2)}</p>
							<p> Homem (${year}): ${data[dataVariable][year]["Homem"].toFixed(2)}</p>
							<p> Mulher (${year}): ${data[dataVariable][year]["Mulher"].toFixed(2)}</p>
						`;
					}
				} else if (dataVariable === 'Crime') {
					if (councilInfo) {
						councilInfo.innerHTML = `
							${dataVariable.charAt(0).toUpperCase() + dataVariable.slice(1)} por 100.000 habitantes
							<p> Total (${year}): ${data[dataVariable][year]["Total"].toFixed(2)}</p>
						`;
					}
				} else {
					return {};
				}
				
				

                return data[dataVariable][year];
            } else {
                console.error(`No data found for ${council} in ${dataVariable} for year ${year}`);
                return null;
            }
        }
    }
    return null;
}

function findDemographicData(dataFile, council, year, gender) {
    // Validação dos parâmetros
    if (!dataFile || !council || !year || !gender) {
        console.error('Parâmetros obrigatórios faltando: dataFile, council, year, gender');
        return null;
    }

    // Definir gêneros válidos
    const validGenders = ['Ambos', 'Homem', 'Mulher'];
    if (!validGenders.includes(gender)) {
        console.error(`Gênero inválido. Deve ser um destes: ${validGenders.join(', ')}`);
        return null;
    }

    // Definir faixas etárias válidas e seus valores médios
    const validAgeRanges = [
        { range: 'under4', midPoint: 2 },
        { range: 'from5to9', midPoint: 7 },
        { range: 'from10to14', midPoint: 12 },
        { range: 'from15to19', midPoint: 17 },
        { range: 'from20to24', midPoint: 22 },
        { range: 'from25to29', midPoint: 27 },
        { range: 'from30to34', midPoint: 32 },
        { range: 'from35to39', midPoint: 37 },
        { range: 'from40to44', midPoint: 42 },
        { range: 'from45to49', midPoint: 47 },
        { range: 'from50to54', midPoint: 52 },
        { range: 'from55to59', midPoint: 57 },
        { range: 'from60to64', midPoint: 62 },
        { range: 'from65to69', midPoint: 67 },
        { range: 'from70to74', midPoint: 72 },
        { range: 'from75to79', midPoint: 77 },
        { range: 'from80to84', midPoint: 82 },
        { range: 'over85', midPoint: 90 }
    ];

    // Navegar pela estrutura do objeto
    const councilData = dataFile[council]?.etario?.[year]?.[gender];
    if (!councilData) {
        console.error(`Não foram encontrados dados para o município "${council}" no ano "${year}" para o gênero "${gender}"`);
        return null;
    }

    // Calcular idade média
    let totalPopulation = 0;
    let totalAgePoints = 0;

    for (const ageRange of validAgeRanges) {
        const population = councilData[ageRange.range];
        if (population) {
            totalPopulation += population;
            totalAgePoints += population * ageRange.midPoint;
        }
    }

    if (totalPopulation === 0) {
        console.error('Não foi possível calcular a idade média: dados demográficos inválidos');
        return null;
    }

    const averageAge = totalAgePoints / totalPopulation;

    // Exibir os dados na div council_info
    const councilInfo = document.getElementById('council_info');
    if (councilInfo) {
        councilInfo.innerHTML = `
            <h3>${council}</h3>
            <p>Ano: ${year}</p>
            <p>Género: ${gender}</p>
            <p>Idade Média: ${averageAge.toFixed(2)} anos</p>
            <p>População Total: ${totalPopulation}</p>
        `;
    }

    return {
        averageAge: averageAge,
        totalPopulation: totalPopulation
    };
}


function colorCouncilByData(dataFile, dataVariable, year, minColor, maxColor, excludedCouncils = [],varselect) {
    // Input validation
    if (!dataFile || !dataVariable || !year || !minColor || !maxColor) {
        console.error('Missing required parameters');
        return null;
    }

    // Define valid fields
    const validFields = document.getElementById("result").innerHTML;
    if (!validFields.includes(dataVariable)) {
        console.error(`Invalid dataVariable. Must be one of: ${validFields.join(', ')}`);
        return null;
    }

    // Create a new object with only included councils
    const includedCouncils = {};
    for (const [councilName, data] of Object.entries(dataFile)) {
        if (!excludedCouncils.some(excluded => 
            councilName.toLowerCase() === excluded.toLowerCase()
        )) {
            includedCouncils[councilName] = data;
        }
    }
	

    // Get values from included councils for the specified year
    const values = Object.values(includedCouncils)
        .map(data => data[dataVariable][year][varselect]);

    // Calculate min/max using only included values
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Process all councils except excluded ones
    let successCount = 0;
    for (const [councilName, data] of Object.entries(dataFile)) {
        // Skip if council doesn't have the required field or is excluded
        if (!data.hasOwnProperty(dataVariable) || 
            !data[dataVariable].hasOwnProperty(year) ||
            excludedCouncils.some(excluded => 
                councilName.toLowerCase() === excluded.toLowerCase()
            )) {
            console.log(`Skipping ${councilName}`);
            continue;
        }

        // Normalize value to 0-1 range
        const range = maxValue - minValue;
		const colorfactor = (() => {
			if (range > 1000) return 20;
			if (range > 20) return 2;
			return 1;
		})();
        const normalizedValue = (data[dataVariable][year][varselect] - minValue) * colorfactor / (maxValue - minValue);

        // Interpolate color
        const interpolatedColor = interpolateColor(minColor, maxColor, normalizedValue);
        
        // Apply color to council element
        const councilElement = document.querySelector(`[id*="${councilName.replace(/"/g, '\\"')}"]`);
        if (councilElement) {
            councilElement.style.fill = interpolatedColor;
            successCount++;
        }
    }

    return successCount;
}

// Helper functions remain unchanged
function interpolateColor(startColor, endColor, factor) {
    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);

    const r = Math.round(startRGB.r + factor * (endRGB.r - startRGB.r));
    const g = Math.round(startRGB.g + factor * (endRGB.g - startRGB.g));
    const b = Math.round(startRGB.b + factor * (endRGB.b - startRGB.b));

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



// Function to show council information
//function showCouncilInfo(council) {
//    const data = councilData[council];
//    const details = document.getElementById('council-info');
//    details.innerHTML = `
//        <h3>${council}</h3>
//    `;
//}

// Initialize the map when the page loads

//// Define the valid data variables for council operations
//const VALID_COUNCIL_VARIABLES = ['population', 'area', 'description'];

// Get the data variable from the result element
//const datavar = document.getElementById("result").innerHTML;

// Check if datavar is a valid council variable
//if (VALID_COUNCIL_VARIABLES.includes(datavar)) {
//    // Call findCouncil and colorCouncilByData for valid council variables
//    findCouncil(councilData_novo, council, datavar);
//    colorCouncilByData(councilData_novo, datavar, "#FF0000", "#15a708");
//} else {
//    // Call electionsCouncil for other variables
//    electionsCouncil(councilData_novo, council);
//}



function createCouncilHistogram(dataFile, dataVariable, year, excludedCouncils = []) {
    // Input validation
    if (!dataFile || !dataVariable || !year) {
        console.error('Missing required parameters');
        return null;
    }

    // Define valid fields
    const validFields = document.getElementById("result").innerHTML;
    if (!validFields.includes(dataVariable)) {
        console.error(`Invalid dataVariable. Must be one of: ${validFields.join(', ')}`);
        return null;
    }

    // Create a new object with only included councils
    const includedCouncils = {};
    for (const [councilName, data] of Object.entries(dataFile)) {
        if (!excludedCouncils.some(excluded => 
            councilName.toLowerCase() === excluded.toLowerCase()
        )) {
            includedCouncils[councilName] = data;
        }
    }

    // Get values from included councils for the specified year
    const values = Object.values(includedCouncils)
        .map(data => data[dataVariable][year]["Total"]);

    // Calculate histogram parameters
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const binCount = Math.min(25, Math.max(5, Math.ceil(Math.sqrt(values.length))));
    const binSize = range / binCount;

    // Create bins
    const bins = Array(binCount).fill(0);
    values.forEach(value => {
        const binIndex = Math.min(
            binCount - 1,
            Math.floor((value - minValue) / binSize)
        );
        bins[binIndex]++;
    });

    // Create the histogram
    const canvas = document.createElement('canvas');
    canvas.width = 550;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw histogram
    const barWidth = (canvas.width - 50) / binCount - 2;
    const maxValueInBins = Math.max(...bins);
    const scale = (canvas.height - 50) / maxValueInBins;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(25, canvas.height - 25);
    ctx.lineTo(25, 25);
    ctx.lineTo(canvas.width - 25, 25);
    ctx.strokeStyle = "#333";
    ctx.stroke();

    // Draw bars
    bins.forEach((count, index) => {
        const x = 30 + index * (barWidth + 2);
        const height = count * scale;
        const y = canvas.height - 25 - height;

        ctx.fillStyle = "#007bff";
        ctx.fillRect(x, y, barWidth, height);

        // Add y-value inside bar
        ctx.fillStyle = "#ffffff";
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(count.toString(), x + barWidth/2, y + height/2);
    });

    // Add labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    //ctx.fillText(`Ano: ${year}`, 10, 15);
    //ctx.fillText(dataVariable, canvas.width - 100, canvas.height);

    // Add value labels
    const binLabels = bins.map((_, index) => {
        const start = minValue + (index * binSize);
        const end = Math.min(minValue + ((index + 1) * binSize), maxValue);
        return `${end.toFixed(1)}`;
    });

    // Draw bin labels
    ctx.textAlign = 'center';
    binLabels.forEach((label, index) => {
        const x = 30 + index * (barWidth + 2) + barWidth / 2;
        ctx.save();
        ctx.translate(x, canvas.height - 15);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
    });

    // Add title
    ctx.textAlign = 'center';
    ctx.fillText(`Histograma da ${dataVariable} (${year})`, canvas.width / 2, 20);
    
    // Get the histogram element and append the canvas
    const histogramElement = document.getElementById('histogram');
    if (histogramElement) {
        histogramElement.innerHTML = '';
        histogramElement.appendChild(canvas);
    } else {
        console.error('Element with id "histogram" not found');
        return null;
    }

    return canvas;
}


function createCouncilTimeline(dataFile, council, dataVariable, years, showHomem = true, showMulher = true,varselect) {
    // Input validation
    if (!dataFile || !council || !dataVariable || !years) {
        console.error('Missing required parameters');
        return null;
    }

    // Define valid fields
    const validFields = document.getElementById("result").innerHTML;
    if (!validFields.includes(dataVariable)) {
        console.error(`Invalid dataVariable. Must be one of: ${validFields.join(', ')}`);
        return null;
    }

    // Get council data
    const councilData = dataFile[council];
    if (!councilData || !councilData[dataVariable]) {
        console.error(`No data found for council ${council} in ${dataVariable}`);
        return null;
    }

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 550;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get values for each year
    const totalValues = years.map(year => councilData[dataVariable][year][varselect]);
    const homemValues = showHomem ? years.map(year => councilData[dataVariable][year]["Homem"]) : null;
    const mulherValues = showMulher ? years.map(year => councilData[dataVariable][year]["Mulher"]) : null;

    // Calculate scale
    const allValues = [...totalValues, ...(homemValues || []), ...(mulherValues || [])];
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const scale = (canvas.height - 100) / (maxValue - minValue);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50, 50);
    ctx.lineTo(canvas.width - 50, 50);
    ctx.strokeStyle = "#333";
    ctx.stroke();

    // Draw grid lines
    const gridCount = 5;
    const gridStep = (canvas.height - 100) / gridCount;
    for (let i = 1; i < gridCount; i++) {
        const y = canvas.height - 50 - (i * gridStep);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(canvas.width - 50, y);
        ctx.strokeStyle = "#eee";
        ctx.stroke();
    }

    // Draw data lines
    const drawLine = (values, color, label) => {
        if (!values) return;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Draw line
        values.forEach((value, index) => {
            const x = 50 + (index * (canvas.width - 100) / (years.length - 1));
            const y = canvas.height - 50 - (value - minValue) * scale;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        values.forEach((value, index) => {
            const x = 50 + (index * (canvas.width - 100) / (years.length - 1));
            const y = canvas.height - 50 - (value - minValue) * scale;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        });

        // Add legend
        ctx.fillStyle = color;
        ctx.fillRect(canvas.width - 40, 60 + (label === 'Total' ? 0 : label === 'Homem' ? 30 : 60), 20, 2);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(label, canvas.width - 45, 80 + (label === 'Total' ? 0 : label === 'Homem' ? 30 : 60));
    };

    // Draw all lines
    drawLine(totalValues, "#28a745", "Total");
    drawLine(homemValues, "#007bff", "Homem");
    drawLine(mulherValues, "#dc3545", "Mulher");

    // Add labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';

    // Add year labels
    years.forEach((year, index) => {
        const x = 50 + (index * (canvas.width - 100) / (years.length - 1));
        ctx.save();
        ctx.translate(x, canvas.height - 20);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(year.toString(), 0, 0);
        ctx.restore();
    });

    // Add value labels on y-axis
    const step = (maxValue - minValue) / 5;
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (i * step);
        const y = canvas.height - 50 - (value - minValue) * scale;
        ctx.fillText(value.toFixed(1), 20, y);
    }
	

    // Add title
    ctx.textAlign = 'center';
    ctx.fillText(`${council} - ${dataVariable} por Ano`, canvas.width / 2, 30);

    // Add council name
    ctx.fillText(`Ano`, canvas.width / 2, canvas.height - 10);

    // Get the timeline element and append the canvas
    const timelineElement = document.getElementById('timeline');
    if (timelineElement) {
        timelineElement.innerHTML = '';
        timelineElement.appendChild(canvas);
    } else {
        console.error('Element with id "timeline" not found');
        return null;
    }

    return canvas;
}



// Função para gerar cores baseadas na faixa etária
function getAgeRangeColor(ageRange) {
    const ageRangeColors = {
        'under4': '#80D0FF',      // Vermelho claro para menores de 4 anos
        'from5to9': '#99CCFF',    // Laranja claro para 5-9 anos
        'from10to14': '#FF99CC',  // Amarelo claro para 10-14 anos
        'from15to19': '#CC99FF',  // Verde claro para 15-19 anos
        'from65to69': '#CCFFCC',  // Verde forte para 65-69 anos
		'from20to24':"#04490c",
		'from25to29':"#0a7400",
		'from30to34':"#15a708",
		'from35to39':"#04c707",
		'from40to44':"#00fb1d",
		 'from45to49':"#caffde",
		'from50to54':'#FFFF66',
        'from55to59':'#FFFF99',  // Amarelo forte para 70-74 anos
		'from60to64':'#FFB366',
		'from65to69':"#FFCCCC", // Very Light Red,
		'from70to74':"#FF9999", // Lighter Red
        'from75to79': "#FF4D4D", // Light Red
        'from80to84': "#FF0000", // Red
        'over85':"#660000"  // Dark Red

    };
    return ageRangeColors[ageRange] || '#CCCCCC'; // Cor padrão se não encontrar
}

function colorCouncilByLargestAgeRange(
    dataFile, 
    year, 
    gender = 'Ambos', 
    excludedCouncils = []
) {
    // Validação dos parâmetros
    if (!dataFile || !year) {
        console.error('Parâmetros obrigatórios faltando: dataFile e year');
        return null;
    }

    // Obtém dados demográficos para cada município
    const councilData = {};
    let successCount = 0;

    for (const councilName of Object.keys(dataFile)) {
        // Ignora municípios excluídos
        if (excludedCouncils.some(excluded => 
            councilName.toLowerCase() === excluded.toLowerCase())) {
            continue;
        }

        // Obtém dados demográficos diretamente do arquivo
        const councilDataRaw = dataFile[councilName]?.etario?.[year]?.[gender];
        if (!councilDataRaw) {
            console.log(`Dados demográficos não encontrados para ${councilName}`);
            continue;
        }

        // Encontra a faixa etária com maior população
        let maxPopulation = -Infinity;
        let maxAgeRange = null;

        // Verifica cada faixa etária
        const validAgeRanges = ['under4', 'from5to9', 'from10to14', 'from15to19', 'from20to24',
                              'from25to29', 'from30to34', 'from35to39', 'from40to44', 'from45to49',
                              'from50to54', 'from55to59', 'from60to64', 'from65to69', 'from70to74',
                              'from75to79', 'from80to84', 'over85'];

        for (const ageRange of validAgeRanges) {
            const population = councilDataRaw[ageRange];
            if (population && population > maxPopulation) {
                maxPopulation = population;
                maxAgeRange = ageRange;
            }
        }

        if (!maxAgeRange) {
            console.log(`Não foi possível encontrar faixa etária válida para ${councilName}`);
            continue;
        }

        // Armazena os dados do município
        councilData[councilName] = {
            ageRange: maxAgeRange,
            population: maxPopulation
        };

        // Aplica cor baseada na faixa etária
        const councilElement = document.querySelector(`[id*="${councilName.replace(/"/g, '\\"')}"]`);
        if (councilElement) {
            const color = getAgeRangeColor(maxAgeRange) || '#808080'; // Cor padrão cinza
            councilElement.style.fill = color;
            successCount++;
        }
    }

    return successCount;
}


function createPopulationPyramid(dataFile, council, year) {
            // Validação dos parâmetros
            if (!dataFile || !council || !year) {
                console.error('Parâmetros obrigatórios faltando: dataFile, council, year');
                return null;
            }

            const validAgeRanges = [
                { range: 'under4', midPoint: 2 },
                { range: 'from5to9', midPoint: 7 },
                { range: 'from10to14', midPoint: 12 },
                { range: 'from15to19', midPoint: 17 },
                { range: 'from20to24', midPoint: 22 },
                { range: 'from25to29', midPoint: 27 },
                { range: 'from30to34', midPoint: 32 },
                { range: 'from35to39', midPoint: 37 },
                { range: 'from40to44', midPoint: 42 },
                { range: 'from45to49', midPoint: 47 },
                { range: 'from50to54', midPoint: 52 },
                { range: 'from55to59', midPoint: 57 },
                { range: 'from60to64', midPoint: 62 },
                { range: 'from65to69', midPoint: 67 },
                { range: 'from70to74', midPoint: 72 },
                { range: 'from75to79', midPoint: 77 },
                { range: 'from80to84', midPoint: 82 },
                { range: 'over85', midPoint: 90 }
            ];

            // Obter dados do município
            const councilData = dataFile[council]?.etario?.[year];
            if (!councilData) {
                console.error(`Não foram encontrados dados para o município "${council}" no ano "${year}"`);
                return null;
            }

            // Calcular valores máximos para escala
            let maxMale = 0;
            let maxFemale = 0;
			var maxAmbos = 0;
            
            for (const ageRange of validAgeRanges) {
                const maleCount = councilData['Homem']?.[ageRange.range] || 0;
                const femaleCount = councilData['Mulher']?.[ageRange.range] || 0;
                
                maxMale = Math.max(maxMale, maleCount);
                maxFemale = Math.max(maxFemale, femaleCount);
            }
			maxAmbos = Math.max(maxMale,maxFemale);
			
            // Criar SVG
            const container = document.getElementById('pyramid-container');
            const svgWidth = 500;
            const svgHeight = 350;
            const margin = { top: 40, right: 20, bottom: 20, left: 20 };
            const chartWidth = svgWidth - margin.left - margin.right;
            const chartHeight = svgHeight - margin.top - margin.bottom;

            // Limpar container anterior
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", svgWidth);
            svg.setAttribute("height", svgHeight);
            svg.classList.add("pyramid-svg");

            // Adicionar título
            const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
            title.setAttribute("x", (svgWidth / 2).toString());
            title.setAttribute("y", "30");
            title.setAttribute("text-anchor", "middle");
            title.setAttribute("font-size", "20");
            title.textContent = `${council} - ${year}`;
            svg.appendChild(title);

            // Criar barras
            const barHeight = chartHeight / (validAgeRanges.length * 1.2);
            const barSpacing = barHeight * 0.2;

            // Criar tooltip
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            document.body.appendChild(tooltip);

            // Função para atualizar tooltip
            function updateTooltip(event, text) {
                const rect = svg.getBoundingClientRect();
                tooltip.style.left = (event.clientX + 10) + "px";
                tooltip.style.top = (event.clientY + 10) + "px";
                tooltip.textContent = text;
                tooltip.style.opacity = "1";
            }

            // Função para remover tooltip
            function hideTooltip() {
                tooltip.style.opacity = "0";
            }

            // Criar linha central
            const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            axisLine.setAttribute("x1", (margin.left + chartWidth/2).toString());
            axisLine.setAttribute("y1", margin.top.toString());
            axisLine.setAttribute("x2", (margin.left + chartWidth/2).toString());
            axisLine.setAttribute("y2", (margin.top + chartHeight).toString());
            axisLine.classList.add("axis-line");
            svg.appendChild(axisLine);

            // Desenhar barras masculinas (lado esquerdo)
            validAgeRanges.forEach((range, index) => {
                const width = (councilData['Homem'][range.range] / maxAmbos) * (chartWidth / 2);
                const x = margin.left + (chartWidth/2) - width;
                const y = margin.top + chartHeight - (index * (barHeight + barSpacing)) - barHeight;

                const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                bar.setAttribute("x", x.toString());
                bar.setAttribute("y", y.toString());
                bar.setAttribute("width", width.toString());
                bar.setAttribute("height", barHeight.toString());
                bar.classList.add("bar-male");

                bar.addEventListener("mousemove", (e) => {
                    updateTooltip(e, 
                        `${range.range}: ${councilData['Homem'][range.range].toLocaleString()} homens`
                    );
                });

                bar.addEventListener("mouseleave", hideTooltip);
                svg.appendChild(bar);
            });

            // Desenhar barras femininas (lado direito)
            validAgeRanges.forEach((range, index) => {
                const width = (councilData['Mulher'][range.range] / maxAmbos) * (chartWidth / 2);
                const x = margin.left + (chartWidth/2);
                const y = margin.top + chartHeight - (index * (barHeight + barSpacing)) - barHeight;

                const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                bar.setAttribute("x", x.toString());
                bar.setAttribute("y", y.toString());
                bar.setAttribute("width", width.toString());
                bar.setAttribute("height", barHeight.toString());
                bar.classList.add("bar-female");

                bar.addEventListener("mousemove", (e) => {
                    updateTooltip(e, 
                        `${range.range}: ${councilData['Mulher'][range.range].toLocaleString()} mulheres`
                    );
                });

                bar.addEventListener("mouseleave", hideTooltip);
                svg.appendChild(bar);
            });


            container.appendChild(svg);

            return {
                maxMalePopulation: maxMale,
                maxFemalePopulation: maxFemale
            };
        }
		
		
		
function createBarChart(dataFile, dataVariable, year, council) {
    // Input validation
    if (!dataFile || !dataVariable || !year || !council) {
        console.error('Missing required parameters');
        return null;
    }

    // Get the specific council data
    const councilData = dataFile[council];
    if (!councilData) {
        console.error(`Council "${council}" not found in data`);
        return null;
    }

    // Get the year's data
    const yearData = councilData[dataVariable][year];
    if (!yearData) {
        console.error(`Year "${year}" not found in data for council "${council}"`);
        return null;
    }

    // Create data array for categories
    const categories = Object.entries(yearData)
		  .filter(([key]) => !['Total', 'Homem', 'Mulher','America'].includes(key))
		  .map(([category, data]) => ({
			category,
            value: data
        }));
		
	var categ = document.getElementById("result_sub").innerHTML


    // Create the canvas
    const canvas = document.createElement('canvas');
    canvas.width = 550;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate bar properties
    const maxValue = Math.max(...categories.map(c => c.value));
    const barCount = categories.length;
    const barWidth = (chartWidth / barCount) * 0.8;
    const barSpacing = (chartWidth / barCount) * 0.2;

    // Draw grid lines
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    
    // Vertical grid lines
    for (let i = 0; i <= barCount + 1; i++) {
        const x = padding + i * (chartWidth / barCount);
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
    }

    // Horizontal grid lines
    const gridStep = Math.ceil(maxValue / 10);
    for (let y = 0; y <= 10; y++) {
        const yPos = canvas.height - padding - (y * chartHeight / 10);
        ctx.moveTo(padding, yPos);
        ctx.lineTo(canvas.width - padding, yPos);
        
        // Add y-axis labels
        ctx.save();
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(y * gridStep, padding - 10, yPos);
        ctx.restore();
    }

    ctx.stroke();

    // Draw bars
    categories.forEach((data, index) => {
        const barHeight = (data.value / maxValue) * chartHeight;
        const x = padding + index * (chartWidth / barCount) + barSpacing / 2;
        const y = canvas.height - padding - barHeight;

        // Draw bar with blue color
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Add value label on top of bar

    });

    // Add rotated category labels
    categories.forEach((data, index) => {
        const x = padding + index * (chartWidth / barCount) + barSpacing / 2;

    });

    // Add title
    ctx.save();
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`${council} - ${dataVariable} ${categ} (${year})`, canvas.width/2, padding/2);
    ctx.restore();

    // Add hover functionality
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calculate which bar is being hovered
        const barIndex = Math.floor((x - padding) / (chartWidth / barCount));
        
        if (barIndex >= 0 && barIndex < barCount) {
            const data = categories[barIndex];
            const barHeight = (data.value / maxValue) * chartHeight;
            const barY = canvas.height - padding - barHeight;

            // Clear previous tooltip
            ctx.clearRect(0, 0, canvas.width+100, canvas.height);

            // Redraw everything
            drawChart(ctx, categories, maxValue, padding, chartWidth, chartHeight, barWidth, barSpacing);

            // Draw tooltip
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(300, 40, 200, 60);
            
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
			ctx.font = '14px Arial';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.category, 305, 60);
            ctx.fillText(`Value: ${data.value.toFixed(2)}`, 305,  80);
        }
    });

    // Add function to redraw chart
    function drawChart(ctx, categories, maxValue, padding, chartWidth, chartHeight, barWidth, barSpacing) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        
        // Vertical grid lines
        for (let i = 0; i <= barCount + 1; i++) {
            const x = padding + i * (chartWidth / barCount);
            ctx.moveTo(x, padding);
            ctx.lineTo(x, canvas.height - padding);
        }

        // Horizontal grid lines
        const gridStep = Math.ceil(maxValue / 10);
        for (let y = 0; y <= 10; y++) {
            const yPos = canvas.height - padding - (y * chartHeight / 10);
            ctx.moveTo(padding, yPos);
            ctx.lineTo(canvas.width - padding, yPos);
            
            // Add y-axis labels
            ctx.save();
            ctx.fillStyle = '#666';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(y * gridStep, padding - 10, yPos);
            ctx.restore();
        }

        ctx.stroke();

        // Draw bars
        categories.forEach((data, index) => {
            const barHeight = (data.value / maxValue) * chartHeight;
            const x = padding + index * (chartWidth / barCount) + barSpacing / 2;
            const y = canvas.height - padding - barHeight;

            // Draw bar with blue color
            ctx.fillStyle = '#0066cc';
            ctx.fillRect(x, y, barWidth, barHeight);


        });

        // Add rotated category labels
        categories.forEach((data, index) => {
            const x = padding + index * (chartWidth / barCount) + barSpacing / 2;
            
        });
		var categ = document.getElementById("result_sub").innerHTML
        // Add title
        ctx.save();
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`${council} - ${dataVariable} ${categ} (${year})`, canvas.width/2, padding/2);
        ctx.restore();
    }

    // Get the histogram element and append the canvas
    const histogramElement = document.getElementById('histogram');
    if (histogramElement) {
        histogramElement.innerHTML = '';
        histogramElement.appendChild(canvas);
    } else {
        console.error('Element with id "histogram" not found');
        return null;
    }

    return canvas;
}


function createRadioMenu(dataFile, council, datavar, datayear) {
    // Get existing radio container or create new one
    let radioContainer = document.getElementById('radio-menu');
    
    // Remove existing container if it exists
    if (radioContainer) {
        radioContainer.remove();
    }
    
    // Create new container
    radioContainer = document.createElement('div');
    radioContainer.id = 'radio-menu';
    radioContainer.style.display = 'block';
    radioContainer.style.marginTop = '10px';

    // Get categories from the data structure
    const categories = Object.keys(dataFile[council][datavar][datayear]);

    // Create radio buttons for each category
    categories.forEach(category => {
        if (category !== 'Total1') {  // Skip the Total category
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'crimeCategory';
            radioInput.value = category;
            radioInput.id = `radio-${category}`;
            
            const radioLabel = document.createElement('label');
            radioLabel.htmlFor = `radio-${category}`;
            radioLabel.textContent = category;

            // Add event listener for radio selection
            radioInput.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Update the visualization to show the selected category
                    document.getElementById("result_sub").style.display = "block";
                    document.getElementById("result_sub").innerHTML = e.target.value;
                }
            });

            // Add to container
            radioContainer.appendChild(radioInput);
            radioContainer.appendChild(radioLabel);
            radioContainer.appendChild(document.createElement('br'));
        }
    });

    // Add radio menu after the existing dropdown
    const parent = document.getElementById("suboption").parentElement;
    parent.appendChild(radioContainer);
}

document.addEventListener('DOMContentLoaded', createMap);