package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User implements Serializable {
	private Integer id;
	private String username;
	private String password;
	private String firstName;
	private String middleName;
	private String lastName;
	private String position;
	private Date lastPasswordReset;
	
	private Faculty faculty;
	private Set<Authority> authorities;
	private Set<Subject> subjects;
	private Set<Class> classes;
	private Set<Wish> wishes;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "username", nullable = false, length = 50)
	public String getUsername() {
		return this.username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	@JsonIgnore
	@Column(name = "password", nullable = false, length = 70)
	public String getPassword() {
		return this.password;
	}
	
	public void setPassword(String password) {
		this.password = password;
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
	
	@Column(name = "position", length = 10)
	public String getPosition() {
		return this.position;
	}
	
	public void setPosition(String position) {
		this.position = position;
	}
	
	@JsonIgnore
	@Column(name = "last_password_reset", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	public Date getLastPasswordReset() {
		return this.lastPasswordReset;
	}
	
	public void setLastPasswordReset(Date lastPasswordReset) {
		this.lastPasswordReset = lastPasswordReset;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "faculty", nullable = false)
	public Faculty getFaculty() {
		return this.faculty;
	}
	
	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		name = "authority_user",
		joinColumns = {
			@JoinColumn(name = "user", referencedColumnName = "id")
		},
		inverseJoinColumns = {
			@JoinColumn(name = "authority", referencedColumnName = "id")
		})
	public Set<Authority> getAuthorities() {
		return this.authorities;
	}
	
	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "lecturer_subject",
		joinColumns = {
			@JoinColumn(name = "lecturer", referencedColumnName = "id")
		},
		inverseJoinColumns = {
			@JoinColumn(name = "subject", referencedColumnName = "id")
		})
	public Set<Subject> getSubjects() {
		return subjects;
	}
	
	public void setSubjects(Set<Subject> subjects) {
		this.subjects = subjects;
	}
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "lecturers")
	public Set<Class> getClasses() {
		return classes;
	}
	
	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "lecturer")
	public Set<Wish> getWishes() {
		return wishes;
	}
	
	public void setWishes(Set<Wish> wishes) {
		this.wishes = wishes;
	}
}