import { Class } from "../../common/models/models";
import { ViewToggle } from "../components/helpers";
import { Observable } from "rxjs/Observable";

export interface ViewContext {
    toggle: ViewToggle;
    objects: any[];

    getContextObjects(facultyId: number): Observable<any[]>;
    getContextClassesForObject(objectId: number): Observable<Class[]>;
    getClassContextObjects(c: Class): any[];
    setClassContextObject(c: Class, contextObjects: any[]): Class;
    getSuitableObjects(c: Class): any[];
    getContextObjectName(obj: any): string;
    sortContextObjects(objects: any[]): any[];
    addClassContextObjectToView(c: Class, obj: any): Class;
    removeClassContextObjectFromView(c: Class, obj: any): Class;
    shouldAddToAvailableClasses(c: Class): boolean;
}
