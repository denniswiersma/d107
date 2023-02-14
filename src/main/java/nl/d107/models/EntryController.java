package nl.d107.models;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import com.opencsv.*;

public class EntryController {

    public static ArrayList<WikiEntry>  readCsv(String fName) {
        ArrayList<WikiEntry> entries = new ArrayList<>();
        try {

            // Create an object of filereader
            // class with CSV file as a parameter.
            FileReader filereader = new FileReader(fName);

            // create csvReader object passing
            // file reader as a parameter
            CSVReader csvReader = new CSVReader(filereader);
            String[] nextRecord;

            // we are going to read data line by line
            while ((nextRecord = csvReader.readNext()) != null) {
                WikiEntry newEntry = new WikiEntry(nextRecord[0], nextRecord[1], nextRecord[2]);
                entries.add(newEntry);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return entries;
    }
}
