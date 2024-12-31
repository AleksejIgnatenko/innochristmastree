import { CongratulationsItem } from "@/Models/CongratulationsItem";

export interface GroupedCongratulations {
    icon: string;
    count: number;
    congratulations: CongratulationsItem[];
  }