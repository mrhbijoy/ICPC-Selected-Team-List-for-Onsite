// Store the data globally
let teamsData = [];

// Fetch and initialize data
async function initializeData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        teamsData = data.results;
        
        displayTeams(teamsData);
        updateStatistics();
        populateFilters();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Display teams in grid
function displayTeams(teams) {
    const teamsGrid = document.getElementById('teamsGrid');
    teamsGrid.innerHTML = '';

    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <h2>${team.teamName}</h2>
            <div class="institution">${team.institutionName}</div>
            <div class="coach">
                <strong>Coach:</strong> ${team.coachName}
                ${team.coachTShirtSize ? `(${team.coachTShirtSize})` : ''}
            </div>
            <div class="participants">
                ${createParticipantHTML(team.participantOneName, team.participantOneTShirtSize, 1)}
                ${createParticipantHTML(team.participantTwoName, team.participantTwoTShirtSize, 2)}
                ${createParticipantHTML(team.participantThreeName, team.participantThreeTShirtSize, 3)}
            </div>
            <div class="payment-status ${team.is_paid ? 'paid' : 'not-paid'}">
                ${team.is_paid ? 'Paid' : 'Not Paid'}
            </div>
        `;

        teamCard.addEventListener('click', () => showTeamDetails(team));
        teamsGrid.appendChild(teamCard);
    });
}

function createParticipantHTML(name, size, num) {
    if (!name) return '';
    return `
        <div class="participant">
            <span>Participant ${num}: ${name}</span>
            ${size ? `<span class="size">${size}</span>` : ''}
        </div>
    `;
}

// Search and Filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const institutionFilter = document.getElementById('institutionFilter');
    const paidFilter = document.getElementById('paidFilter');

    const filterTeams = () => {
        let filtered = teamsData.filter(team => {
            const searchTerm = searchInput.value.toLowerCase();
            const matchesSearch = team.teamName.toLowerCase().includes(searchTerm) ||
                                team.institutionName.toLowerCase().includes(searchTerm);
            
            const matchesInstitution = !institutionFilter.value || 
                                     team.institutionName === institutionFilter.value;
            
            const matchesPaid = paidFilter.value === '' || 
                               team.is_paid.toString() === paidFilter.value;

            return matchesSearch && matchesInstitution && matchesPaid;
        });

        displayTeams(filtered);
    };

    searchInput.addEventListener('input', filterTeams);
    institutionFilter.addEventListener('change', filterTeams);
    paidFilter.addEventListener('change', filterTeams);
}

// Statistics
function updateStatistics() {
    document.getElementById('totalTeams').textContent = teamsData.length;
    
    const institutions = new Set(teamsData.map(team => team.institutionName));
    document.getElementById('totalInstitutions').textContent = institutions.size;
    
    // You can add more statistics here
}

// Modal functionality
function showTeamDetails(team) {
    const modal = document.getElementById('teamModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>${team.teamName}</h2>
        <h3>${team.institutionName}</h3>
        <div class="team-details">
            <!-- Add more detailed information here -->
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal when clicking the close button or outside
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('teamModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('teamModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupSearchAndFilter();
});

// Scroll to teams section
function scrollToTeams() {
    document.getElementById('teamsGrid').scrollIntoView({ behavior: 'smooth' });
}