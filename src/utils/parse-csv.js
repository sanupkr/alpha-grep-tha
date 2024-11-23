import Papa from "papaparse";

export const parseCSV = (file,isUploaded=false) => {
    if(!isUploaded){
        return fetch(file)
        .then((response) => response.text())
        .then((csvText) => {
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
            });
        });
        });
    }
    else{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
        
            reader.onload = (event) => {
              const csvText = event.target.result;
              Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: (results) => resolve(results.data),
                error: (error) => reject(error),
              });
            };
        
            reader.onerror = (error) => reject(error);
        
            reader.readAsText(file);
          });
    }
  
};