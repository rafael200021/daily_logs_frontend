import { IUser } from "@/interfaces/IUser";
import {atom} from "recoil";

export const userState = atom<IUser | null>({
    key: "userState",
    default: null,
})