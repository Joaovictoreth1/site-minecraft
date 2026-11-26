const storageKey = 'behemoth.cameraSensitivity.v1';
const defaultSensitivity = 100;

export function normalizeSensitivity(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 50 || number > 200 || number % 25 !== 0) {
        return defaultSensitivity;
    }
    return number;
}

export function loadSensitivity(storage) {
    try {
        return normalizeSensitivity(storage.getItem(storageKey));
    } catch {
        return defaultSensitivity;
    }
}

export function saveSensitivity(storage, value) {
    try {
        storage.setItem(storageKey, String(normalizeSensitivity(value)));
        return true;
    } catch {
        return false;
    }
}

export function bindCameraSensitivity(document, storage) {
    const input = document.getElementById('camera-sensitivity');
    const output = document.getElementById('camera-sensitivity-value');
    const reset = document.getElementById('reset-camera');
    const status = document.getElementById('camera-sensitivity-status');
    let value = loadSensitivity(storage);

    function render() {
        input.value = String(value);
        output.value = `${value}%`;
        input.setAttribute('aria-valuetext', `${value} por cento`);
        reset.disabled = value === defaultSensitivity;
    }

    function persist() {
        status.textContent = saveSensitivity(storage, value)
            ? 'Sensibilidade guardada.'
            : 'A sensibilidade só ficará ativa nesta aba.';
    }

    input.addEventListener('input', () => {
        value = normalizeSensitivity(input.value);
        status.textContent = '';
        render();
    });
    input.addEventListener('change', persist);
    reset.addEventListener('click', () => {
        value = defaultSensitivity;
        input.focus();
        render();
        persist();
    });
    render();
    return () => value / 100;
}
