window.onload = function() {
    const tbody = document.getElementById('timeTableBody');
    const thead = tbody.previousElementSibling;

    // Listen for form submission
    document.getElementById('optionsForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear existing rows and headers from the table
        clearTable();

        const fromTime = parseInt(document.getElementById('from').value);
        const uptoTime = parseInt(document.getElementById('upto').value);
        const selectedDay = document.getElementById('floor').value;
        const selectedFloor = document.getElementById('floor_no').value;

        if (uptoTime <= fromTime) {
            alert("Upto time should be after From time.");
            return;
        }

        // Set the table headers for "Time" and the selected day
        setTableHeaders(selectedDay);

        // Populate the table rows based on user input
        populateTable(fromTime, uptoTime, selectedDay, selectedFloor);
    });

    function clearTable() {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        while (thead.firstChild) {
            thead.removeChild(thead.firstChild);
        }
    }

    function setTableHeaders(day) {
        const headerRow = thead.insertRow();

        const timeHeader = headerRow.insertCell(0);
        timeHeader.textContent = "Time";

        const dayHeader = headerRow.insertCell(1);
        dayHeader.textContent = day.charAt(0).toUpperCase() + day.slice(1);
    }

    function populateTable(fromTime, uptoTime, selectedDay, selectedFloor) {
        const url = `getData.php?fromTime=${fromTime}&uptoTime=${uptoTime}&day=${selectedDay}&floor_no=${selectedFloor}`;
        console.log("Fetching URL:", url);

        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = fromTime; i < uptoTime; i++) {
                const row = tbody.insertRow();
                const timeCell = row.insertCell(0);
                let endHour = i + 1;
                timeCell.textContent = `${i % 12 || 12} ${i < 12 ? 'AM' : 'PM'} - ${endHour % 12 || 12} ${endHour < 12 ? 'AM' : 'PM'}`;

                const dayCell = row.insertCell(1);
                
                let roomNumbersForCurrentTime = data.filter(item => parseInt(item.start_time) === i).map(item => item.Room_Number);
    
                if (roomNumbersForCurrentTime.length > 0) {
                    dayCell.textContent = roomNumbersForCurrentTime.join(', ');
                } else {
                    dayCell.textContent = "No Rooms Available";
                }
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
    }
}
