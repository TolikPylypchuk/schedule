package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lecturers")
public class Lecturer implements Serializable {
	private Integer id;
	private String firstName;
	private String middleName;
	private String lastName;
	private String position;
	
	private Faculty faculty;
	
	@JsonIgnore
	private Set<Subject> subjects;
	
	@JsonIgnore
	private Set<Class> classes;
	
	@JsonIgnore
	private Set<Wish> wishes;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "first_name", nullable = false, length = 20)
	public String getFirstName() {
		return this.firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	@Column(name = "middle_name", nullable = false, length = 20)
	public String getMiddleName() {
		return this.middleName;
	}
	
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	
	@Column(name = "last_name", nullable = false, length = 20)
	public String getLastName() {
		return this.lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	@Column(name = "position", nullable = false, length = 10)
	public String getPosition() {
		return this.position;
	}
	
	public void setPosition(String position) {
		this.position = position;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "faculty", nullable = false)
	public Faculty getFaculty() {
		return this.faculty;
	}
	
	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "lecturer_subject",
		joinColumns = { @JoinColumn(name = "lecturer") },
		inverseJoinColumns = { @JoinColumn(name = "subject") })
	public Set<Subject> getSubjects() {
		return subjects;
	}
	
	public void setSubjects(Set<Subject> subjects) {
		this.subjects = subjects;
	}
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "lecturers")
	public Set<Class> getClasses() {
		return classes;
	}
	
	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "lecturer")
	public Set<Wish> getWishes() {
		return wishes;
	}
	
	public void setWishes(Set<Wish> wishes) {
		this.wishes = wishes;
	}
}
