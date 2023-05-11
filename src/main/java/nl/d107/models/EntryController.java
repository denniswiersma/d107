package nl.d107.models;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import com.opencsv.*;

public class EntryController {
    public static List<WikiEntry> readCsv(String fileName) {
        List<WikiEntry> allEntries = new ArrayList<>();
        try {
            // Create a FileReader object with the CSV file
            FileReader fileReader = new FileReader(fileName);
            // Create CSVReader object from FileReader
            CSVReader csvReader = new CSVReader(fileReader);

            // Read entries per line, creating WikiEntry records and adding them to the entries list
            String[] nextRecord;
            while ((nextRecord = csvReader.readNext()) != null) {
                WikiEntry newEntry = new WikiEntry(nextRecord[0], nextRecord[1], nextRecord[2]);
                allEntries.add(newEntry);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return allEntries;
    }
}
