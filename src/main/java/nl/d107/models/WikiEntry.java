package nl.d107.models;

public class WikiEntry {

    private String id;

    private String name;

    private String txt;

    // Getters
    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }

    public String getTxt() {
        return txt;
    }

    // Setters
    public void setName(String newName) {
        this.name = newName;
    }

    public void setId(String newId) {
        this.id = newId;
    }

    public void setTxt(String newTxt) {
        this.name = newTxt;
    }

}
