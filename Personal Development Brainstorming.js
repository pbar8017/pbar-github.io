// Get a reference to the grid container
const grid = document.getElementById("grid");

// Function to create the 9x9 grid
function createGrid(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
        // Create a grid cell
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");

        // Add a textarea inside each cell
        const textarea = document.createElement("textarea");
        textarea.placeholder = "Type here...";
        cell.appendChild(textarea);

        // Append the cell to the grid
        grid.appendChild(cell);
    }
}

// Initialize a 9x9 grid
createGrid(9, 9);
