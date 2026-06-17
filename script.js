/* ===================================
   DOM ELEMENTS
=================================== */

const subjectInput =
document.getElementById(
    "subjectInput"
);

const hoursInput =
document.getElementById(
    "hoursInput"
);

const addStudyBtn =
document.getElementById(
    "addStudyBtn"
);

const dailyGoalInput =
document.getElementById(
    "dailyGoal"
);

const saveGoalBtn =
document.getElementById(
    "saveGoalBtn"
);

const progressBar =
document.getElementById(
    "progressBar"
);

const studyContainer =
document.getElementById(
    "studyContainer"
);

const historyContainer =
document.getElementById(
    "historyContainer"
);

const calendarContainer =
document.getElementById(
    "calendarContainer"
);

const emptyState =
document.getElementById(
    "emptyState"
);

const totalSubjects =
document.getElementById(
    "totalSubjects"
);

const studyHours =
document.getElementById(
    "studyHours"
);

const studyStreak =
document.getElementById(
    "studyStreak"
);

const goalCompletion =
document.getElementById(
    "goalCompletion"
);

/* ===================================
   STORAGE
=================================== */

let sessions =
JSON.parse(
    localStorage.getItem(
        "studySessions"
    )
) || [];

let goal =
Number(
    localStorage.getItem(
        "studyGoal"
    )
) || 4;

let activityDates =
JSON.parse(
    localStorage.getItem(
        "activityDates"
    )
) || [];

/* ===================================
   SAVE DATA
=================================== */

function saveData()
{
    localStorage.setItem(
        "studySessions",
        JSON.stringify(
            sessions
        )
    );

    localStorage.setItem(
        "studyGoal",
        goal
    );

    localStorage.setItem(
        "activityDates",
        JSON.stringify(
            activityDates
        )
    );
}

/* ===================================
   SAVE GOAL
=================================== */

saveGoalBtn.addEventListener(
    "click",
    () =>
    {
        const value =
        Number(
            dailyGoalInput.value
        );

        if(
            value <= 0
        )
        {
            alert(
                "Enter a valid goal."
            );

            return;
        }

        goal = value;

        saveData();

        updateDashboard();

        alert(
            "Goal Saved Successfully!"
        );
    }
);

/* ===================================
   ADD SESSION
=================================== */

function addSession()
{
    const subject =
    subjectInput.value.trim();

    const hours =
    Number(
        hoursInput.value
    );

    if(
        !subject ||
        !hours
    )
    {
        alert(
            "Please fill all fields."
        );

        return;
    }

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const session = {

        id:
        Date.now(),

        subject,

        hours,

        date:
        new Date()
        .toLocaleString()
    };

    sessions.push(
        session
    );

    if(
        !activityDates.includes(
            today
        )
    )
    {
        activityDates.push(
            today
        );
    }

    saveData();

    renderSessions();

    renderHistory();

    renderHeatmap();

    updateDashboard();

    subjectInput.value = "";

    hoursInput.value = "";
}

addStudyBtn.addEventListener(
    "click",
    addSession
);

/* ===================================
   DELETE SESSION
=================================== */

function deleteSession(id)
{
    sessions =
    sessions.filter(
        session =>
        session.id !== id
    );

    saveData();

    renderSessions();

    renderHistory();

    updateDashboard();
}

/* ===================================
   DASHBOARD
=================================== */

function updateDashboard()
{
    const uniqueSubjects =
    [
        ...new Set(
            sessions.map(
                item =>
                item.subject
            )
        )
    ];

    totalSubjects.textContent =
    uniqueSubjects.length;

    const totalHours =
    sessions.reduce(
        (
            sum,
            item
        ) =>
        sum +
        item.hours,
        0
    );

    studyHours.textContent =
    totalHours;

    const completion =
    Math.min(
        (
            totalHours /
            goal
        ) * 100,
        100
    );

    goalCompletion.textContent =
    completion.toFixed(0)
    + "%";

    progressBar.style.width =
    completion + "%";

    calculateStreak();
}

/* ===================================
   STREAK
=================================== */

function calculateStreak()
{
    studyStreak.textContent =
    activityDates.length;
}

/* ===================================
   RENDER SESSIONS
=================================== */

function renderSessions()
{
    studyContainer.innerHTML =
    "";

    if(
        sessions.length === 0
    )
    {
        emptyState.style.display =
        "block";

        return;
    }

    emptyState.style.display =
    "none";

    sessions
    .slice()
    .reverse()
    .forEach(
    session =>
    {
        const card =
        document.createElement(
            "div"
        );

        card.className =
        "study-card";

        card.innerHTML =

        `
        <h3>
            ${session.subject}
        </h3>

        <p>
            ⏰ ${session.hours} hour(s)
        </p>

        <p>
            📅 ${session.date}
        </p>

        <button
        onclick="
        deleteSession(
        ${session.id}
        )"
        style="
        margin-top:10px;
        ">
            Delete
        </button>
        `;

        studyContainer.appendChild(
            card
        );
    });
}

/* ===================================
   HISTORY
=================================== */

function renderHistory()
{
    historyContainer.innerHTML =
    "";

    sessions
    .slice()
    .reverse()
    .forEach(
    session =>
    {
        const card =
        document.createElement(
            "div"
        );

        card.className =
        "history-card";

        card.innerHTML =

        `
        <h4>
            ${session.subject}
        </h4>

        <p>
            ${session.hours}
            Hour(s)
        </p>

        <small>
            ${session.date}
        </small>
        `;

        historyContainer.appendChild(
            card
        );
    });
}

/* ===================================
   HEATMAP
=================================== */

function renderHeatmap()
{
    calendarContainer.innerHTML =
    "";

    for(
        let i = 0;
        i < 70;
        i++
    )
    {
        const box =
        document.createElement(
            "div"
        );

        box.classList.add(
            "day"
        );

        if(
            i <
            activityDates.length
        )
        {
            if(i % 3 === 0)
            {
                box.classList.add(
                    "high-day"
                );
            }
            else
            {
                box.classList.add(
                    "active-day"
                );
            }
        }

        calendarContainer
        .appendChild(
            box
        );
    }
}

/* ===================================
   INITIAL LOAD
=================================== */

dailyGoalInput.value =
goal;

renderSessions();

renderHistory();

renderHeatmap();

updateDashboard();

/* ===================================
   GLOBAL FUNCTIONS
=================================== */

window.deleteSession =
deleteSession;