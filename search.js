const path = require('path');
const fs = require('fs');
var NumOfMatchingFiles=0;

function searchFilesInDirectory(dir, filter, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    const files = fs.readdirSync(dir);
    const found = getFilesInDirectory(dir, ext);

    found.forEach(file => {
        const fileContent = fs.readFileSync(file);
        // We want full words, so we use full word boundary in regex.
        const regex = new RegExp('\\b' + filter + '\\b');
        if (regex.test(fileContent)) {
          NumOfMatchingFiles++;
            console.log(__dirname + "\\" + `${file}`);
        }
    });
    checkIfStringFound(NumOfMatchingFiles);
}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectory(dir, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            if (path.extname(file) === ext) {
                files.push(filePath);
            }
        }
    });
    return files;
}

// Check if app not received any parameter and print a relevant message if not.
function noArgumentFromConsole(checkArgv){
  if (checkArgv==null){
    console.log("USAGE: node search [EXT] [TEXT]");
  }
}

// Check if no suitable file found and print a relevant message if not.
function checkIfStringFound(NumToCheck){
  if (NumToCheck==0){
    console.log("No file was found");
  }
}

noArgumentFromConsole(process.argv[2]);
searchFilesInDirectory("./", process.argv[3], "." + process.argv[2]);
