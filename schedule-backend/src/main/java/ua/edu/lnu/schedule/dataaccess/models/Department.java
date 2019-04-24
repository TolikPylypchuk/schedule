package ua.edu.lnu.schedule.dataaccess.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "departments")
public class Department implements Serializable {
	private Integer id;
	private String name;
	
	private Faculty faculty;
	private Set<Group> groups;
	private Set<Plan> plans;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", unique = true, nullable = false, length = 50)
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty", nullable = false)
	public Faculty getFaculty() {
		return this.faculty;
	}
	
	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}	
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deapartments")
	public Set<Group> getGroups() {
		return this.groups;
	}
	
	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deapartments")
	public Set<Plan> getPlans() {
		return this.plans;
	}
	
	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}	
}
