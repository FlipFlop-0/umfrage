// Umfragedaten aus dem LocalStorage laden oder initialisieren
let surveyData = JSON.parse(localStorage.getItem('surveyData')) || [];

// Umfrage absenden
document.getElementById('surveyForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const stufe = document.getElementById('stufe').value;
    const geschlecht = document.getElementById('geschlecht').value;
    const partei = document.getElementById('partei').value;

    // Daten speichern
    surveyData.push({ stufe, geschlecht, partei });
    localStorage.setItem('surveyData', JSON.stringify(surveyData));

    // Bestätigung anzeigen
    document.getElementById('confirmation').classList.remove('hidden');
    document.getElementById('surveyForm').classList.add('hidden');
});

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'password') {
        // Login erfolgreich, Weiterleitung zum Dashboard
        window.location.href = 'admin_dashboard.html';
    } else {
        document.getElementById('errorMessage').classList.remove('hidden');
    }
});

// Farbzuordnung für die Parteien
const colorMapping = {
    'SPD': '#E3000F',
    'CDU': '#000000',
    'FDP': '#FFEF00',
    'AFD': '#0489DB',
    'DIE_LINKE': '#E3000F',
    'GRUENEN': '#1AA037'
};

// Diagramm aktualisieren
function updateChart() {
    const filterStufe = document.getElementById('filterStufe').value;
    const filterGeschlecht = document.getElementById('filterGeschlecht').value;

    // Filtern der Umfragedaten basierend auf Stufe und Geschlecht
    const filteredData = surveyData.filter(item => {
        const matchesStufe = (filterStufe === 'all') || (item.stufe === filterStufe);
        const matchesGeschlecht = (filterGeschlecht === 'all') || (item.geschlecht === filterGeschlecht);
        return matchesStufe && matchesGeschlecht;
    });

    // Zählen der Stimmen für jede Partei
    const partyVotes = filteredData.reduce((acc, item) => {
        acc[item.partei] = (acc[item.partei] || 0) + 1;
        return acc;
    }, {});

    // Labels und Stimmen für das Diagramm
    const labels = Object.keys(partyVotes);
    const votes = Object.values(partyVotes);

    // Farben basierend auf den Labels setzen
    const backgroundColors = labels.map(label => colorMapping[label] || '#CCCCCC'); // Default color if not found

    // Canvas-Element für das Diagramm
    const ctx = document.getElementById('surveyChart').getContext('2d');

    // Falls ein Diagramm bereits existiert, wird es zerstört, bevor ein neues erstellt wird
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Erstellen des Diagramms
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wähleranteil',
                data: votes,
                backgroundColor: backgroundColors,
            }]
        }
    });
}

// Funktion zum Zurücksetzen der Umfragedaten
function resetSurveyData() {
    localStorage.removeItem('surveyData');
    surveyData = [];
    updateChart();
}

// Beim Laden der Seite das Diagramm initialisieren
window.onload = updateChart;