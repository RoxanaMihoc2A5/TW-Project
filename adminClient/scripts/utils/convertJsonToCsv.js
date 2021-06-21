const convertJsonArrayToCsv = (jsonArray = []) => {
	let csv = '';
	// adaugam intai header-ul la csv
	keys = Object.keys(jsonArray[0]).sort();
	csv += keys.join(',');
	csv += '\n';

	// adaugam la csv valorile separate prin virgula (in ordine) - deoarece json-urile nu sunt structuri ordonate
	for (const obj of jsonArray) {
		csv += `\"${obj[keys[0]]}\",${obj[keys[1]]},${obj[keys[2]]},${
			obj[keys[3]]
		}`;
		csv += '\n';
	}

	return csv;
};

function exportCSVFile(csv, fileTitle = 'export.csv') {
	var exportedFilename = fileTitle + '.csv';

	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

	var link = document.createElement('a');
	if (link.download !== undefined) {
		var url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', exportedFilename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
