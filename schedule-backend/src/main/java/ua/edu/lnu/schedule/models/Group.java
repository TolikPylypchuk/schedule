package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "groups")
public class Group implements Serializable {
	private Integer id;
	private String name;
	private int numStudents;
	
	@JsonIgnore
	private Faculty faculty;
	
	@JsonIgnore
	private Set<Class> classes;
	
	@JsonIgnore
	private Set<Plan> plans;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", unique = true, nullable = false, length = 10)
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "num_students", nullable = false)
	public int getNumStudents() {
		return this.numStudents;
	}
	
	public void setNumStudents(int numStudents) {
		this.numStudents = numStudents;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "faculty", nullable = false)
	public Faculty getFaculty() {
		return this.faculty;
	}
	
	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "groups")
	public Set<Class> getClasses() {
		return this.classes;
	}
	
	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "group")
	public Set<Plan> getPlans() {
		return this.plans;
	}
	
	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}
}
