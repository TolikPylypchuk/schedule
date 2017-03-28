package ua.edu.lnu.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "groups")
public class Group implements Serializable {
	private Integer id;
	private String name;
	private int numStudents;
	private Faculty faculty;
	private Set<Class> classes;
	private Set<Subject> subjects;
	
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
		return classes;
	}
	
	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "group_subject")
	public Set<Subject> getSubjects() {
		return subjects;
	}
	
	public void setSubjects(Set<Subject> subjects) {
		this.subjects = subjects;
	}
}
