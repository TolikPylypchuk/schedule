package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.sql.Time;
import java.time.DayOfWeek;

import javax.persistence.*;

@Entity
@Table(name = "wishes")
public class Wish implements Serializable {
	private Integer id;
	private Time startTime;
	private Time endTime;
	private boolean isSuitable;
	private String comment;
	private DayOfWeek dayOfWeek;
	private Lecturer lecturer;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "start_time")
	public Time getStartTime() {
		return this.startTime;
	}
	
	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}
	
	@Column(name = "end_time")
	public Time getEndTime() {
		return this.endTime;
	}
	
	public void setEndTime(Time endTime) {
		this.endTime = endTime;
	}
	
	@Column(name = "is_suitable")
	public boolean isSuitable() {
		return this.isSuitable;
	}
	
	public void setSuitable(boolean suitable) {
		isSuitable = suitable;
	}
	
	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name = "day_of_week")
	@Enumerated(EnumType.ORDINAL)
	public DayOfWeek getDayOfWeek() {
		return this.dayOfWeek;
	}
	
	public void setDayOfWeek(DayOfWeek dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "lecturer", nullable = false)
	public Lecturer getLecturer() {
		return lecturer;
	}
	
	public void setLecturer(Lecturer lecturer) {
		this.lecturer = lecturer;
	}
}
