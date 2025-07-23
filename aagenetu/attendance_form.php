<?php
// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli("localhost", "root", "root", "db01");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $PersonID = $_POST['PersonID'];
    $PersonName = $_POST['PersonName'];
    $PerSonCardNo = $_POST['PerSonCardNo'];
    $AttendanceDateTime = $_POST['AttendanceDateTime'];
    $AttendanceState = $_POST['AttendanceState'];
    $AttendanceMethod = $_POST['AttendanceMethod'];
    $DeviceIPAddress = $_POST['DeviceIPAddress'];
    $DeviceName = $_POST['DeviceName'];
    $SnapshotsPath = $_POST['SnapshotsPath'];
    $Handler = $_POST['Handler'];
    $AttendanceUtcTime = $_POST['AttendanceUtcTime'];
    $Remarks = $_POST['Remarks'];

    $sql = "INSERT INTO attendancerecordinfo (
        PersonID, PersonName, PerSonCardNo, AttendanceDateTime,
        AttendanceState, AttendanceMethod, DeviceIPAddress,
        DeviceName, SnapshotsPath, Handler, AttendanceUtcTime, Remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssiiissssis", $PersonID, $PersonName, $PerSonCardNo, $AttendanceDateTime,
        $AttendanceState, $AttendanceMethod, $DeviceIPAddress, $DeviceName,
        $SnapshotsPath, $Handler, $AttendanceUtcTime, $Remarks);

    if ($stmt->execute()) {
        echo "<script>alert('Record added successfully!');</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
    }

    $stmt->close();
    $conn->close();
}

// Get student data from database
$students = [];
$conn = new mysqli("localhost", "root", "root", "db01");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT idetu, CONCAT(prenom, ' ', nom) as full_name, numcarteetu FROM etudiant";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $students[] = [
            'id' => $row['idetu'],
            'name' => $row['full_name'],
            'card' => $row['numcarteetu']
        ];
    }
}
$conn->close();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Attendance Record Generator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .form-group { margin-bottom: 10px; }
        label { display: inline-block; width: 150px; }
        select, input { width: 250px; padding: 5px; }
        button, input[type="submit"] { padding: 8px 15px; margin-right: 10px; cursor: pointer; }
    </style>
</head>
<body>
    <h2>Generate and Add Attendance Record</h2>
    <form method="POST">
        <div class="form-group">
            <label for="PersonID">Student:</label>
            <select name="PersonID" id="PersonID" onchange="updateStudentInfo()" required>
                <option value="">Select a student</option>
                <?php foreach($students as $student): ?>
                <option value="<?= htmlspecialchars($student['id']) ?>" 
                        data-name="<?= htmlspecialchars($student['name']) ?>"
                        data-card="<?= htmlspecialchars($student['card']) ?>">
                    <?= htmlspecialchars($student['id'] . ' - ' . $student['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label>Name:</label>
            <input type="text" name="PersonName" id="PersonName" readonly>
        </div>
        <div class="form-group">
            <label>Card No:</label>
            <input type="text" name="PerSonCardNo" id="PerSonCardNo" readonly>
        </div>
        <div class="form-group">
            <label>Attendance Date:</label>
            <input type="date" id="AttendanceDate" onchange="updateTimestamp()">
        </div>
        <div class="form-group">
            <label>Attendance Time:</label>
            <input type="time" id="AttendanceTime" min="07:00" max="15:00" onchange="updateTimestamp()">
        </div>
        <div class="form-group">
            <label>Attendance Timestamp:</label>
            <input type="text" name="AttendanceDateTime" id="AttendanceDateTime" readonly required>
        </div>
        <div class="form-group">
            <label>UTC Timestamp:</label>
            <input type="text" name="AttendanceUtcTime" id="AttendanceUtcTime" readonly required>
        </div>
        <div class="form-group">
            <label>State:</label>
            <select name="AttendanceState" id="AttendanceState" required>
                <option value="0">0 - Present</option>
                <option value="1">1 - Late</option>
                <option value="2">2 - Absent</option>
            </select>
        </div>
        <div class="form-group">
            <label>Method:</label>
            <select name="AttendanceMethod" id="AttendanceMethod" required>
                <option value="0">0 - Card</option>
                <option value="1">1 - Face</option>
                <option value="2">2 - Fingerprint</option>
            </select>
        </div>
        <div class="form-group">
            <label>Device IP:</label>
            <input type="text" name="DeviceIPAddress" id="DeviceIPAddress">
        </div>
        <div class="form-group">
            <label>Device Name:</label>
            <input type="text" name="DeviceName" id="DeviceName">
        </div>
        <div class="form-group">
            <label>Snapshots Path:</label>
            <input type="text" name="SnapshotsPath" id="SnapshotsPath">
        </div>
        <div class="form-group">
            <label>Handler:</label>
            <input type="text" name="Handler" id="Handler">
        </div>
        <div class="form-group">
            <label>Remarks:</label>
            <input type="text" name="Remarks" id="Remarks">
        </div>
        <div class="form-group" style="margin-top: 20px;">
            <button type="button" onclick="generateRandom()">Generate Random Record</button>
            <input type="submit" value="Add to Database">
        </div>
    </form>

    <script>
        // Set today's date by default
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date();
            document.getElementById('AttendanceDate').value = today.toISOString().split('T')[0];
            document.getElementById('AttendanceTime').value = '08:00';
            updateTimestamp();
        });

        function updateStudentInfo() {
            const select = document.getElementById('PersonID');
            if (select.selectedIndex > 0) {
                const option = select.options[select.selectedIndex];
                document.getElementById('PersonName').value = option.getAttribute('data-name');
                document.getElementById('PerSonCardNo').value = option.getAttribute('data-card');
            } else {
                document.getElementById('PersonName').value = '';
                document.getElementById('PerSonCardNo').value = '';
            }
        }

        function updateTimestamp() {
            const dateInput = document.getElementById('AttendanceDate').value;
            const timeInput = document.getElementById('AttendanceTime').value;
            
            if (dateInput && timeInput) {
                // Create date with exact time entered by user
                const localDate = new Date(`${dateInput}T${timeInput}:00`);
                const timestamp = localDate.getTime();
                // UTC timestamp in ms
                const utcTimestamp = timestamp - (localDate.getTimezoneOffset() * 60 * 1000);
                // Use the timestamp without modification
                document.getElementById('AttendanceDateTime').value = timestamp;
                document.getElementById('AttendanceUtcTime').value = utcTimestamp;
            }
        }

        function generateRandom() {
            // Get random student
            const studentSelect = document.getElementById('PersonID');
            const studentOptions = studentSelect.options;
            const randomIndex = Math.floor(Math.random() * (studentOptions.length - 1)) + 1;
            studentSelect.selectedIndex = randomIndex;
            updateStudentInfo();

            // Generate random time between 7:00 and 15:00
            const hours = Math.floor(Math.random() * 8) + 7;
            const minutes = Math.floor(Math.random() * 60);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            // Set a random date within the last 7 days
            const today = new Date();
            const daysBack = Math.floor(Math.random() * 7);
            const randomDate = new Date(today);
            randomDate.setDate(today.getDate() - daysBack);
            const dateString = randomDate.toISOString().split('T')[0];

            document.getElementById('AttendanceDate').value = dateString;
            document.getElementById('AttendanceTime').value = timeString;
            updateTimestamp();

            document.getElementById('AttendanceState').value = Math.floor(Math.random() * 3);
            document.getElementById('AttendanceMethod').value = Math.floor(Math.random() * 3);
            document.getElementById('DeviceIPAddress').value = "192.168.1." + Math.floor(Math.random() * 255);
            document.getElementById('DeviceName').value = "Scanner " + Math.floor(Math.random() * 5 + 1);
            const randomId = Math.floor(Math.random() * 10000);
            document.getElementById('SnapshotsPath').value = "/snapshots/img_" + randomId + ".jpg";
            document.getElementById('Handler').value = "System";
            document.getElementById('Remarks').value = "Generated record ";
        }
    </script>
</body>
</html>