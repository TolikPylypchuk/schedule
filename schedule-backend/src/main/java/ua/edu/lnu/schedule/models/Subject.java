package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "subjects")
public class Subject implements Serializable {
	private Integer id;
	private String name;

	@JsonIgnore
	private ClassroomType classroom_type;

	@JsonIgnore
	private Set<Plan> plans;

	@JsonIgnore
	private Set<Class> classes;

	@JsonIgnore
	private Set<Lecturer> lecturers;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "name", length = 100, nullable = false)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "classroom_type", nullable = false)
	public ClassroomType getClassroom_type() {
		return this.classroom_type;
	}

	public void setClassroom_type(ClassroomType classroom_type) {
		this.classroom_type = classroom_type;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "subject")
	public Set<Plan> getPlans() {
		return this.plans;
	}

	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "subject")
	public Set<Class> getClasses() {
		return this.classes;
	}

	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}

	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "subjects")
	public Set<Lecturer> getLecturers() {
		return this.lecturers;
	}

	public void setLecturers(Set<Lecturer> lecturers) {
		this.lecturers = lecturers;
	}
}
