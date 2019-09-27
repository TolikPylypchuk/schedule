import { ViewToggle } from "../components/helpers";
import { Class } from "../../common/models/models";

export class View {
    toggle: ViewToggle = ViewToggle.LECTURERS;
    objects: any[] = [];
    objectClasses: Map<number, Class[]> = new Map();

    getObjectName: (obj: any) => string = (obj) => "";
}
