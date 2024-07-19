import { Schema, type } from "@colyseus/schema";
import { PlayerStatus } from "../enums/PlayerStatus";

export class AxisData extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;
}

export class PlayerState extends Schema {
  @type("string") sessionId = "";
  @type("string") name: string = "Unknown";
  @type("string") color: string = getRandomColor();
  @type("string") status: PlayerStatus = PlayerStatus.CONNECTING;
  @type("boolean") isMoving: boolean = false;
  @type(AxisData) position: AxisData = new AxisData();
}

function getRandomColor(): string {
  const colors: string[] = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF8C33",
    "#A133FF",
    "#33FFF1",
    "#FF3333",
    "#33FF33",
    "#3333FF",
    "#FFFF33",
    "#33FFB8",
    "#B833FF",
    "#FF333F",
    "#33FFF8",
    "#FF9D33",
    "#FF33F6",
    "#33F6FF",
    "#F6FF33",
    "#FF3356",
    "#33FF93",
    "#9333FF",
    "#FF3393",
    "#33FF79",
    "#FF79FF",
    "#79FF33",
    "#3379FF",
    "#FF3333",
    "#33FFDD",
    "#FFDD33",
    "#DD33FF",
    "#33FF9D",
    "#9DFF33",
    "#FF333F",
    "#33FFDA",
    "#FFDA33",
    "#DA33FF",
    "#33FFAA",
    "#AA33FF",
    "#33FFA1",
    "#FFA133",
    "#A133FF",
    "#33FF85",
    "#FF8533",
    "#8533FF",
    "#33FF77",
    "#FF7733",
    "#7733FF",
    "#33FF66",
    "#FF6633",
    "#6633FF",
    "#33FF55",
    "#FF5533",
    "#5533FF",
    "#33FF44",
    "#FF4433",
    "#4433FF",
    "#33FF33",
    "#FF3333",
    "#3333FF",
    "#33FF22",
    "#FF2233",
    "#2233FF",
    "#33FF11",
    "#FF1133",
    "#1133FF",
    "#33FF00",
    "#FF0033",
    "#0033FF",
    "#FF33AA",
    "#AAFF33",
    "#33AAFF",
    "#FF33BB",
    "#BBFF33",
    "#33BBFF",
    "#FF33CC",
    "#CCFF33",
    "#33CCFF",
    "#FF33DD",
    "#DDFF33",
    "#33DDFF",
    "#FF33EE",
    "#EEFF33",
    "#33EEFF",
    "#FF33FF",
    "#FFFF33",
    "#33FFFF",
    "#FF6633",
    "#FFAA33",
    "#FFCC33",
    "#FF33AA",
    "#FF55AA",
    "#FF77AA",
    "#FF99AA",
    "#FFBBAA",
    "#FFDDAA",
    "#FFFFFF",
    "#000000",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
