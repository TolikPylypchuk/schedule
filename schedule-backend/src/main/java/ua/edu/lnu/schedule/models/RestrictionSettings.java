package ua.edu.lnu.schedule.models;

import javax.persistence.*;

@Entity
@Table(name = "restriction_settings")
public class RestrictionSettings {
    private Integer id;
    private boolean isActive;
    private int settings;

    private Restriction restriction;
    private Faculty faculty;

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "restriction", nullable = false)
    public Restriction getRestriction() {
        return restriction;
    }

    public void setRestriction(Restriction restriction) {
        this.restriction = restriction;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty", nullable = false)
    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    @Column(name = "is_active", nullable = false)
    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @Column(name = "settings", nullable = false)
    public int getSettings() {
        return settings;
    }

    public void setSettings(int settings) {
        this.settings = settings;
    }
}
