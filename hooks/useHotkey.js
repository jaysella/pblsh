// Adapted from https://github.com/arthurtyukayev/use-keyboard-shortcut/blob/master/lib/useKeyboardShortcut.js
import { useEffect, useCallback, useReducer } from "react";
import { disabledEventPropagation } from "../helpers/utilities";

const blacklistedTargets = ["input", "textarea"];

const keysReducer = (state, action) => {
  switch (action.type) {
    case "set-key-down":
      const keydownState = { ...state, [action.key]: true };
      return keydownState;

    case "set-key-up":
      const keyUpState = { ...state, [action.key]: false };
      return keyUpState;

    case "reset-keys":
      const resetState = { ...action.data };
      return resetState;

    default:
      return state;
  }
};

const useHotkey = (shortcutKeys, callback, options) => {
  if (!Array.isArray(shortcutKeys))
    throw new Error(
      "The first parameter to `useHotkey` must be an ordered array of `KeyboardEvent.key` strings."
    );

  if (!shortcutKeys.length)
    throw new Error(
      "The first parameter to `useHotkey` must contain at least one `KeyboardEvent.key` string."
    );

  if (!callback || typeof callback !== "function")
    throw new Error(
      "The second parameter to `useHotkey` must be a function that will be invoked when the keys are pressed."
    );

  const { overrideSystem } = options || {};
  const initialKeyMapping = shortcutKeys.reduce((currentKeys, key) => {
    currentKeys[key.toLowerCase()] = false;
    return currentKeys;
  }, {});

  const [keys, setKeys] = useReducer(keysReducer, initialKeyMapping);

  const keydownListener = useCallback(
    (assignedKey) => (keydownEvent) => {
      const loweredKey = assignedKey.toLowerCase();

      if (keydownEvent.repeat) return;
      if (blacklistedTargets.includes(keydownEvent.target.tagName)) return;
      if (loweredKey !== keydownEvent.key.toLowerCase()) return;
      if (keys[loweredKey] === undefined) return;

      if (overrideSystem) {
        keydownEvent.preventDefault();
        disabledEventPropagation(keydownEvent);
      }

      setKeys({ type: "set-key-down", key: loweredKey });
      return false;
    },
    [keys, overrideSystem]
  );

  const keyupListener = useCallback(
    (assignedKey) => (keyupEvent) => {
      const raisedKey = assignedKey.toLowerCase();

      if (blacklistedTargets.includes(keyupEvent.target.tagName)) return;
      if (keyupEvent.key.toLowerCase() !== raisedKey) return;
      if (keys[raisedKey] === undefined) return;

      if (overrideSystem) {
        keyupEvent.preventDefault();
        disabledEventPropagation(keyupEvent);
      }

      setKeys({ type: "set-key-up", key: raisedKey });
      return false;
    },
    [keys, overrideSystem]
  );

  useEffect(() => {
    if (!Object.values(keys).filter((value) => !value).length) {
      callback(keys);
      setKeys({ type: "reset-keys", data: initialKeyMapping });
    } else {
      setKeys({ type: null });
    }

    return () => {
      return null;
    };
  }, [callback, initialKeyMapping, keys]);

  useEffect(() => {
    shortcutKeys.forEach((k) =>
      window.addEventListener("keydown", keydownListener(k))
    );

    return () =>
      shortcutKeys.forEach((k) =>
        window.removeEventListener("keydown", keydownListener(k))
      );
  }, [keydownListener, shortcutKeys]);

  useEffect(() => {
    shortcutKeys.forEach((k) =>
      window.addEventListener("keyup", keyupListener(k))
    );

    return () =>
      shortcutKeys.forEach((k) =>
        window.removeEventListener("keyup", keyupListener(k))
      );
  }, [keyupListener, shortcutKeys]);
};

export default useHotkey;
