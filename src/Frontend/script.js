async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/ingresar', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Configuración del juego recibida:', data);
                displayGameBoard(data.board, data.size); // Pasar la configuración al displayGameBoard
            } else {
                console.error('Error al cargar el archivo o al procesar la configuración.');
                alert('Error al cargar el archivo o al procesar la configuración.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al intentar cargar el archivo.');
        }
    }
}

function displayGameBoard(boardData, size) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = ''; // Limpiar cualquier tablero anterior
    gameBoardDiv.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    gameBoardDiv.style.gridTemplateRows = `repeat(${size}, 50px)`;

    boardData.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            if (cellValue === 'bomb') {
                // No mostrar la bomba inicialmente
            } else if (typeof cellValue === 'number' && cellValue > 0) {
                // No mostrar el número inicialmente
            }

            cell.addEventListener('click', () => revealCell(cell, boardData));
            gameBoardDiv.appendChild(cell);

            boardData.forEach(row => {
                row.forEach(cellValue => {
                    if (cellValue !== 'bomb') {
                        totalNonBombCells++;
                    }
                });
            });
            gameOver = false;
            revealedCellsCount = 0;
        });
    });

    document.querySelector('.container').appendChild(gameBoardDiv);
    document.querySelector('.upload-area').classList.add('hidden');
    document.querySelector('.bomb-container').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
}

function revealCell(cell, boardData) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellValue = boardData[row][col];

    cell.classList.add('revealed');
    if (cellValue === 'bomb') {
        cell.textContent = '💣';
        cell.classList.add('bomb');
        alert('¡Bomba! Fin del juego.');
        // Aquí podrías implementar la lógica para mostrar todas las bombas
    } else if (typeof cellValue === 'number' && cellValue > 0) {
        cell.textContent = cellValue;
    } else if (cellValue === 0) {
        // Aquí podrías implementar la lógica para revelar celdas vacías adyacentes
        cell.textContent = '';
    }
    cell.removeEventListener('click', revealCell); // Evitar clicks repetidos
}