var toggleButton = document.getElementById("toggleButton");
var toggleButton2 = document.getElementById("toggleButton2");
var targetElement = document.getElementById("targetElement");
var targetElement2 = document.getElementById("targetElement2");

toggleButton.addEventListener("click", function() {
  if (targetElement.style.display === "none") {
    targetElement.style.display = "block";
  } else {
    targetElement.style.display = "none";
  }
});

toggleButton2.addEventListener("click", function() {
    if (targetElement2.style.display === "none") {
      targetElement2.style.display = "block";
    } else {
      targetElement2.style.display = "none";
    }
  });

const inverseBtn = document.querySelector(".inverseBtn");
const solveBtn = document.querySelector(".solveBtn");
const form = document.querySelector("#form");
const Switch = document.querySelector(".switch");

function solve(){
    form.style.marginLeft = "-100%";
    inverseBtn.style.background = "none";
    solveBtn.style.background =  "linear-gradient(45deg,#93e59e,#68aca0)";
   
}

function inverse(){
    form.style.marginLeft = "0";
    solveBtn.style.background = "none";
    inverseBtn.style.background =  "linear-gradient(45deg,#93e59e,#68aca0)";
}

function findInverse(A) {
    var n = A.length;

    // Create augmented matrix [A | I]
    var Matrix = [];
    for (var i = 0; i < n; i++) {
        Matrix[i] = [];
        for (var j = 0; j < 2 * n; j++) {
            Matrix[i][j] = j < n ? A[i][j] : (j === (n + i) ? 1.0 : 0.0);
        }
    }

    // Perform Gaussian elimination
    for (var i = 0; i < n; i++) {
        // Find pivot row
        var pivotRow = i;
        for (var j = i + 1; j < n; j++) {
            if (Math.abs(Matrix[j][i]) > Math.abs(Matrix[pivotRow][i])) {
                pivotRow = j;
            }
        }

        // Swap rows if necessary
        if (pivotRow !== i) {
            var temp = Matrix[i];
            Matrix[i] = Matrix[pivotRow];
            Matrix[pivotRow] = temp;
        }

        // Scale pivot row to make leading element 1
        var pivot = Matrix[i][i];
        for (var j = i; j < 2 * n; j++) {
            Matrix[i][j] /= pivot;
        }

        // Perform row operations to make other elements in the column zero
        for (var j = 0; j < n; j++) {
            if (j !== i) {
                var factor = Matrix[j][i];
                for (var k = i; k < 2 * n; k++) {
                    Matrix[j][k] -= factor * Matrix[i][k];
                }
            }
        }
    }

    // Extract the inverse matrix
    var inverseMatrix = [];
    for (var i = 0; i < n; i++) {
        inverseMatrix[i] = Matrix[i].slice(n).map(function(num){
            return num.toFixed(2);
        });
    }

    return inverseMatrix;
}

function solveLinearEquations(A, b) {
    var n = A.length;

    // Create Matrix Ab
    var Ab = [];
    for (var i = 0; i < n; i++) {
        Ab[i] = [];
        for (var j = 0; j < n + 1; j++) {
            Ab[i][j] = (j !== n) ? A[i][j] : b[i];
        }
    }

    // Perform Gaussian elimination
    for (var i = 0; i < n - 1; i++) {
        var maxRow = i;
        for (var j = i + 1; j < n; j++) {
            if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) {
                maxRow = j;
            }
        }

        if (maxRow !== i) {
            var temp = Ab[i];
            Ab[i] = Ab[maxRow];
            Ab[maxRow] = temp;
        }

        for (var j = i + 1; j < n; j++) {
            var factor = Ab[j][i] / Ab[i][i];
            for (var k = i; k < n + 1; k++) {
                Ab[j][k] -= factor * Ab[i][k];
            }
        }
    }

    // Back substitution to find the solution
    var x = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
        var sum = 0.0;
        for (var j = i + 1; j < n; j++) {
            sum += Ab[i][j] * x[j];
        }
        x[i] = (Ab[i][n] - sum) / Ab[i][i];
    }

    for (var i = 0; i < x.length; i++) {
        x[i] = x[i].toFixed(2);
    }

    return x;
}

// Function to handle button click event
function InverseHandleButtonClick() {
    // Get user input for matrix dimensions
    var rows = parseInt(document.getElementById("rowsInputM").value);
    var cols = parseInt(document.getElementById("colsInputM").value);

    // Initialize the matrix
    var A = [];
    for (var i = 0; i < rows; i++) {
        A[i] = [];
        for (var j = 0; j < cols; j++) {
            // Get user input for each element of the matrix
            var value = parseFloat(document.getElementById("A_" + i + "_" + j).value);
            A[i][j] = value;
        }
    }

    // Calculate the inverse
    var inverse = findInverse(A);

    // Display the inverse matrix
    var resultDivI = document.getElementById("resultI");
    resultDivI.innerHTML = "<b>Inverse Matrix:</b><br><br>" + matrixToString(inverse);
}

// Function to handle button click event
function SolveHandleButtonClick() {
    // Get user input for linear system
    var rows = parseInt(document.getElementById("rowsInputLS").value);

    var A = [];
    for (var i = 0; i < rows; i++) {
        A[i] = [];
        for (var j = 0; j < rows; j++) {
            var value = parseFloat(document.getElementById("A_" + i + "_" + j).value);
            A[i][j] = value;
        }
    }

    var b = [];
    for (var i = 0; i < rows; i++) {
        var value = parseFloat(document.getElementById("b_" + i).value);
        b[i] = value;
    }

    // Solve the linear equations
    var solution = solveLinearEquations(A, b);

    // Display the solution
    var resultDivLS = document.getElementById("resultLS");
    resultDivLS.innerHTML = "<b>Solution:</b><br><br>";
    for (var i = 0; i < solution.length; i++) {
        resultDivLS.innerHTML += "x[" + i + "] = " + solution[i] + "<br>";
    }
}

// Function to generate input fields for matrix elements
function generateMatrixInput() {
    var rows = parseInt(document.getElementById("rowsInputM").value);
    var cols = parseInt(document.getElementById("colsInputM").value);

    var matrixInputDivM = document.getElementById("matrixInputM");
    matrixInputDivM.innerHTML = ""; // Clear any existing input fields

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var input = document.createElement("input");
            input.type = "number";
            input.id = "A_" + i + "_" + j;
            input.placeholder = "[" + i + "][" + j + "]";
            input.style.marginRight = "10px";
            input.classList.add("custom-input2");
            matrixInputDivM.appendChild(input);
        }
        matrixInputDivM.appendChild(document.createElement("br")); // Line break after each row
    }
}

// Function to generate input fields for linear system
function generateInputLinearSystem() {
    var rows = parseInt(document.getElementById("rowsInputLS").value);

    var matrixInputDivLS = document.getElementById("matrixInputLS");
    matrixInputDivLS.innerHTML = ""; // Clear any existing input fields

    var bInputDiv = document.getElementById("bInput");
    bInputDiv.innerHTML = ""; // Clear any existing input fields

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            var input = document.createElement("input");
            input.type = "number";
            input.id = "A_" + i + "_" + j;
            input.placeholder = "A[" + i + "][" + j + "]";
            matrixInputDivLS.appendChild(input);
            input.classList.add("custom-input2");
        }

        var lineBreak = document.createElement("br");
        matrixInputDivLS.appendChild(lineBreak);
    }

    for (var i = 0; i < rows; i++) {
        var input = document.createElement("input");
        input.type = "number";
        input.id = "b_" + i;
        input.placeholder = "b[" + i + "]";
        bInputDiv.appendChild(input);

        var lineBreak = document.createElement("br");
        bInputDiv.appendChild(lineBreak);
        input.classList.add("custom-input2");
    }
}

// Function to convert a matrix to string representation
function matrixToString(matrix) {
    var str = "";
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            str += "<span class='matrix-element'>" + matrix[i][j] + "</span>&nbsp;&nbsp;";
        }
        str += "<br>";
    }
    return str;
}

// Attach event listener to the submit button
var submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", InverseHandleButtonClick);

var generateFieldsBtn = document.getElementById("generateFieldsBtn");
generateFieldsBtn.addEventListener("click", generateInputLinearSystem);

// Attach event listener to the matrix dimensions input fields
var rowsInput = document.getElementById("rowsInputM");
rowsInput.addEventListener("change", generateMatrixInput);

var colsInput = document.getElementById("colsInputM");
colsInput.addEventListener("change", generateMatrixInput);

// Attach event listeners
var submitBtnSolve = document.getElementById("submitBtnSolve");
submitBtnSolve.addEventListener("click", SolveHandleButtonClick);
