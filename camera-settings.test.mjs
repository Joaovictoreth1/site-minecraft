import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadSensitivity, normalizeSensitivity, saveSensitivity } from './camera-settings.mjs';

test('accepts only the supported camera sensitivity steps', () => {
    for (const value of [50, 75, 100, 125, 150, 175, 200]) {
        assert.equal(normalizeSensitivity(String(value)), value);
    }
    for (const value of [49, 201, 101, Infinity, null, 'bad']) {
        assert.equal(normalizeSensitivity(value), 100);
    }
});

test('persists a selected value and uses the base sensitivity if storage is unavailable', () => {
    let stored = null;
    const storage = {
        getItem: () => stored,
        setItem: (_key, value) => { stored = value; },
    };
    assert.equal(loadSensitivity(storage), 100);
    assert.equal(saveSensitivity(storage, 175), true);
    assert.equal(loadSensitivity(storage), 175);
    const unavailable = () => { throw new Error('unavailable'); };
    assert.equal(loadSensitivity({ getItem: unavailable }), 100);
    assert.equal(saveSensitivity({ setItem: unavailable }, 175), false);
});
