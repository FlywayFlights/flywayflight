import fs from "fs";
import csv from "csv-parser";

const results = [];

fs.createReadStream("airports.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push({
      name: data["name"] || data["airport_name"] || data["Airport Name"] || "",
      city: data["city"] || data["City"] || "",
      country: data["country"] || data["Country"] || "",
      iata: data["iata_code"] || data["IATA"] || "",
      icao: data["icao_code"] || data["ICAO"] || "",
    });
  })
  .on("end", () => {
    fs.writeFileSync("src/lib/airport.json", JSON.stringify(results, null, 2));
    console.log(
      `✅ Done! Exported ${results.length} airports to src/lib/airport.json`
    );
  });
