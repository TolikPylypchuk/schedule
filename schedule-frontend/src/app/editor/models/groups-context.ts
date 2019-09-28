import { ViewContext } from "./models";
import { Class, Group } from "../../common/models/models";
import { getCurrentGroupName, getCurrentYear, getCurrentSemester } from "../../common/models/functions";
import { ViewToggle } from "../components/helpers";
import { GroupService, ClassService } from "../../common/services/services";
import { Observable } from "rxjs/Observable";

export class GroupsContext implements ViewContext {
    toggle = ViewToggle.GROUPS;
    objects: Group[] = [];

    constructor(private groupService: GroupService,
        private classService: ClassService) {}

    getContextObjects(facultyId: number): Observable<Group[]> {
        return this.groupService.getGroupsByFaculty(facultyId);
    }

    getContextClassesForObject(groupId: number): Observable<Class[]> {
        return this.classService.getClassesByGroupAndYearAndSemester(
            groupId,
            getCurrentYear(),
            getCurrentSemester());
    }

    getClassContextObjects(c: Class): Group[] {
        return c.groups;
    }

    setClassContextObject(c: Class, groups: Group[]): Class {
        return Object.assign(c, { groups: groups });
    }

    getSuitableObjects(c: Class): Group[] {
        return c.groups;
    }

    getContextObjectName(group: Group): string {
        return getCurrentGroupName(group);
    }

    sortContextObjects(groups: Group[]): Group[] {
        return groups;
    }
}
