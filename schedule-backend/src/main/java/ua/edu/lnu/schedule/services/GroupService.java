package ua.edu.lnu.schedule.services;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.dataaccess.models.Group;
import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.dataaccess.models.Class;
import ua.edu.lnu.schedule.dataaccess.models.Department;
import ua.edu.lnu.schedule.dataaccess.repositories.ClassRepository;
import ua.edu.lnu.schedule.dataaccess.repositories.GroupRepository;
import ua.edu.lnu.schedule.dataaccess.repositories.PlanRepository;
import ua.edu.lnu.schedule.dataaccess.repositories.DepartmentRepository;

public class GroupService {
	private ClassRepository classes;
	private DepartmentRepository departments;
	private GroupRepository groups;
	private PlanRepository plans;	
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}

	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}

	@Autowired
	public void setDepartments(DepartmentRepository departments) {
		this.departments = departments;
	}
	
	public Iterable<Group> getAll() {
		return this.groups.findAll();
	}
	
	public Group getById(int id) {
		Group group = this.groups.findOne(id);
		
		return group;
	}
	
	public Iterable<Group> getByYear(int year) {
		return this.groups.findAllByYear(year);		
	}

	public Iterable<Group> getByClass(int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.groups.findAllByClassesContaining(c);		
	}
	
	public Iterable<Group> getByFaculty(int facultyId) {		
		return this.groups.findAllByDepartment_Id(facultyId);
	}
	
	public Iterable<Group> getByFacultyAndYear(int facultyId, int year) {
		return this.groups.findAllByDepartment_IdAndYear(facultyId, year);
	}
	
	public Iterable<Group> getByFacultyAndYearSince(int facultyId, int year) {
		return this.groups.findAllByDepartment_IdAndYearGreaterThanEqual(
			facultyId, year);
	}
	
	public Group getByPlan(int planId) {
		Plan plan = this.plans.findOne(planId);
		Department department = plan.getDepartment();
		
		return this.groups.findByDepartmentsContaining(department);
	}
	
	public Iterable<Group> getAvailable(
			int facultyId,
			int subjectId,
			int day,
			int number,
			String frequencyName) {
		Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
		
		Semester currentSemester =
			Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
		
		Class.Frequency frequency =
			Class.Frequency.valueOf(frequencyName.toUpperCase());
		
		int currentYear = currentSemester == Semester.FIRST
			? calendar.get(Calendar.YEAR)
			: calendar.get(Calendar.YEAR) - 1;
		
		List<Plan> plans = this.plans.findAllBySubject_IdAndSemesterAndYear(
			subjectId, currentSemester, currentYear);
		
		Class.Frequency weekly = Class.Frequency.WEEKLY;
		
		List<Class> potentialClasses = frequency == weekly
			? this.classes.findAllByDayOfWeekAndNumberAndYearAndSemester(
				DayOfWeek.of(day), number, currentYear, currentSemester)
			: this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
				DayOfWeek.of(day), number, frequency, currentYear, currentSemester);
		
		if (frequency != weekly) {
			potentialClasses.addAll(
				this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
					DayOfWeek.of(day), number, weekly, currentYear, currentSemester));
		}
		
		List<Integer> departmentIds = this.departments.findAllByFaculty_Id(facultyId)
				.stream().map(d -> d.getId()).collect(Collectors.toList());
		
		return this.groups.findAllByDepartment_IdIn(departmentIds).stream()
			.filter(group -> plans.stream()
				.anyMatch(plan -> Objects.equals(plan.getDepartment(), group.getDepartment())))
			.filter(group -> potentialClasses.stream()
				.flatMap(c -> c.getGroups().stream())
				.noneMatch(g -> Objects.equals(g.getId(), group.getId())))
			.collect(Collectors.toList());
	}
	

	public void add(Group group) {
		this.groups.save(group);
	}
	
	public void update(int id, Group group) {
		if (!this.groups.exists(id)) {
			return;
		}
		
		group.setId(id);
		this.groups.save(group);
		
	}

	public void delete(int id) {
		if (!this.groups.exists(id)) {
			return;
		}
		
		this.groups.delete(id);
	}
}
