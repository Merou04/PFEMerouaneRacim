document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const doorList = document.getElementById('doorList');
    const toggleButton = document.getElementById('toggleButton');
    const selectAllButton = document.getElementById('selectAllButton');
    const deselectAllButton = document.getElementById('deselectAllButton');
    const lights = document.querySelectorAll('.light');
    
    // State variables
    let doors = [];
    let selectedDoorIds = [];
    let currentState = 0;
    
    // Fetch doors from the database
    function fetchDoors() {
        fetch('get_doors.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    doors = data.doors;
                    renderDoorList();
                } else {
                    doorList.innerHTML = `<div class="door-error">Error: ${data.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching doors:', error);
                doorList.innerHTML = `<div class="door-error">Error connecting to server: ${error.message}</div>`;
            });
    }
    
    // Render the door list
    function renderDoorList() {
        if (doors.length === 0) {
            doorList.innerHTML = '<div class="door-empty">No doors available</div>';
            return;
        }
        
        let html = '';
        doors.forEach(door => {
            const isSelected = selectedDoorIds.includes(parseInt(door.id));
            html += `
                <div class="door-item ${isSelected ? 'selected' : ''}" data-id="${door.id}" data-state="${door.state}">
                    <input type="checkbox" id="door-${door.id}" ${isSelected ? 'checked' : ''}>
                    <div class="door-info">
                        <span class="door-name">${door.name}</span>
                        <span class="door-state">(${getStateName(door.state)})</span>
                    </div>
                </div>
            `;
        });
        doorList.innerHTML = html;
        
        // Add click event listeners
        document.querySelectorAll('.door-item').forEach(item => {
            item.addEventListener('click', function(e) {
                const doorId = parseInt(this.dataset.id);
                const checkbox = this.querySelector('input[type="checkbox"]');
                
                // Toggle selection
                if (selectedDoorIds.includes(doorId)) {
                    selectedDoorIds = selectedDoorIds.filter(id => id !== doorId);
                    this.classList.remove('selected');
                    checkbox.checked = false;
                } else {
                    selectedDoorIds.push(doorId);
                    this.classList.add('selected');
                    checkbox.checked = true;
                }
                
                updateUIState();
            });
        });
        
        updateUIState();
    }
    
    // Update UI based on selected doors
    function updateUIState() {
        // Enable/disable toggle button
        toggleButton.disabled = selectedDoorIds.length === 0;
        
        // Update lights to show common state if all selected doors have the same state
        if (selectedDoorIds.length > 0) {
            const selectedDoors = doors.filter(door => selectedDoorIds.includes(parseInt(door.id)));
            const firstState = selectedDoors[0].state;
            const allSameState = selectedDoors.every(door => parseInt(door.state) === parseInt(firstState));
            
            if (allSameState) {
                updateLights(parseInt(firstState));
                currentState = parseInt(firstState);
            } else {
                // If mixed states, turn off all lights
                updateLights(-1);
            }
        } else {
            // No doors selected, turn off all lights
            updateLights(-1);
        }
    }
    
    // Toggle door state for selected doors
    function toggleDoorState() {
        if (selectedDoorIds.length === 0) return;
        
        // Calculate next state (0 -> 1 -> 2 -> 3 -> 0)
        const nextState = (currentState + 1) % 4;
        
        // Update database
        fetch('update_state.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doorIds: selectedDoorIds,
                state: nextState
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update local data
                doors = doors.map(door => {
                    if (selectedDoorIds.includes(parseInt(door.id))) {
                        return {...door, state: nextState};
                    }
                    return door;
                });
                
                // Update UI
                currentState = nextState;
                updateLights(nextState);
                renderDoorList();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating state:', error);
            alert('Error connecting to server: ' + error.message);
        });
    }
    
    // Update lights based on state
    function updateLights(state) {
        // First, deactivate all lights
        lights.forEach(light => light.classList.remove('active'));
        
        // If valid state, activate the appropriate light
        if (state >= 0 && state <= 3) {
            lights[state].classList.add('active');
        }
    }
    
    // Get state name based on state number
    function getStateName(state) {
        const states = ['Open', 'Half Open', 'Out Only', 'Closed'];
        return states[state] || 'Unknown';
    }
    
    // Select all doors
    function selectAllDoors() {
        selectedDoorIds = doors.map(door => parseInt(door.id));
        renderDoorList();
    }
    
    // Deselect all doors
    function deselectAllDoors() {
        selectedDoorIds = [];
        renderDoorList();
    }
    
    // Event listeners
    toggleButton.addEventListener('click', toggleDoorState);
    selectAllButton.addEventListener('click', selectAllDoors);
    deselectAllButton.addEventListener('click', deselectAllDoors);
    
    // Initialize
    fetchDoors();
});