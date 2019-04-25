package ua.edu.lnu.schedule.services;

import org.springframework.beans.factory.annotation.Autowired;
import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.dataaccess.repositories.PlanRepository;

public class PlanService {
    private PlanRepository plans;

    @Autowired
    public void setPlans(PlanRepository plans) {
        this.plans = plans;
    }

    public Iterable<Plan> getAll() {
        return this.plans.findAll();
    }

    public Plan getById(int id) {
        return this.plans.findOne(id);
    }

    public Iterable<Plan> getByDepartment(int departmentId) {
        return this.plans.findAllByDepartment_Id(departmentId);
    }

    public Iterable<Plan> getByGroup(int groupId) {
        return this.plans.findAllByDepartment_Id(groupId);
    }

    public Iterable<Plan> getByGroupYearSemester(
            int groupId,
            int year,
            int semester) {
        return this.plans.findAllByDepartment_IdAndSemesterAndYear(
                groupId, Semester.fromNumber(semester), year);
    }

    public Iterable<Plan> getBySubject(int subjectId) {
        return this.plans.findAllBySubject_Id(subjectId);
    }

    public Iterable<Plan> getBySubjectYearSemester(
            int subjectId,
            int year,
            int semester) {
        return this.plans.findAllBySubject_IdAndSemesterAndYear(
                subjectId, Semester.fromNumber(semester), year);
    }

    public void add(Plan plan) {
        this.plans.save(plan);
    }

    public void update(
            int id,
            Plan plan) {
        if (!this.plans.exists(id)) {
            return;
        }

        plan.setId(id);
        this.plans.save(plan);
    }

    public void delete(int id) {
        if (!this.plans.exists(id)) {
            return;
        }

        this.plans.delete(id);
    }
}
