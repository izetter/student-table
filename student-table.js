
function checkStudents() {
    document.getElementById("results").innerHTML = "";                          // To delete existing results table in case thenumber of students changes.
    let parentNode = document.getElementById("errors");
    parentNode.innerHTML = "";                                                  // This statement deletes the contents of the parent node evrytime the function is called including the childNode, so the notice of an error only shows once.
    const numStudents = +document.getElementById("students").value;             // Must use unary plus " + " instead of parseInt because the latter apparently truncates decimal numbers and returns just the integer part, making it impossible to validate for decimal numbers with modulo. Maybe parseFloat would work too.
    if (numStudents <= 0 || numStudents % 1 !== 0 || numStudents === "") {      // Now it works! don't know why <<<< numStudents === "" WILL NOT work to check for emptyness in this case beacuse an empty value is returned as NaN (Not a Number), not just "". isNaN(numStudents) would work though, becasue that method checks for Not a Number. I decided not to use isNan() to have more clarity of what's going on in the if condition by explicitly saying that i'm retrieving the value of an HTML element -which may not always be a number- and beacuse sometimes later in this code isNan() will not work because some input types return undefined instead of NaN when empty (also good for consistency). It's somewhat "more correct" to say that i'm validating for an EMPTY field rather than validating for a NaN, even though that because of the number input type of "students", there can't be a string typed there, so it just happens that EMPTYNESS passes as NaN in this case.
        styleError(students);                                                   // Applies styles for an input with errors. NOTICE HOW IT WORKS IN THIS WHEN I'M PASSING A HTML ID AS AN ARGUMENT!, it works because any given id can only exist once in a document, (it's as if it were an array of one single element, BUT IT ISN'T!). If I do the same with non-unique tags, such as name, it may apply the whole style change to the whole array rather than just the wrong one. That is the case of the grades and names of the students. So, When dealing with a multiple elements situation, it's better to first create a variable whose elements are, each, an input field and then passing that variable to the styleWrong()/styleCorrect() function, all this within a loop of course i.e " gradeOneArray = document.getElementsByName("gradeOne"); " >> styleWrong(gradeOneArray[i]);
        let childNode = document.createElement("p");
        childNode.innerHTML = "*Introduce positive integers only";
        parentNode.appendChild(childNode);
    } else {
        styleCorrect(students);                                                 // Resets the styles (applies initial/correct styles) in case an input was previously styled with styleCorrect()
        generateInputTable();
    }
}

function generateInputTable() {
    let inputTable = "<table>";
    inputTable += "<thead>";
    inputTable += "<th>#</th>";
    inputTable += "<th>Name</th>";
    inputTable += "<th>Date of Birth</th>";
    inputTable += "<th>Age</th>";
    inputTable += "<th>Grade 1</th>";
    inputTable += "<th>Grade 2</th>";
    inputTable += "<th>Grade 3</th>";
    inputTable += "<th>Final grade</th>";
    inputTable += "<th>Grade category</th>";
    inputTable += "</thead>";
    inputTable += "<tbody>";

    const numStudents = +document.getElementById("students").value;
    for (let i = 1; i <= numStudents; i++) {
        inputTable += "<tr>";
        inputTable += "<td>"+ i +"</td>";
        inputTable += "<td><input name='student-name' type='text'></td>";
        inputTable += "<td><input name='student-DoB' type='date'></td>";
        inputTable += "<td name='age'></td>";
        inputTable += "<td><input name='student-grade1' type='number' min='0' max='100'></td>";
        inputTable += "<td><input name='student-grade2' type='number' min='0' max='100'></td>";
        inputTable += "<td><input name='student-grade3' type='number' min='0' max='100'></td>";
        inputTable += "<td name='final-grade'></td>";
        inputTable += "<td name='grade-category'></td>";
        inputTable += "</tr>";
    }

    inputTable += "</tbody>";
    inputTable += "<tfoot>";
    inputTable += "<tr>";
    inputTable += "<td colspan='5'></td><td colspan='2'>Group averages:</td><td id='group-avg'></td><td id='group-cat'></td>";
    inputTable += "</tr>";
    inputTable += "<tr>";
    inputTable += "<td colspan='9'><button onclick='checkInputTable()'>Check</button></td>";
    inputTable += "</tr>";
    inputTable += "</tfoot>";
    inputTable += "</table>";
    document.getElementById("results").innerHTML = inputTable;
}

function checkInputTable() {
    let parentNode = document.getElementById("errors");
    parentNode.innerHTML = "";
    let errorName = false;
    let errorBirthdate = false;
    let errorGrade = 0;
    let namesArray = document.getElementsByName("student-name");
    let birthdatesArray = document.getElementsByName("student-DoB");
    let grade1Array = document.getElementsByName("student-grade1");
    let grade2Array = document.getElementsByName("student-grade2");
    let grade3Array = document.getElementsByName("student-grade3");
    const numStudents = +document.getElementById("students").value;

    for (let i = 0; i < numStudents; i++) {             // numStudents IS NOT AN ARRAY, it's a number that kind of acts as the length of an array. The condition (i < namesArray.length;) could be used instead, but note that in such case it would be weird to have the date and grade ifs conditioned by the lenght of another array's field and not their own, even if their own is the same length. Because numStudents "dictates" the size of all the input arrays, using it as the condition makes more sense if only one for structure is going to be used to control all the input fields, otherwise use each for with the pertinent arrayName.length condition.
        if (namesArray[i].value === "" || /[^A-Za-zñáéíóúü\s]/.test(namesArray[i].value)) {
            styleError(namesArray[i]);
            errorName = true;
        } else {
            styleCorrect(namesArray[i]);
        }
        if (birthdatesArray[i].value === "" || birthdatesArray[i].valueAsNumber > Date.now()) {         // valueAsNumber had to be specified otherwise it takes the literal date string.
            styleError(birthdatesArray[i]);
            errorBirthdate = true;
        } else {
            styleCorrect(birthdatesArray[i]);
        }
    }

    if (errorName === true) {
        let childNode = document.createElement("p");
        childNode.innerHTML = "*Names must contain only characters found in the English or Spanish alphabets.";
        parentNode.appendChild(childNode);
    }
    if (errorBirthdate === true) {
        let childNode = document.createElement("p");
        childNode.innerHTML = "*One or more Dates of Birth are invalid or not specified.";
        parentNode.appendChild(childNode);
    }

    checkGrades(grade1Array);
    checkGrades(grade2Array);
    checkGrades(grade3Array);

    function checkGrades(array) {
        for (let i = 0; i < array.length; i++) {
            let grade = array[i].value;
            if (grade < 0 || grade > 100 || grade === "") {
                styleError(array[i]);
                errorGrade += 1;
            } else {
                styleCorrect(array[i]);
            }
        }
    }

    if (errorGrade > 0) {
        let childNode = document.createElement("p");
        childNode.innerHTML = "*Grades must be in the 0 to 100 range.";
        parentNode.appendChild(childNode);
    }

    if (errorName === false && errorBirthdate === false && errorGrade === 0) {
        generateResults();
    }

    function generateResults() {        // Remember you could as well do like: let myVar = grade1Array[i].valueAsNumber; (and so on..) and use these variables to calculate instead of writing everything explicitly. SPecially useful when you must call the variables or their values multiple times.
        let ages = document.getElementsByName("age");
        let finalGradesArray = document.getElementsByName("final-grade");
        let gradeCategoryArray = document.getElementsByName("grade-category");
        let gradeNumbers = [];
        let groupAVG = document.getElementById("group-avg");
        for (let i = 0; i < numStudents; i++) {
            ages[i].innerHTML = agecalc(birthdatesArray[i].value);
            finalGradesArray[i].innerHTML = Math.round(0.3*(grade1Array[i].valueAsNumber + grade2Array[i].valueAsNumber) + 0.4*(grade3Array[i].valueAsNumber));     // Notice the .valueAsNumber, with just .value it woud be retrieving strings even though it's from a number type input.
            gradeCategoryArray[i].innerHTML = gradecategory(parseInt(finalGradesArray[i].innerHTML));      // parseInt because everything in an input gets stored as a string, even in number input types https://stackoverflow.com/a/35791893 I didn't use parseFloat or unary plus because I already rounded the values of the finalGradesArray. This is not to say they wouldn't work though.
            gradeNumbers.push(parseInt(finalGradesArray[i].innerHTML));    // try gradeNumbers += parseInt(finalGradesArray[i].innerHTML);
        }
        groupAVG.innerHTML = sumelements(gradeNumbers)/numStudents;
        document.getElementById("group-cat").innerHTML = gradecategory(+groupAVG.innerHTML);
    }
}

function styleError(array) {
    array.style.backgroundColor = "#FFC7CE";
    array.style.borderColor = "red";
    array.style.borderStyle = "solid";
}

function styleCorrect(array) {
    array.style.backgroundColor = "white";      // If set to "initial", aside from picking the color behind the input field, which is expected, it "buggily" triggers user agent unexpected behavior woth the border style. See comment below. 
    array.style.borderColor = "initial";
    array.style.borderStyle = "inset";          // If set to "initial" user agent would remove the border. If in addition with array.style.backgroundColor = "white"; (AND ONLY WHITE!) the inset style is actually ignored but the border is not removed... this is the behavior we want in this case, just not the way I believe it should have been implemented. This "buggy" behavior was likely passed as a feature of the user agent, similar things happen with scrollbars and other things apparently: https://stackoverflow.com/q/3781693
}

function agecalc(dateString) {
    let birthdate = +new Date(dateString);
    return ~~((Date.now() - birthdate) / (31557600000));        /* double tildes " ~~ " may be used in lieu of " Math.floor " https://stackoverflow.com/q/4055633 just mind the caveats */
}

function gradecategory(grade) {
    var category = ['unsatisfactory', 'satisfactory', 'good', 'great', 'excellent']
    if (grade < 60) {
        return category[0];
    } else if (grade < 70) {
        return category[1];
    } else if (grade < 80) {
        return category[2];
    } else if (grade < 90) {
        return category[3];
    } else if (grade <= 100) {
        return category[4];
    }
}

function sumelements(array) {
    accumulator = 0;
    for (i=0; i < array.length; i++) {
        accumulator += array[i];
    }
    return accumulator;
}


const studentsInput = document.querySelector('#students');
const submitBtn = document.querySelector('#submit-btn');

studentsInput.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter') submitBtn.click();
})
