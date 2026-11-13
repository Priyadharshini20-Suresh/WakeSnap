/* =====================================================
                    WAKE SNAP
        SMART PICTURE / OBJECT ALARM SYSTEM
===================================================== */


/* =====================================================
                    DATA
===================================================== */

let alarms =
    JSON.parse(
        localStorage.getItem("wakeSnapAlarms")
    ) || [];

let reminders =
    JSON.parse(
        localStorage.getItem("wakeSnapReminders")
    ) || [];

let history =
    JSON.parse(
        localStorage.getItem("wakeSnapHistory")
    ) || [];

let currentUser =
    JSON.parse(
        localStorage.getItem("wakeSnapUser")
    ) || null;


/* Currently ringing alarm */

let ringingAlarm = null;


/* Camera */

let cameraStream = null;


/* Audio */

let audioContext = null;
let soundInterval = null;


/* Object detection */

let objectDetectionModel = null;
let objectModelPromise = null;


/* =====================================================
                    SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "wakeSnapAlarms",
        JSON.stringify(alarms)
    );

    localStorage.setItem(
        "wakeSnapReminders",
        JSON.stringify(reminders)
    );

    localStorage.setItem(
        "wakeSnapHistory",
        JSON.stringify(history)
    );
}


/* =====================================================
                    TOAST
===================================================== */

function toast(message) {

    const box =
        document.getElementById("toast");

    if (!box) return;

    box.innerText = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);
}


/* =====================================================
                LOGIN / REGISTER
===================================================== */

function showLogin() {

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

    document
        .getElementById("registerForm")
        .classList.add("hidden");

    const tabs =
        document.querySelectorAll(".tab");

    if (tabs[0]) {
        tabs[0].classList.add("active");
    }

    if (tabs[1]) {
        tabs[1].classList.remove("active");
    }
}


function showRegister() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("registerForm")
        .classList.remove("hidden");

    const tabs =
        document.querySelectorAll(".tab");

    if (tabs[0]) {
        tabs[0].classList.remove("active");
    }

    if (tabs[1]) {
        tabs[1].classList.add("active");
    }
}


/* =====================================================
                    LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            if (!email) {

                toast("Please enter your email.");

                return;
            }

            currentUser = {

                name:
                    email.split("@")[0],

                email:
                    email

            };

            localStorage.setItem(
                "wakeSnapUser",
                JSON.stringify(currentUser)
            );

            openApp();

            toast("Welcome back 👋");

        }
    );
}


/* =====================================================
                    REGISTER
===================================================== */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const name =
                document
                    .getElementById("regName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("regEmail")
                    .value
                    .trim();

            if (!name || !email) {

                toast(
                    "Please fill all details."
                );

                return;
            }

            currentUser = {

                name:
                    name,

                email:
                    email

            };

            localStorage.setItem(
                "wakeSnapUser",
                JSON.stringify(currentUser)
            );

            openApp();

            toast("Account created ✨");

        }
    );
}


/* =====================================================
                    OPEN APP
===================================================== */

function openApp() {

    const authPage =
        document.getElementById("authPage");

    const app =
        document.getElementById("app");

    if (authPage) {

        authPage.classList.add("hidden");

    }

    if (app) {

        app.classList.remove("hidden");

    }

    updateUser();

    renderAll();
}


/* =====================================================
                    USER
===================================================== */

function updateUser() {

    if (!currentUser) return;

    const name =
        currentUser.name || "User";

    const initials =
        name.substring(0, 2).toUpperCase();

    const username =
        document.getElementById("username");

    const avatar =
        document.getElementById("avatar");

    const userCircle =
        document.getElementById("userCircle");

    if (username) {

        username.innerText =
            name;

    }

    if (avatar) {

        avatar.innerText =
            initials;

    }

    if (userCircle) {

        userCircle.innerText =
            initials;

    }
}


/* =====================================================
                    LOGOUT
===================================================== */

function logout() {

    stopAlarmSound();

    closeCamera();

    ringingAlarm = null;

    localStorage.removeItem(
        "wakeSnapUser"
    );

    currentUser = null;

    const app =
        document.getElementById("app");

    const authPage =
        document.getElementById("authPage");

    if (app) {

        app.classList.add("hidden");

    }

    if (authPage) {

        authPage.classList.remove("hidden");

    }

    toast("Logged out");
}


/* =====================================================
                PAGE NAVIGATION
===================================================== */

function showPage(
    pageId,
    button = null
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const titles = {

        dashboard:
            "Good Morning 👋",

        alarms:
            "My Alarms",

        setAlarm:
            "Set an Alarm",

        reminders:
            "Reminders",

        details:
            "Alarm Status",

        suggestions:
            "Smart Suggestions 💡",

        history:
            "History & Statistics"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    if (pageTitle) {

        pageTitle.innerText =
            titles[pageId] || "WakeSnap";

    }

    renderAll();
}


/* =====================================================
                    CLOCK
===================================================== */

function updateClock() {

    const now =
        new Date();

    const clock =
        document.getElementById("clock");

    const phoneTime =
        document.getElementById("phoneTime");

    if (clock) {

        clock.innerText =
            now.toLocaleTimeString();

    }

    if (phoneTime) {

        phoneTime.innerText =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }
}

setInterval(
    updateClock,
    1000
);

updateClock();


/* =====================================================
                    SELECT DAYS
===================================================== */

document
    .querySelectorAll(".days button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                this.classList.toggle(
                    "selected"
                );

            }
        );

    });


/* =====================================================
                    FORMAT TIME
===================================================== */

function formatTime(time) {

    if (!time) {

        return "--:--";

    }

    const parts =
        time.split(":");

    let hour =
        parseInt(parts[0]);

    const minute =
        parts[1];

    const ampm =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return (
        hour +
        ":" +
        minute +
        " " +
        ampm
    );
}


/* =====================================================
                    TIME INPUT
===================================================== */

const alarmTimeInput =
    document.getElementById(
        "alarmTime"
    );

if (alarmTimeInput) {

    alarmTimeInput.addEventListener(
        "input",
        function() {

            const timeText =
                document.getElementById(
                    "timeText"
                );

            if (timeText) {

                timeText.innerText =
                    "Wake me at " +
                    formatTime(
                        this.value
                    );

            }

        }
    );
}


/* =====================================================
                PICTURE PREVIEW
===================================================== */

const alarmPicture =
    document.getElementById(
        "alarmPicture"
    );

if (alarmPicture) {

    alarmPicture.addEventListener(
        "change",
        function() {

            const file =
                this.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function(e) {

                    const preview =
                        document.getElementById(
                            "picturePreview"
                        );

                    if (preview) {

                        preview.innerHTML = `

                            <img
                                src="${e.target.result}"
                                alt="Target Picture">

                        `;

                    }

                };

            reader.readAsDataURL(file);

        }
    );
}


/* =====================================================
                    ADD ALARM
===================================================== */

const alarmForm =
    document.getElementById(
        "alarmForm"
    );

if (alarmForm) {

    alarmForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const file =
                document
                    .getElementById(
                        "alarmPicture"
                    )
                    .files[0];

            if (!file) {

                toast(
                    "Please select a target picture 📸"
                );

                return;
            }


            const days = [];

            document
                .querySelectorAll(
                    ".days button.selected"
                )
                .forEach(button => {

                    days.push(
                        button.dataset.day
                    );

                });


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const alarm = {

                        id:
                            Date.now(),

                        time:
                            document
                                .getElementById(
                                    "alarmTime"
                                )
                                .value,

                        name:
                            document
                                .getElementById(
                                    "alarmName"
                                )
                                .value
                            || "Picture Alarm",

                        sound:
                            document
                                .getElementById(
                                    "alarmSound"
                                )
                                .value,

                        days:
                            days,

                        label:
                            document
                                .getElementById(
                                    "alarmLabel"
                                )
                                .value
                            || "General",

                        snooze:
                            document
                                .getElementById(
                                    "snooze"
                                )
                                .value,

                        picture:
                            event.target.result,

                        /*
                         * Object classes are detected
                         * automatically when alarm rings.
                         */

                        objectClasses: [],

                        active:
                            true,

                        created:
                            new Date()
                                .toISOString()

                    };


                    alarms.push(
                        alarm
                    );

                    saveData();


                    alarmForm.reset();


                    document
                        .querySelectorAll(
                            ".days button"
                        )
                        .forEach(button => {

                            button.classList.remove(
                                "selected"
                            );

                        });


                    const preview =
                        document.getElementById(
                            "picturePreview"
                        );

                    if (preview) {

                        preview.innerHTML = `

                            <div>📷</div>

                            <p>
                                No picture selected
                            </p>

                        `;

                    }


                    toast(
                        "Picture alarm scheduled successfully 📸"
                    );


                    showPage(
                        "alarms"
                    );

                };


            reader.readAsDataURL(file);

        }
    );
}


/* =====================================================
                RENDER ALARMS
===================================================== */

function renderAlarms(
    filter = "all"
) {

    const list =
        document.getElementById(
            "alarmList"
        );

    if (!list) return;


    let data =
        alarms.filter(alarm => {

            if (
                filter === "active"
            ) {

                return alarm.active;

            }

            if (
                filter === "off"
            ) {

                return !alarm.active;

            }

            return true;

        });


    if (data.length === 0) {

        list.innerHTML = `

            <div class="detail-card">

                <h3>
                    ⏰ No alarms yet
                </h3>

                <p style="
                    margin:10px 0;
                    color:#738079
                ">

                    Create your first
                    picture alarm.

                </p>

                <button
                    class="primary"
                    onclick="
                        showPage('setAlarm')
                    ">

                    Set an Alarm

                </button>

            </div>

        `;

        return;
    }


    data.sort(
        (a, b) =>
            a.time.localeCompare(
                b.time
            )
    );


    list.innerHTML =
        data.map(alarm => {

            return `

                <div class="alarm-item">

                    <img
                        class="alarm-thumb"
                        src="${alarm.picture}"
                        alt="Alarm Picture">

                    <div class="alarm-time">

                        ${formatTime(
                            alarm.time
                        )}

                    </div>


                    <div class="alarm-info">

                        <b>
                            ${alarm.name}
                        </b>

                        <small>

                            ${alarm.label}

                            •

                            ${
                                alarm.days &&
                                alarm.days.length
                                ? alarm.days.join(" · ")
                                : "One time"
                            }

                            •

                            📸 Object Challenge

                        </small>

                    </div>


                    <span class="badge">

                        ${
                            alarm.active
                            ? "Active"
                            : "Off"
                        }

                    </span>


                    <button
                        class="
                            toggle
                            ${alarm.active ? "on" : ""}
                        "
                        onclick="
                            toggleAlarm(
                                ${alarm.id}
                            )
                        ">
                    </button>


                    <button
                        class="text-btn"
                        onclick="
                            deleteAlarm(
                                ${alarm.id}
                            )
                        ">

                        Delete

                    </button>

                </div>

            `;

        }).join("");
}


/* =====================================================
                TOGGLE ALARM
===================================================== */

function toggleAlarm(id) {

    const alarm =
        alarms.find(
            a => a.id === id
        );

    if (!alarm) return;

    alarm.active =
        !alarm.active;

    saveData();

    renderAll();

    toast(
        alarm.active
            ? "Alarm enabled ✓"
            : "Alarm turned off"
    );
}


/* =====================================================
                DELETE ALARM
===================================================== */

function deleteAlarm(id) {

    alarms =
        alarms.filter(
            alarm =>
                alarm.id !== id
        );

    saveData();

    renderAll();

    toast(
        "Alarm deleted"
    );
}


/* =====================================================
                    FILTER
===================================================== */

function filterAlarms(
    type,
    button
) {

    document
        .querySelectorAll(".filter")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    renderAlarms(type);
}


/* =====================================================
                    REMINDERS
===================================================== */

const reminderForm =
    document.getElementById(
        "reminderForm"
    );

if (reminderForm) {

    reminderForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const reminder = {

                id:
                    Date.now(),

                title:
                    document
                        .getElementById(
                            "remTitle"
                        )
                        .value,

                date:
                    document
                        .getElementById(
                            "remDate"
                        )
                        .value,

                time:
                    document
                        .getElementById(
                            "remTime"
                        )
                        .value,

                category:
                    document
                        .getElementById(
                            "remCategory"
                        )
                        .value

            };


            reminders.push(
                reminder
            );

            saveData();

            this.reset();

            toast(
                "Reminder added 🔔"
            );

            renderAll();

        }
    );
}


/* =====================================================
                DISPLAY REMINDERS
===================================================== */

function renderReminders() {

    const list =
        document.getElementById(
            "reminderList"
        );

    if (!list) return;


    if (reminders.length === 0) {

        list.innerHTML = `

            <div class="detail-card">

                🔔 No reminders yet.

            </div>

        `;

        return;
    }


    list.innerHTML =
        reminders
            .map(reminder => {

                return `

                    <div class="reminder-item">

                        <b>
                            ${reminder.title}
                        </b>

                        <div class="reminder-meta">

                            ${reminder.category}

                            •

                            ${reminder.date}

                            •

                            ${formatTime(
                                reminder.time
                            )}

                        </div>


                        <button
                            class="text-btn"
                            onclick="
                                deleteReminder(
                                    ${reminder.id}
                                )
                            ">

                            Remove

                        </button>

                    </div>

                `;

            })
            .join("");
}


/* =====================================================
                DELETE REMINDER
===================================================== */

function deleteReminder(id) {

    reminders =
        reminders.filter(
            reminder =>
                reminder.id !== id
        );

    saveData();

    renderAll();

    toast(
        "Reminder removed"
    );
}


/* =====================================================
                    DASHBOARD
===================================================== */

function renderDashboard() {

    const activeAlarms =
        alarms.filter(
            a => a.active
        );


    const alarmCount =
        document.getElementById(
            "alarmCount"
        );

    const reminderCount =
        document.getElementById(
            "reminderCount"
        );

    const completedCount =
        document.getElementById(
            "completedCount"
        );

    const pictureCount =
        document.getElementById(
            "pictureCount"
        );


    if (alarmCount) {

        alarmCount.innerText =
            activeAlarms.length;

    }

    if (reminderCount) {

        reminderCount.innerText =
            reminders.length;

    }

    if (completedCount) {

        completedCount.innerText =
            history.length;

    }

    if (pictureCount) {

        pictureCount.innerText =
            alarms.filter(
                a => a.picture
            ).length;

    }


    const sorted =
        [...activeAlarms].sort(
            (a, b) =>
                a.time.localeCompare(
                    b.time
                )
        );


    const next =
        sorted[0];


    const phoneAlarm =
        document.getElementById(
            "phoneAlarm"
        );


    if (phoneAlarm) {

        phoneAlarm.innerText =
            next
                ? formatTime(next.time)
                    + " • "
                    + next.name
                : "No Alarm";

    }


    const container =
        document.getElementById(
            "dashboardAlarms"
        );

    if (!container) return;


    if (!activeAlarms.length) {

        container.innerHTML = `

            <div class="detail-card">

                No upcoming alarms.

                <button
                    class="text-btn"
                    onclick="
                        showPage('setAlarm')
                    ">

                    Create one →

                </button>

            </div>

        `;

        return;
    }


    container.innerHTML =
        sorted
            .slice(0, 3)
            .map(alarm => {

                return `

                    <div class="alarm-item">

                        <img
                            class="alarm-thumb"
                            src="${alarm.picture}"
                            alt="Picture">

                        <div class="alarm-time">

                            ${formatTime(
                                alarm.time
                            )}

                        </div>


                        <div class="alarm-info">

                            <b>
                                ${alarm.name}
                            </b>

                            <small>
                                📸 Show matching object
                                to stop alarm
                            </small>

                        </div>


                        <span class="badge">
                            Active
                        </span>

                    </div>

                `;

            })
            .join("");
}


/* =====================================================
                    DETAILS
===================================================== */

function renderDetails() {

    const box =
        document.getElementById(
            "detailsBox"
        );

    if (!box) return;


    const active =
        alarms
            .filter(
                a => a.active
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(
                        b.time
                    )
            );


    if (!active.length) {

        box.innerHTML = `

            <div class="status">

                <div class="status-icon">
                    🌙
                </div>

                <div>

                    <h2>
                        No Active Alarm
                    </h2>

                    <p>
                        Set an alarm to see
                        its status.
                    </p>

                </div>

            </div>

            <br>

            <button
                class="primary"
                onclick="
                    showPage('setAlarm')
                ">

                Set an Alarm

            </button>

        `;

        return;
    }


    const alarm =
        active[0];


    box.innerHTML = `

        <div class="status">

            <div class="status-icon">
                📸
            </div>

            <div>

                <h2>
                    ${formatTime(
                        alarm.time
                    )}
                </h2>

                <p>

                    ${alarm.name}

                    •

                    Object Challenge

                </p>

            </div>

            <span class="badge">
                ACTIVE
            </span>

        </div>


        <div class="progress">
            <div></div>
        </div>


        <small style="
            color:#738079
        ">

            Next scheduled
            picture challenge

        </small>


        <div style="
            margin-top:20px;
            text-align:center;
        ">

            <img
                src="${alarm.picture}"
                style="
                    width:220px;
                    height:160px;
                    object-fit:contain;
                    border-radius:15px;
                    background:#f1f4f0;
                ">

        </div>


        <div class="detail-grid">

            <div class="detail-box">

                <small>
                    Repeat
                </small>

                <b>

                    ${
                        alarm.days &&
                        alarm.days.length
                        ? alarm.days.join(", ")
                        : "One time"
                    }

                </b>

            </div>


            <div class="detail-box">

                <small>
                    Sound
                </small>

                <b>
                    ${alarm.sound}
                </b>

            </div>


            <div class="detail-box">

                <small>
                    Stop Method
                </small>

                <b>
                    📸 Object Match
                </b>

            </div>

        </div>


        <div class="form-buttons">

            <button
                class="secondary"
                onclick="
                    toggleAlarm(
                        ${alarm.id}
                    )
                ">

                Turn Off

            </button>

        </div>

    `;
}


/* =====================================================
                SMART SUGGESTIONS
===================================================== */

function useTime(time) {

    const input =
        document.getElementById(
            "alarmTime"
        );

    if (input) {

        input.value =
            time;

    }


    const timeText =
        document.getElementById(
            "timeText"
        );

    if (timeText) {

        timeText.innerText =
            "Wake me at " +
            formatTime(time);

    }


    showPage(
        "setAlarm"
    );


    toast(
        "Suggested time selected 💡"
    );
}


/* =====================================================
                    HISTORY
===================================================== */

function renderHistory() {

    const historyCompleted =
        document.getElementById(
            "historyCompleted"
        );

    const historyPictures =
        document.getElementById(
            "historyPictures"
        );

    const activeDays =
        document.getElementById(
            "activeDays"
        );

    const averageTime =
        document.getElementById(
            "averageTime"
        );


    if (historyCompleted) {

        historyCompleted.innerText =
            history.length;

    }


    if (historyPictures) {

        historyPictures.innerText =
            alarms.filter(
                a => a.picture
            ).length;

    }


    if (activeDays) {

        activeDays.innerText =
            new Set(
                history.map(
                    item => item.date
                )
            ).size;

    }


    const average =
        alarms.length
            ? alarms[0].time
            : null;


    if (averageTime) {

        averageTime.innerText =
            average
                ? formatTime(average)
                : "--:--";

    }


    const list =
        document.getElementById(
            "historyList"
        );

    if (!list) return;


    if (!history.length) {

        list.innerHTML = `

            <div class="history-row">

                <span>
                    No completed alarms yet
                </span>

                <small>
                    —
                </small>

            </div>

        `;

        return;
    }


    list.innerHTML =
        history
            .slice(-10)
            .reverse()
            .map(item => {

                return `

                    <div class="history-row">

                        <span>

                            ✓ ${item.name}

                            ${
                                item.object
                                ? " • " + item.object
                                : ""
                            }

                        </span>

                        <small>
                            ${item.date}
                        </small>

                    </div>

                `;

            })
            .join("");
}


/* =====================================================
                RENDER ALL
===================================================== */

function renderAll() {

    renderAlarms();

    renderReminders();

    renderDashboard();

    renderDetails();

    renderHistory();

}


/* =====================================================
            CHECK ALARM EVERY SECOND
===================================================== */

function checkAlarms() {

    if (ringingAlarm) {

        return;

    }


    const now =
        new Date();


    const currentTime =
        now.toTimeString()
            .substring(0, 5);


    const today =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


    const alarm =
        alarms.find(a => {

            if (!a.active) {

                return false;

            }


            if (
                a.time !== currentTime
            ) {

                return false;

            }


            /*
             * No selected days =
             * one-time alarm.
             */

            if (
                !a.days ||
                a.days.length === 0
            ) {

                return true;

            }


            return a.days.includes(
                today
            );

        });


    if (alarm) {

        triggerAlarm(
            alarm
        );

    }
}


setInterval(
    checkAlarms,
    1000
);


/* =====================================================
                TRIGGER ALARM
===================================================== */

function triggerAlarm(
    alarm
) {

    ringingAlarm =
        alarm;


    const targetImage =
        document.getElementById(
            "targetImage"
        );

    if (targetImage) {

        targetImage.src =
            alarm.picture;

    }


    const ringingAlarmName =
        document.getElementById(
            "ringingAlarmName"
        );

    if (ringingAlarmName) {

        ringingAlarmName.innerText =
            alarm.name +
            " is ringing!";

    }


    const message =
        document.getElementById(
            "matchMessage"
        );

    if (message) {

        message.innerHTML =
            "🔍 Loading object detection...";

    }


    const modal =
        document.getElementById(
            "alarmModal"
        );

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }


    playAlarmSound();

    startCamera();


    document.title =
        "⏰ WakeSnap Alarm!";


    toast(
        "Alarm ringing! Show the matching object 📸"
    );
}


/* =====================================================
                    ALARM SOUND
===================================================== */

function playAlarmSound() {

    stopAlarmSound();


    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        function beep() {

            if (!audioContext) {

                return;

            }


            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.connect(
                gain
            );

            gain.connect(
                audioContext.destination
            );


            oscillator.frequency.value =
                800;


            gain.gain.setValueAtTime(
                0.25,
                audioContext.currentTime
            );


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime
                + 0.35
            );

        }


        beep();


        soundInterval =
            setInterval(
                beep,
                800
            );


    } catch(error) {

        console.log(
            "Audio error:",
            error
        );

    }
}


/* =====================================================
                STOP ALARM SOUND
===================================================== */

function stopAlarmSound() {

    if (soundInterval) {

        clearInterval(
            soundInterval
        );

        soundInterval =
            null;

    }


    if (audioContext) {

        try {

            audioContext.close();

        } catch(error) {}

        audioContext =
            null;

    }
}


/* =====================================================
                START CAMERA
===================================================== */

async function startCamera() {

    try {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            throw new Error(
                "Camera API unavailable"
            );

        }


        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "user"
                    },

                    audio: false

                });


        const camera =
            document.getElementById(
                "camera"
            );


        if (camera) {

            camera.srcObject =
                cameraStream;

            try {

                await camera.play();

            } catch(error) {}

        }


        const message =
            document.getElementById(
                "matchMessage"
            );


        if (message) {

            message.innerText =
                "Camera ready. Show the matching object 📸";

        }


    } catch(error) {

        console.error(
            "Camera error:",
            error
        );


        const message =
            document.getElementById(
                "matchMessage"
            );


        if (message) {

            message.innerText =
                "⚠️ Camera permission is required.";

        }


        toast(
            "Please allow camera permission."
        );

    }
}


/* =====================================================
                CLOSE CAMERA
===================================================== */

function closeCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

        cameraStream =
            null;

    }


    const video =
        document.getElementById(
            "camera"
        );


    if (video) {

        video.srcObject =
            null;

    }
}


/* =====================================================
        LOAD EXTERNAL OBJECT DETECTION LIBRARY
===================================================== */

function loadExternalScript(
    src
) {

    return new Promise(
        (resolve, reject) => {

            const existing =
                document.querySelector(
                    `script[src="${src}"]`
                );


            if (existing) {

                if (
                    existing.dataset.loaded ===
                    "true"
                ) {

                    resolve();

                    return;

                }


                existing.addEventListener(
                    "load",
                    resolve,
                    { once: true }
                );


                existing.addEventListener(
                    "error",
                    reject,
                    { once: true }
                );


                return;
            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                src;


            script.onload =
                function() {

                    script.dataset.loaded =
                        "true";

                    resolve();

                };


            script.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not load " +
                            src
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );
}


/* =====================================================
            LOAD COCO-SSD MODEL
===================================================== */

async function loadObjectDetectionModel() {

    if (objectDetectionModel) {

        return objectDetectionModel;

    }


    if (objectModelPromise) {

        return objectModelPromise;

    }


    objectModelPromise =
        (async function() {

            try {

                /*
                 * TensorFlow.js
                 */

                if (!window.tf) {

                    await loadExternalScript(

                        "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js"

                    );

                }


                /*
                 * COCO-SSD
                 */

                if (!window.cocoSsd) {

                    await loadExternalScript(

                        "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"

                    );

                }


                objectDetectionModel =
                    await window.cocoSsd.load();


                console.log(
                    "COCO-SSD loaded successfully ✓"
                );


                return objectDetectionModel;


            } catch(error) {

                console.error(
                    "Object detection model error:",
                    error
                );


                objectDetectionModel =
                    null;

                objectModelPromise =
                    null;

                return null;

            }

        })();


    return objectModelPromise;
}


/* =====================================================
            DETECT TARGET OBJECT
===================================================== */

async function detectTargetObjects(
    picture
) {

    const model =
        await loadObjectDetectionModel();


    if (!model) {

        return [];

    }


    return new Promise(
        resolve => {

            const image =
                new Image();


            image.onload =
                async function() {

                    try {

                        const predictions =
                            await model.detect(
                                image
                            );


                        console.log(
                            "Target objects:",
                            predictions
                        );


                        /*
                         * Ignore person when another
                         * useful object exists.
                         */

                        let useful =
                            predictions
                                .filter(
                                    item =>
                                        item &&
                                        item.score >=
                                            0.20 &&
                                        item.class !==
                                            "person"
                                )
                                .sort(
                                    (a, b) =>
                                        b.score -
                                        a.score
                                );


                        /*
                         * If only person is detected,
                         * use person.
                         */

                        if (
                            useful.length === 0
                        ) {

                            useful =
                                predictions
                                    .filter(
                                        item =>
                                            item &&
                                            item.score >=
                                                0.20
                                    )
                                    .sort(
                                        (a, b) =>
                                            b.score -
                                            a.score
                                    );

                        }


                        const classes =
                            [
                                ...new Set(
                                    useful
                                        .slice(
                                            0,
                                            3
                                        )
                                        .map(
                                            item =>
                                                item.class
                                        )
                                )
                            ];


                        resolve(
                            classes
                        );


                    } catch(error) {

                        console.error(
                            "Target detection error:",
                            error
                        );

                        resolve([]);

                    }

                };


            image.onerror =
                function() {

                    resolve([]);

                };


            image.src =
                picture;

        }
    );
}


/* =====================================================
            GET TARGET OBJECTS
===================================================== */

async function getTargetObjects(
    alarm
) {

    /*
     * Already detected?
     */

    if (
        Array.isArray(
            alarm.objectClasses
        ) &&
        alarm.objectClasses.length > 0
    ) {

        return alarm.objectClasses;

    }


    /*
     * Detect object from target picture.
     */

    const objects =
        await detectTargetObjects(
            alarm.picture
        );


    /*
     * Save detected object classes.
     */

    alarm.objectClasses =
        objects;


    saveData();


    return objects;
}


/* =====================================================
        DETECT OBJECTS FROM CAMERA
===================================================== */

async function detectCameraObjects(
    video
) {

    const model =
        await loadObjectDetectionModel();


    if (!model) {

        return [];

    }


    try {

        const predictions =
            await model.detect(
                video
            );


        return predictions
            .filter(
                item =>
                    item &&
                    item.score >= 0.25 &&
                    item.class
            )
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            );


    } catch(error) {

        console.error(
            "Camera object detection error:",
            error
        );

        return [];

    }
}


/* =====================================================
        CAPTURE & CHECK OBJECT
===================================================== */

async function captureAndCheck() {

    if (!ringingAlarm) {

        toast(
            "No alarm is currently ringing."
        );

        return;
    }


    const video =
        document.getElementById(
            "camera"
        );


    const message =
        document.getElementById(
            "matchMessage"
        );


    if (
        !video ||
        !video.videoWidth ||
        !video.videoHeight
    ) {

        if (message) {

            message.innerText =
                "⚠️ Camera is not ready.";

        }

        toast(
            "Camera is not ready."
        );

        return;
    }


    if (message) {

        message.innerText =
            "🔍 Checking the object...";

    }


    try {

        /*
         * Get object class from selected picture.
         */

        const targetObjects =
            await getTargetObjects(
                ringingAlarm
            );


        console.log(
            "TARGET OBJECTS:",
            targetObjects
        );


        if (
            !targetObjects.length
        ) {

            if (message) {

                message.innerText =
                    "⚠️ Could not identify the target object. Try a clearer picture.";

            }

            toast(
                "Target object could not be detected."
            );

            return;
        }


        /*
         * Detect objects from live camera.
         */

        const cameraObjects =
            await detectCameraObjects(
                video
            );


        console.log(
            "CAMERA OBJECTS:",
            cameraObjects
        );


        /*
         * Find same object class.
         *
         * Example:
         *
         * Target = cell phone
         *
         * Camera = another cell phone
         *
         * MATCH ✓
         */

        const matchedObject =
            cameraObjects.find(
                prediction =>

                    targetObjects.includes(
                        prediction.class
                    )
            );


        /* =========================================
                    OBJECT MATCHED
        ========================================= */

        if (matchedObject) {

            const objectName =
                matchedObject.class;


            const confidence =
                Math.round(
                    matchedObject.score *
                    100
                );


            if (message) {

                message.innerHTML =

                    "✅ " +
                    objectName +
                    " matched!<br>" +

                    "Confidence: " +
                    confidence +
                    "%";

            }


            /*
             * VERY IMPORTANT:
             *
             * This function stops:
             *
             * 🔊 Alarm sound
             * 📷 Camera
             * 🚨 Popup
             *
             */

            successAlarm(
                confidence,
                objectName
            );


            return;
        }


        /* =========================================
                    OBJECT NOT MATCHED
        ========================================= */

        const detectedNames =
            cameraObjects
                .slice(0, 5)
                .map(
                    item =>
                        item.class
                );


        if (message) {

            if (
                detectedNames.length
            ) {

                message.innerHTML =

                    "❌ Object does not match.<br>" +

                    "Target: " +
                    targetObjects.join(", ") +

                    "<br>Camera: " +
                    detectedNames.join(", ") +

                    "<br><br>Try again!";

            } else {

                message.innerHTML =

                    "❌ No object detected.<br>" +

                    "Please show the correct object.";

            }

        }


        toast(
            "Show the correct object 📸"
        );


    } catch(error) {

        console.error(
            "Capture check error:",
            error
        );


        if (message) {

            message.innerHTML =
                "⚠️ Object checking failed. Please try again.";

        }


        toast(
            "Object checking failed."
        );

    }
}


/* =====================================================
            SUCCESS - STOP ALARM
===================================================== */

function successAlarm(
    matchValue = 100,
    objectName = "Object"
) {

    /*
     * IMPORTANT:
     * Save current ringing alarm first.
     */

    const completedAlarm =
        ringingAlarm;


    if (!completedAlarm) {

        return;

    }


    console.log(
        "SUCCESS:",
        objectName,
        matchValue
    );


    /* =========================================
                STOP SOUND
    ========================================= */

    stopAlarmSound();


    /* =========================================
                STOP CAMERA
    ========================================= */

    closeCamera();


    /* =========================================
                SAVE HISTORY
    ========================================= */

    history.push({

        id:
            Date.now(),

        alarmId:
            completedAlarm.id,

        name:
            completedAlarm.name,

        date:
            new Date()
                .toLocaleDateString(),

        time:
            new Date()
                .toLocaleTimeString(),

        match:
            matchValue,

        object:
            objectName

    });


    /* =========================================
            ONE-TIME ALARM OFF
    ========================================= */

    if (
        !completedAlarm.days ||
        completedAlarm.days.length === 0
    ) {

        completedAlarm.active =
            false;

    }


    /* =========================================
                SAVE DATA
    ========================================= */

    saveData();


    /* =========================================
                CLOSE MODAL
    ========================================= */

    const modal =
        document.getElementById(
            "alarmModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    /* =========================================
                RESET TITLE
    ========================================= */

    document.title =
        "WakeSnap - Smart Picture Alarm";


    /* =========================================
                MESSAGE
    ========================================= */

    const message =
        document.getElementById(
            "matchMessage"
        );


    if (message) {

        message.innerHTML =

            "✅ " +
            objectName +
            " matched!<br>" +

            "🔕 Alarm stopped.";

    }


    /*
     * VERY IMPORTANT
     *
     * Reset ringing alarm only
     * AFTER stopping sound,
     * camera and saving history.
     */

    ringingAlarm =
        null;


    /* =========================================
                REFRESH UI
    ========================================= */

    renderAll();


    /* =========================================
                SUCCESS MESSAGE
    ========================================= */

    toast(
        "🎉 " +
        objectName +
        " matched! Alarm stopped."
    );


    console.log(
        "Alarm successfully stopped ✓"
    );
}


/* =====================================================
                    INITIAL START
===================================================== */

if (currentUser) {

    openApp();

} else {

    const authPage =
        document.getElementById(
            "authPage"
        );

    if (authPage) {

        authPage.classList.remove(
            "hidden"
        );

    }
}