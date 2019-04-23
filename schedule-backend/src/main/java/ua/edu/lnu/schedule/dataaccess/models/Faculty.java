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
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "faculty")
	public Set<Department> getGroups() {
		return this.departments;
	}
	
	public void setGroups(Set<Department> departments) {
		this.departments = departments;
	}
	
}
