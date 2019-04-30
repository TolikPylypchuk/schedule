package ua.edu.lnu.schedule.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.*;

@RestController
@RequestMapping("/classes")
public class ClassController {
	private ClassRepository classes;
	private ClassroomRepository classrooms;
	private DepartmentRepository departments;
	private GroupRepository groups;
	private PlanRepository plans;
	private UserRepository users;
	
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms) {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
		
	@Autowired
	public void setDepartments(DepartmentRepository departments) {
		this.departments = departments;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@Autowired
	public void setUsers(UserRepository users) {
		this.users = users;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Class> getAll() {
		return this.classes.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Class getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Class c = this.classes.findOne(id);
		
		if (c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return c;
	}
	
	@GetMapping("/groupId/{groupId}")
	public @ResponseBody Iterable<Class> getByGroup(
		@PathVariable("groupId") int groupId) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContaining(group);
		
	}
	
	@GetMapping("/groupId/{groupId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContainingAndYearAndSemester(
				group, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/classroomId/{classroomId}")
	public @ResponseBody Iterable<Class> getByClassroom(
		@PathVariable("classroomId") int classroomId) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContaining(classroom);
		
	}
	
	@GetMapping("/classroomId/{classroomId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByClassroomYearSemester(
		@PathVariable("classroomId") int classroomId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContainingAndYearAndSemester(
				classroom, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/lecturerId/{lecturerId}")
	public @ResponseBody Iterable<Class> getByLecturer(
		@PathVariable("lecturerId") int lecturerId) {
		User lecturer = this.users.findOne(lecturerId);
		
		return lecturer == null ||
				lecturer.getAuthorities()
						.stream()
						.noneMatch(authority -> authority.getName() == Authority.Name.ROLE_LECTURER)
			? new ArrayList<>()
			: this.classes.findAllByLecturersContaining(lecturer);
		
	}
	
	@GetMapping("/lecturerId/{lecturerId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByLecturerYearSemester(
		@PathVariable("lecturerId") int lecturerId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		User lecturer = this.users.findOne(lecturerId);
		
		return lecturer == null ||
				lecturer.getAuthorities()
						.stream()
						.noneMatch(authority ->
							authority.getName() == Authority.Name.ROLE_LECTURER)
			? new ArrayList<>()
			: this.classes.findAllByLecturersContainingAndYearAndSemester(
				lecturer, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/day/{day}")
	public @ResponseBody Iterable<Class> getByDay(@PathVariable("day") int day) {
		return this.classes.findAllByDayOfWeek(DayOfWeek.of(day));
	}
	
	@GetMapping("/day/{day}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByDayYearSemester(
		@PathVariable("day") int day,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByDayOfWeekAndYearAndSemester(
			DayOfWeek.of(day), year, Semester.fromNumber(semester));
	}
	
	@GetMapping("/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByYearSemester(
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByYearAndSemester(
			year, Semester.fromNumber(semester));
	}

	@GetMapping("/generate/faculty/{faculty}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getGeneratedByFaculty(
		@PathVariable("faculty") int facultyId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		List<Department> departments = this.departments.findAllByFaculty_Id(facultyId);
		
		List<Plan> plans = this.plans.findAllByDepartmentInAndSemesterAndYear(departments, Semester.fromNumber(semester), year);
		List<Subject> subjects = plans.stream().map(plan -> plan.getSubject()).collect(Collectors.toList());

		List<Class> classes = new ArrayList<>();

		for(Plan plan : plans) {
			List<Class> generated = new ArrayList<Class>();
			
			Class template = new Class();
			template.setYear(year);
			template.setSemester(Semester.fromNumber(semester));
			template.setSubject(plan.getSubject());
			
			List<Group> groups = this.groups.findAllByDepartment_Id(plan.getDepartment().getId())
					.stream().filter(group -> Objects.equals(year - group.getYear(), plan.getCourse()))
					.collect(Collectors.toList());
			for(Group group : groups) {
				Set<Group> groupSet = new HashSet<Group>();
				groupSet.add(group);
				template.setGroups(groupSet);
				
				if (plan.getNumLectures() > 0) {
					template.setType(Class.Type.LECTURE);
					
					generated.add(template);
				}
				
				if (plan.getNumPractices() > 0) {
					template.setType(Class.Type.PRACTICE);
					
					generated.add(template);
				}
				
				if (plan.getNumLabs() > 0) {
					template.setType(Class.Type.LAB);
					
					generated.add(template);
				}

				classes.addAll(generated);
			}
		}
		
		return classes;
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Class c)
		throws URISyntaxException {
		this.classes.save(c);
		return ResponseEntity.created(
			new URI("/classes/" + c.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Class c) {
		if (!this.classes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		c.setId(id);
		this.classes.save(c);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.classes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.classes.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
