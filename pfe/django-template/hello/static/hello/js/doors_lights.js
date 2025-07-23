// --- Logique Portes ---
(function() {
    window.checkDoorsState = function() {
        if (window.doorsCheckStart) window.doorsCheckStart();
        const checkTrame = "AZR178";
        sendTrame(checkTrame, data => {
            let respArr = [];
            if (data && Array.isArray(data.response)) {
                respArr = data.response;
            } else if (data && typeof data.response === "string") {
                respArr = data.response.split(/[;,]+/);
            }
            [1,2].forEach((door, idx) => {
                let trame = respArr[idx] ? respArr[idx].trim() : "";
                let isManual = false;
                let state = "unknown";
                // Porte 1
                if (door === 1) {
                    if (trame === "AAS1052") state = "open";
                    else if (trame === "AAS1153") state = "auto";
                    else if (trame === "AAS1250") state = "exit";
                    else if (trame === "AAS0053") { state = "open"; isManual = true; }
                    else if (trame === "AAS0152") { state = "auto"; isManual = true; }
                    else if (trame === "AAS0251") { state = "exit"; isManual = true; }
                }
                // Porte 2
                if (door === 2) {
                    if (trame === "ABS1050") state = "open";
                    else if (trame === "ABS1151") state = "auto";
                    else if (trame === "ABS1252") state = "exit";
                    else if (trame === "ABS0050") { state = "open"; isManual = true; }
                    else if (trame === "ABS0151") { state = "auto"; isManual = true; }
                    else if (trame === "ABS0252") { state = "exit"; isManual = true; }
                }
                manualMode[door] = isManual;
                setDoorState(door, state, isManual);
            });
            updateButtonsState();
            if (window.doorsCheckEnd) window.doorsCheckEnd();
        });
    };

    let manualMode = {1: false, 2: false};

    function setDoorState(door, state, isManual = false) {
        const stateDiv = document.getElementById(`door${door}-state`);
        if (!stateDiv) return;
        const STATE_LABELS_DOORS = {
            open: {text: "Ouverte", class: "bg-success"},
            auto: {text: "Automatique", class: "bg-primary"},
            exit: {text: "Sortie seule", class: "bg-warning"},
            closed: {text: "Fermée", class: "bg-danger"},
            unknown: {text: "Inconnu", class: "bg-secondary"}
        };
        const label = STATE_LABELS_DOORS[state] || STATE_LABELS_DOORS.unknown;
        if (isManual) {
            stateDiv.innerHTML = `<span class="text-danger fw-bold">La porte est en mode manuelle, vous ne pouvez pas changer son état.<br>Son état actuel est : </span><span class="badge ${label.class}">${label.text}</span>`;
        } else {
            stateDiv.innerHTML = `État actuel : <span class="badge ${label.class}">${label.text}</span>`;
        }
    }

    function updateButtonsState() {
        [1,2].forEach(door => {
            document.querySelectorAll(`.door-btn[data-door="${door}"]`).forEach(btn => {
                btn.disabled = manualMode[door];
            });
        });
        let anyManual = manualMode[1] || manualMode[2];
        document.querySelectorAll('.global-btn.door-global').forEach(btn => {
            btn.disabled = anyManual;
        });
    }

    function getEtatFromTrame(door, trameEtat) {
        if (door === "1" || door === 1) {
            if (trameEtat === "AAS1052") return "open";
            if (trameEtat === "AAS1153") return "auto";
            if (trameEtat === "AAS1250") return "exit";
            if (trameEtat === "AAS0053") return "open";
            if (trameEtat === "AAS0152") return "auto";
            if (trameEtat === "AAS0251") return "exit";
        }
        if (door === "2" || door === 2) {
            if (trameEtat === "ABS1050") return "open";
            if (trameEtat === "ABS1151") return "auto";
            if (trameEtat === "ABS1252") return "exit";
            if (trameEtat === "ABS0050") return "open";
            if (trameEtat === "ABS0151") return "auto";
            if (trameEtat === "ABS0252") return "exit";
        }
        return "unknown";
    }

    function getEtatAffiche(door) {
        const stateDiv = document.getElementById(`door${door}-state`);
        if (!stateDiv) return "unknown";
        if (stateDiv.innerHTML.includes("Ouverte")) return "open";
        if (stateDiv.innerHTML.includes("Automatique")) return "auto";
        if (stateDiv.innerHTML.includes("Sortie seule")) return "exit";
        return "unknown";
    }

    document.addEventListener('DOMContentLoaded', function() {
        const TRAMES_DOORS = {
            "1": { open: "AAW1056", auto: "AAW1157", exit: "AAW1254" },
            "2": { open: "ABW1055", auto: "ABW1154", exit: "ABW1257" },
            "all": { open: "AZW104D", auto: "AZW114C", exit: "AZW124F" }
        };

        document.querySelectorAll('.door-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const door = this.getAttribute('data-door');
                if (manualMode[door]) {
                    showResponse("La porte est en mode manuelle, vous ne pouvez pas changer son état.", "warning");
                    return;
                }
                const action = this.getAttribute('data-action');
                const trame = TRAMES_DOORS[door][action];

                // Désactive tous les boutons pendant la vérification
                setDoorsButtonsDisabled(true);

                // Vérification d'état avant action
                sendTrame("AZR178", data => {
                    let respArr = [];
                    if (data && Array.isArray(data.response)) {
                        respArr = data.response;
                    } else if (data && typeof data.response === "string") {
                        respArr = data.response.split(/[;,]+/);
                    }
                    let trameEtat = respArr[door - 1] ? respArr[door - 1].trim() : "";
                    let etatActuel = getEtatFromTrame(door, trameEtat);
                    let etatAffiche = getEtatAffiche(door);
                    if (etatActuel !== etatAffiche) {
                        showResponse("L'état réel de la porte a changé, veuillez rafraîchir avant d'effectuer une action.", "warning");
                        window.checkDoorsState();
                        setDoorsButtonsDisabled(false);
                        return;
                    }
                    setDoorState(door, action);
                    showResponse(`Commande envoyée à la porte ${door} : <b>${action}</b>`, "info");
                    sendTrame(trame, data2 => {
                        if (data2 && data2.response) {
                            showResponse(`Réponse porte ${door} : <pre>${data2.response}</pre>`, "success");
                            window.checkDoorsState();
                        }
                        setDoorsButtonsDisabled(false);
                    });
                });
            });
        });

        document.querySelectorAll('.global-btn.door-global').forEach(btn => {
            btn.addEventListener('click', function() {
                let anyManual = manualMode[1] || manualMode[2];
                if (anyManual) {
                    showResponse("Au moins une porte est en mode manuelle, vous ne pouvez pas changer leur état.", "warning");
                    return;
                }
                const action = this.getAttribute('data-action');
                const trame = TRAMES_DOORS["all"][action];

                setDoorsButtonsDisabled(true);

                // Vérification d'état avant action globale
                sendTrame("AZR178", data => {
                    let respArr = [];
                    if (data && Array.isArray(data.response)) {
                        respArr = data.response;
                    } else if (data && typeof data.response === "string") {
                        respArr = data.response.split(/[;,]+/);
                    }
                    let ok = true;
                    [1,2].forEach(door => {
                        let trameEtat = respArr[door - 1] ? respArr[door - 1].trim() : "";
                        let etatActuel = getEtatFromTrame(door, trameEtat);
                        let etatAffiche = getEtatAffiche(door);
                        if (etatActuel !== etatAffiche) ok = false;
                    });
                    if (!ok) {
                        showResponse("L'état réel d'au moins une porte a changé, veuillez rafraîchir avant d'effectuer une action.", "warning");
                        window.checkDoorsState();
                        setDoorsButtonsDisabled(false);
                        return;
                    }
                    setDoorState(1, action);
                    setDoorState(2, action);
                    showResponse(`Commande globale envoyée : <b>${action}</b>`, "info");
                    sendTrame(trame, data2 => {
                        if (data2 && data2.response) {
                            showResponse(`Réponse globale : <pre>${data2.response}</pre>`, "success");
                            window.checkDoorsState();
                        }
                        setDoorsButtonsDisabled(false);
                    });
                });
            });
        });

        // Rafraîchissement manuel
        const refreshBtn = document.getElementById('refresh-doors-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                window.checkDoorsState();
            });
        }

        setDoorState(1, "unknown");
        setDoorState(2, "unknown");
        manualMode[1] = false;
        manualMode[2] = false;
        updateButtonsState();
    });
})();

// --- Logique Lumières ---
(function() {
    window.checkLightsState = function() {
        if (window.lightsCheckStart) window.lightsCheckStart();
        const checkTrame = "BZL165";
        sendTrame(checkTrame, data => {
            let respArr = [];
            if (data && Array.isArray(data.response)) {
                respArr = data.response;
            } else if (data && typeof data.response === "string") {
                respArr = data.response.split(/[;,]+/);
            }
            let state1 = "unknown";
            let state2 = "unknown";
            if (respArr.find(r => r.trim() === "BBS162")) state1 = "on";
            else if (respArr.find(r => r.trim() === "BBS063")) state1 = "off";
            if (respArr.find(r => r.trim() === "BAS162")) state2 = "on";
            else if (respArr.find(r => r.trim() === "BAS063")) state2 = "off";
            setLightState(1, state1);
            setLightState(2, state2);
            if (window.lightsCheckEnd) window.lightsCheckEnd();
        });
    };

    let lightStates = {1: "off", 2: "off"};

    function setLightState(light, state) {
        lightStates[light] = state;
        const stateDiv = document.getElementById(`light${light}-state`);
        if (!stateDiv) return;
        const STATE_LABELS_LIGHTS = {
            on: {text: "Allumée", class: "bg-success"},
            off: {text: "Éteinte", class: "bg-secondary"},
            unknown: {text: "Inconnu", class: "bg-secondary"}
        };
        const label = STATE_LABELS_LIGHTS[state] || STATE_LABELS_LIGHTS.unknown;
        stateDiv.innerHTML = `État actuel : <span class="badge ${label.class}">${label.text}</span>`;
    }

    function getLightEtatFromTrame(trameEtat, light) {
        if (light === "1" || light === 1) {
            if (trameEtat === "BBS162") return "on";
            if (trameEtat === "BBS063") return "off";
        }
        if (light === "2" || light === 2) {
            if (trameEtat === "BAS162") return "on";
            if (trameEtat === "BAS063") return "off";
        }
        return "unknown";
    }

    function getLightEtatAffiche(light) {
        const stateDiv = document.getElementById(`light${light}-state`);
        if (!stateDiv) return "unknown";
        if (stateDiv.innerHTML.includes("Allumée")) return "on";
        if (stateDiv.innerHTML.includes("Éteinte")) return "off";
        return "unknown";
    }

    document.addEventListener('DOMContentLoaded', function() {
        const TRAMES_LIGHTS = {
            "1_on":    "BZL1154",   // Allumer lumière 1
            "2_on":    "BZL1257",   // Allumer lumière 2
            "both_on": "BZL1356",   // Allumer les deux
            "both_off":"BZL1055"    // Éteindre les deux
        };

        document.querySelectorAll('.light-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const light = this.getAttribute('data-light');
                const action = this.getAttribute('data-action');
                let trame = "";
                let other = light === "1" ? "2" : "1";

                setLightsButtonsDisabled(true);

                // Vérification d'état avant action
                sendTrame("BZL165", data => {
                    let respArr = [];
                    if (data && Array.isArray(data.response)) {
                        respArr = data.response;
                    } else if (data && typeof data.response === "string") {
                        respArr = data.response.split(/[;,]+/);
                    }
                    // Etat réel
                    let trameEtat = "";
                    if (light === "1") {
                        trameEtat = respArr.find(r => r.trim() === "BBS162" || r.trim() === "BBS063") || "";
                    } else {
                        trameEtat = respArr.find(r => r.trim() === "BAS162" || r.trim() === "BAS063") || "";
                    }
                    let etatActuel = getLightEtatFromTrame(trameEtat.trim(), light);
                    let etatAffiche = getLightEtatAffiche(light);

                    if (etatActuel !== etatAffiche) {
                        showResponse("L'état réel de la lumière a changé, veuillez rafraîchir avant d'effectuer une action.", "warning");
                        window.checkLightsState();
                        setLightsButtonsDisabled(false);
                        return;
                    }

                    if (action === "on") {
                        if (lightStates[light] === "on") {
                            showResponse(`Lumière ${light} déjà allumée.`, "info");
                            setLightsButtonsDisabled(false);
                            return;
                        }
                        if (lightStates[other] === "on") {
                            trame = TRAMES_LIGHTS["both_on"];
                            setLightState("1", "on");
                            setLightState("2", "on");
                        } else {
                            trame = TRAMES_LIGHTS[`${light}_on`];
                            setLightState(light, "on");
                            setLightState(other, "off");
                        }
                    } else if (action === "off") {
                        if (lightStates[light] === "off") {
                            showResponse(`Lumière ${light} déjà éteinte.`, "info");
                            setLightsButtonsDisabled(false);
                            return;
                        }
                        if (lightStates[other] === "off") {
                            trame = TRAMES_LIGHTS["both_off"];
                            setLightState("1", "off");
                            setLightState("2", "off");
                        } else {
                            trame = TRAMES_LIGHTS[`${other}_on`];
                            setLightState(light, "off");
                            setLightState(other, "on");
                        }
                    }

                    showResponse(`Commande envoyée : <b>${trame}</b>`, "info");
                    sendTrame(trame, data2 => {
                        if (data2 && data2.response) {
                            showResponse(`Réponse : <pre>${data2.response}</pre>`, "success");
                            window.checkLightsState();
                        }
                        setLightsButtonsDisabled(false);
                    });
                });
            });
        });

        document.querySelectorAll('.global-btn.light-global').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                let trame = "";

                setLightsButtonsDisabled(true);

                // Vérification d'état avant action globale
                sendTrame("BZL165", data => {
                    let respArr = [];
                    if (data && Array.isArray(data.response)) {
                        respArr = data.response;
                    } else if (data && typeof data.response === "string") {
                        respArr = data.response.split(/[;,]+/);
                    }
                    let etat1 = "unknown";
                    let etat2 = "unknown";
                    let trameEtat1 = respArr.find(r => r.trim() === "BBS162" || r.trim() === "BBS063") || "";
                    let trameEtat2 = respArr.find(r => r.trim() === "BAS162" || r.trim() === "BAS063") || "";
                    etat1 = getLightEtatFromTrame(trameEtat1.trim(), 1);
                    etat2 = getLightEtatFromTrame(trameEtat2.trim(), 2);
                    let etatAffiche1 = getLightEtatAffiche(1);
                    let etatAffiche2 = getLightEtatAffiche(2);

                    if (etat1 !== etatAffiche1 || etat2 !== etatAffiche2) {
                        showResponse("L'état réel d'au moins une lumière a changé, veuillez rafraîchir avant d'effectuer une action.", "warning");
                        window.checkLightsState();
                        setLightsButtonsDisabled(false);
                        return;
                    }

                    if (action === "on") {
                        trame = TRAMES_LIGHTS["both_on"];
                        setLightState(1, "on");
                        setLightState(2, "on");
                    } else if (action === "off") {
                        trame = TRAMES_LIGHTS["both_off"];
                        setLightState(1, "off");
                        setLightState(2, "off");
                    }
                    showResponse(`Commande globale envoyée : <b>${trame}</b>`, "info");
                    sendTrame(trame, data2 => {
                        if (data2 && data2.response) {
                            showResponse(`Réponse globale : <pre>${data2.response}</pre>`, "success");
                            window.checkLightsState();
                        }
                        setLightsButtonsDisabled(false);
                    });
                });
            });
        });

        // Rafraîchissement manuel
        const refreshBtn = document.getElementById('refresh-lights-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                window.checkLightsState();
            });
        }

        setLightState(1, "off");
        setLightState(2, "off");
    });
})();

// --- Fonctions utilitaires communes ---
function showResponse(msg, type="info") {
    const resp = document.getElementById('response');
    if (!resp) return;
    resp.className = `alert alert-${type} mt-4`;
    resp.innerHTML = msg;
    resp.style.display = "block";
    setTimeout(() => { resp.style.display = "none"; }, 4000);
}

function sendTrame(trame, callback) {
    const url = document.body.getAttribute('data-send-command-url');
    const csrf = document.body.getAttribute('data-csrf-token');
    if (!url || !csrf) return;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf
        },
        body: JSON.stringify({command: trame})
    })
    .then(res => res.json())
    .then(data => {
        callback && callback(data);
    })
    .catch(err => {
        showResponse("Erreur de communication : " + err.message, "danger");
    });
}

// --- Scheduler global pour alterner les checks toutes les 60s ---
(function() {
    function alternance() {
        window.checkDoorsState && window.checkDoorsState();
        window.checkLightsState && window.checkLightsState();
        setTimeout(alternance, 60000); // 60 secondes
    }
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(alternance, 0);
    });
})();

// Désactive/active tous les boutons lumières pendant un check
function setLightsButtonsDisabled(disabled) {
    document.querySelectorAll('.light-btn, .global-btn.light-global').forEach(btn => {
        btn.disabled = disabled;
    });
}
function setDoorsButtonsDisabled(disabled) {
    document.querySelectorAll('.door-btn, .global-btn.door-global').forEach(btn => {
        btn.disabled = disabled;
    });
}
window.lightsCheckStart = function() { setLightsButtonsDisabled(true); };
window.lightsCheckEnd = function() { setLightsButtonsDisabled(false); };
window.doorsCheckStart = function() { setDoorsButtonsDisabled(true); };
window.doorsCheckEnd = function() { setDoorsButtonsDisabled(false); };