import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/core";
import { useSelector } from "react-redux";

import { CharacterState } from "../constants/enums";

import Character from "./Character";
import { addSession, selectUser } from "../features/userSlice";

const TEST_VALUES = [
  `list_for_each_entry
  yes`,
  `def hackMe():`,
  `chizuru best girl
  hai`
];

const START = 0;

const END_VALUES = TEST_VALUES.map((END) => {
  return END.length - 1;
})

const BLOCKED_KEYS = ["Shift"];

interface Props {
  editorValue: string | undefined;
};

const Editor: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState<string[]>([]);
  const [currentTyped, setCurrentTyped] = useState<{
    charCode: number;
    keyCode: number;
    key: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentCharacterState, setCurrentCharacterState] = useState<CharacterState>(CharacterState.NORMAL);

  const [start, setStart] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [line, setLine] = useState<number>(0);

  const user = useSelector(selectUser);

  useEffect(() => {
    editorListener();
  }, [])

  useEffect(() => {
    // setValue(TEST_VALUES[user?.currentSession].split(""));
    if (props.editorValue) {
      const content = props.editorValue.split("");
      // setValue(props.editorValue.split(""));
      setValue(content);
    }
  }, [props.editorValue])

  useEffect(() => {
    if (user?.currentSession < TEST_VALUES.length) {
      setValue(TEST_VALUES[user?.currentSession].split(""));

      setCurrentIndex(0);
      setCurrentTyped(null);
      setStart(0);
      setErrors(0);
      setCurrentCharacterState(CharacterState.NORMAL);
    }

  }, [user?.currentSession]);

  useEffect(() => {
    if (currentIndex === START) {
      setStart(Date.now());
    }

    if (currentTyped?.keyCode === 13) {
      if (value[currentIndex] === "\n") {
        setCurrentIndex((index) => index + 1);
        setCurrentTyped(null);
      }
    }
    else {
      if (currentTyped !== null && currentTyped !== undefined) {
        let correct = Number(value[currentIndex]?.charCodeAt(0) === Number(currentTyped?.charCode));

        /** If correct */
        if (correct) {
          setCurrentIndex(currentIndex + 1);
          setCurrentTyped(null);
          setCurrentCharacterState(CharacterState.NORMAL);
          if (currentIndex === END_VALUES[user?.currentSession]) {
            let stop = Date.now();
            let duration = stop - start;
            let perMinute = duration / 60000;
            console.log(duration);

            let cpm, wpm, payload;

            cpm = Math.trunc(
              END_VALUES[user?.currentSession] / (perMinute)
            );
            wpm = Math.trunc(
              END_VALUES[user?.currentSession] / (5 * perMinute)
            );

            payload = {
              "cpm": cpm,
              "wpm": wpm,
              "errors": errors,
            }
            dispatch(addSession(payload));
          }
        }
        /** If not correct */
        else if (!correct) {
          setCurrentCharacterState(CharacterState.WRONG);
          setErrors((error) => error + 1);
        };
      }
    }
  }, [currentIndex, currentTyped])

  const editorListener = () => {
    window.addEventListener("keypress", (event: KeyboardEvent) => {
      BLOCKED_KEYS.forEach((key) => {
        if (event.charCode === 32 || event.key === "Enter" || event.key === "Tab") {
          event.preventDefault();
        };
        setCurrentTyped({
          charCode: event.charCode,
          keyCode: event.keyCode,
          key: event.key
        })
      })
    });
  };

  const updateLine = <Text color="yellow.300" display="inline-block" fontSize="xl"> {line} </Text>

  // console.log(`characterState: ${currentCharacterState}`);

  return (
    <Box>
      {value.map(((val, index) => (
        <React.Fragment key={`#currentSession:${user?.currentSession}-value-${val}-${index}`} >
          {index === 0 && <Text color="yellow.300" display="inline-block" fontSize="xl"> {line} </Text>}
          <Character
            // key={`#currentSession:${user?.currentSession}-value-${val}-${index}`}
            character={val || ""}
            typed={currentIndex === index ? currentTyped : null}
            currentIndex={currentIndex}
            characterIndex={index}
            setCurrentIndex={setCurrentIndex}
            showCursor={currentIndex === index}
            characterState={
              currentIndex === index ? currentCharacterState :
                currentIndex >= index ? CharacterState.CORRECT : CharacterState.NORMAL}
          />
          {val === "\n" && <Text color="yellow.300" display="inline-block" fontSize="xl"> {line} </Text>}
        </React.Fragment>
      )))}
    </Box>
  );
};



export default Editor;
