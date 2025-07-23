document.addEventListener('DOMContentLoaded', function() {
    console.log("lights.js chargé");

    // Trames à envoyer pour chaque action
    const TRAMES = {
        "1_on":    "BBL114C", // Allumer 1, éteindre 2
        "2_on":    "BBL124F", // Allumer 2, éteindre 1
        "both_on": "BBL134E", // Allumer 1 et 2
        "both_off":"BBL104D"  // Éteindre les 2
    };

    // Mapping pour affichage état
    const STATE_LABELS = {
        on: {text: "Allumée", class: "bg-success"},
        off: {text: "Éteinte", class: "bg-secondary"},
        unknown: {text: "Inconnu", class: "bg-secondary"}
    };

    // État courant des lumières (1: "on"/"off", 2: "on"/"off")
    let lightStates = {1: "off", 2: "off"};

    function setLightState(light, state) {
        lightStates[light] = state;
        const stateDiv = document.getElementById(`light${light}-state`);
        const label = STATE_LABELS[state] || STATE_LABELS.unknown;
        stateDiv.innerHTML = `État actuel : <span class="badge ${label.class}">${label.text}</span>`;
    }

    function showResponse(msg, type="info") {
        const resp = document.getElementById('response');
        resp.className = `alert alert-${type} mt-4`;
        resp.innerHTML = msg;
        resp.style.display = "block";
        setTimeout(() => { resp.style.display = "none"; }, 4000);
    }

    function sendTrame(trame, callback) {
        const url = document.body.getAttribute('data-send-command-url');
        const csrf = document.body.getAttribute('data-csrf-token');
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

    // Gestion boutons individuels
    document.querySelectorAll('.light-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const light = this.getAttribute('data-light');
            const action = this.getAttribute('data-action');
            let trame = "";
            let other = light === "1" ? "2" : "1";

            // Logique intelligente
            if (action === "on") {
                if (lightStates[light] === "on") {
                    showResponse(`Lumière ${light} déjà allumée.`, "info");
                    return;
                }
                if (lightStates[other] === "on") {
                    trame = TRAMES["both_on"];
                    setLightState("1", "on");
                    setLightState("2", "on");
                } else {
                    trame = TRAMES[`${light}_on`];
                    setLightState(light, "on");
                    setLightState(other, "off");
                }
            } else if (action === "off") {
                if (lightStates[light] === "off") {
                    showResponse(`Lumière ${light} déjà éteinte.`, "info");
                    return;
                }
                if (lightStates[other] === "off") {
                    trame = TRAMES["both_off"];
                    setLightState("1", "off");
                    setLightState("2", "off");
                } else {
                    trame = TRAMES[`${other}_on`];
                    setLightState(light, "off");
                    setLightState(other, "on");
                }
            }

            showResponse(`Commande envoyée : <b>${trame}</b>`, "info");
            sendTrame(trame, data => {
                if (data && data.response) {
                    showResponse(`Réponse : <pre>${data.response}</pre>`, "success");
                }
            });
        });
    });

    // Gestion boutons globaux
    document.querySelectorAll('.global-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            let trame = "";
            if (action === "on") {
                trame = TRAMES["both_on"];
                setLightState(1, "on");
                setLightState(2, "on");
            } else if (action === "off") {
                trame = TRAMES["both_off"];
                setLightState(1, "off");
                setLightState(2, "off");
            }
            showResponse(`Commande globale envoyée : <b>${trame}</b>`, "info");
            sendTrame(trame, data => {
                if (data && data.response) {
                    showResponse(`Réponse globale : <pre>${data.response}</pre>`, "success");
                }
            });
        });
    });

    // Fonction de check périodique des états des lumières
    function checkLightsState() {
        console.log("Appel checkLightsState");
        const checkTrame = "BZL165";
        sendTrame(checkTrame, data => {
            // Les réponses possibles :
            // lum1 éteint : BBS063
            // lum1 allumée : BBS162
            // lum2 éteint : BAS063
            // lum2 allumée : BAS162

            let respArr = [];
            if (data && Array.isArray(data.response)) {
                respArr = data.response;
            } else if (data && typeof data.response === "string") {
                respArr = data.response.split(/[;,]+/);
            }

            // Par défaut
            let state1 = "unknown";
            let state2 = "unknown";

            // Cherche les trames dans la réponse
            if (respArr.find(r => r.trim() === "BBS162")) state1 = "on";
            else if (respArr.find(r => r.trim() === "BBS063")) state1 = "off";

            if (respArr.find(r => r.trim() === "BAS162")) state2 = "on";
            else if (respArr.find(r => r.trim() === "BAS063")) state2 = "off";

            setLightState(1, state1);
            setLightState(2, state2);
        });
    }

    // Lancer le check toutes les 5 secondes
    setInterval(checkLightsState, 5000);

    // Initialisation états et premier check
    setLightState(1, "off");
    setLightState(2, "off");
    checkLightsState();
});