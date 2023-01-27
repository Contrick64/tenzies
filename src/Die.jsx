import { nanoid } from "nanoid";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  const pipElements = Array.from(Array(props.value)).map((item) => (
    <div key={nanoid()} className="pip" />
  ));

  return (
    <div
      className={`die-face ${props.isHeld && "held"}`}
      style={styles}
      onClick={props.holdDice}
      value={props.value}
    >
      {pipElements}
    </div>
  );
}
