import { IconType } from "react-icons";

export interface Agent {
  id: string;
  displayId: string;
  name: string;
  type: string;
  icon: IconType;
  description: string;
}
