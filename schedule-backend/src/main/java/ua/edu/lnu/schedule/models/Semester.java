package ua.edu.lnu.schedule.models;

public enum Semester {
	FIRST(1),
	SECOND(2);
	
	private final int number;
	
	Semester(int number) {
		this.number = number;
	}
	
	public int getNumber() {
		return number;
	}
}
