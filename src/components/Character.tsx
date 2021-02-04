import React from "react";

import { CharacterState } from "../constants/enums";
import Cursor from "./Cursor";


interface Props {
  character: string;
  showCursor: boolean;
  typed: {
    keyCode: number;
    charCode: number;
    key: string;
  } | null;
  colIndex: number;
  rowIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  characterState: CharacterState;
}

const Character: React.FC<Props> = React.memo((props) => {

  return (
    <Cursor
      showCursor={props.showCursor}
      character={props.character}
      characterState={props.characterState}
    >
      {/* <Text fontSize="xl" color={props.characterState.toLowerCase()}> */}
      <p className={`text-xl text-${props.characterState.toLowerCase()}`}>
        {props.character}
      </p>
      {/* </Text> */}
    </Cursor>
  );
},
  (prevProps, nextProps) =>
    prevProps.typed?.charCode === nextProps.typed?.charCode &&
    prevProps.showCursor === nextProps.showCursor &&
    prevProps.characterState === nextProps.characterState
);

export default Character;