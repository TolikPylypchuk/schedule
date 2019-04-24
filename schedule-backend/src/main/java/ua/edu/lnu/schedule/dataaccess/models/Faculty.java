package ua.edu.lnu.schedule.dataaccess.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "faculties")
public class Faculty implements Serializable {
	private Integer id;
	private String name;
	
	private Set<Department> departments;	
	/*private Set<Group> groups;*/

	private Set<Building> buildings;
	
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
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty", nullable = false)
	public Set<Department> getDepartments() {
		return this.departments;
	}
	
/*	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "faculty_department_group",
			joinColumns = {
				@JoinColumn(name = "faculty", referencedColumnName = "id")
			},
			inverseJoinColumns = {
				@JoinColumn(name = "group", referencedColumnName = "id")
			})
	public Set<Group> getGroups() {
		return this.groups;
	}
	
	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}*/	
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "faculty_building",
			joinColumns = {
				@JoinColumn(name = "faculty", referencedColumnName = "id")
			},
			inverseJoinColumns = {
				@JoinColumn(name = "building", referencedColumnName = "id")
			})
	public Set<Building> getBuildings() {
		return this.buildings;
	}
	
	public void setBuildings(Set<Building> buildings) {
		this.buildings = buildings;
	}	
}
