import React, { useState, useEffect } from "react";
import axios from "axios";
import * as arrow from "apache-arrow";

function ArrowDataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  function extractDataFromTable(table) {
    let extractedData = [];

    // Iterate over each row of the table
    for (const row of table) {
      const rowJson = row.toJSON();
      if (rowJson.origin_lat instanceof Float64Array) {
        rowJson.origin_lat = Array.from(rowJson.origin_lat)[0]; // Assuming only one element in the array
      }
      if (rowJson.origin_lon instanceof Float64Array) {
        rowJson.origin_lon = Array.from(rowJson.origin_lon)[0]; // Assuming only one element in the array
      }

      extractedData.push(rowJson);
    }

    return extractedData;
  }

  useEffect(() => {
    const fetchArrowData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/getProperties",
          {
            responseType: "arraybuffer",
          }
        );

        const buffer = new Uint8Array(response.data);
        const table = arrow.tableFromIPC(buffer);

        console.log(table);
        const extractedData = extractDataFromTable(table);
        setData(extractedData);
        // console.log(extractedData);
        // Convert the response data to a Uint8Array
        // const arrowData = new Uint8Array(response.data);

        // // Create an ArrowReader instance
        // const reader = new ArrowReader(arrowData);

        // // Read the Arrow data
        // const table = await reader.read();

        // // Extract data from the table
        // const rows = table.map((row) => ({
        //   name: row.get("name").toString(),
        //   age: row.get("age").toString(),
        // }));

        // setData(rows);
      } catch (error) {
        console.error("Error fetching Arrow data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArrowData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Arrow Data:</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArrowDataComponent;
